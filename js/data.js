/**
 * データ処理モジュール (Data Module)
 * CSV データの読み込み、解析、処理を担当
 */

// グローバルデータ変数
let globalData = [];

/**
 * CSV文字列を配列オブジェクトに変換
 */
function csvToArray(str) {
    console.log('🔍 CSV パース開始');
    const lines = str.trim().split('\n');
    console.log('📋 総行数:', lines.length);
    
    if (lines.length === 0) return [];
    
    const headers = lines[0].split(',').map(h => h.trim());
    console.log('🏷️  ヘッダー:', headers);
    
    const result = [];
    let skippedRows = 0;
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue; // 空行をスキップ
        
        // 簡易 CSV パース（クォーテーション対応）
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim().replace(/^"|"$/g, ''));
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current.trim().replace(/^"|"$/g, ''));
        
        // ✅ カラム数チェック: 4カラム必須
        if (values.length < 4) {
            console.warn(`⚠️  スキップ行${i}: カラム数不足 (${values.length}/4) - "${line.substring(0, 50)}..."`);
            skippedRows++;
            continue;
        }
        
        // ✅ 売上値チェック: 数値でなければスキップ
        const salesValue = values[3]?.trim();
        if (!salesValue || isNaN(Number(salesValue))) {
            console.warn(`⚠️  スキップ行${i}: 売上値が無効 - "${line.substring(0, 50)}..."`);
            skippedRows++;
            continue;
        }
        
        // オブジェクトに変換
        let obj = {};
        headers.forEach((h, idx) => {
            obj[h] = values[idx] || '';
        });
        
        // 最初の3行をデバッグ出力
        if (result.length < 3) {
            console.log(`📍 行${result.length}:`, obj);
        }
        
        result.push(obj);
    }
    
    console.log('✅ CSV パース完了:', result.length, '行', `(スキップ: ${skippedRows}行)`);
    return result;
}

/**
 * データを読み込む（Googleスプレッドシートまたはデモデータ）
 */
async function loadData(dataType = 'real') {
    // 認証済みの場合は、まずGoogleスプレッドシートから読み込みを試みる
    if (typeof isAuthenticated === 'function' && isAuthenticated() && typeof loadSalesDataFromSpreadsheet === 'function') {
        try {
            console.log('📊 Googleスプレッドシートからデータを読み込み中...');
            const spreadsheetData = await loadSalesDataFromSpreadsheet();
            
            if (spreadsheetData && spreadsheetData.length > 0) {
                console.log('✅ Googleスプレッドシートからデータ取得成功:', spreadsheetData.length, '行');
                globalData = spreadsheetData;
                
                // データ情報を更新
                updateDataInfo(spreadsheetData);
                
                // プルダウンの選択肢をセット
                setupMonthSelector(spreadsheetData);

                // 初期表示は月分析
                showMonthAnalysis();
                
                // 月選択divを表示
                const monthSelectDiv = document.getElementById('month-select-div');
                if (monthSelectDiv) {
                    monthSelectDiv.style.display = 'block';
                }
                
                return spreadsheetData;
            }
        } catch (error) {
            console.warn('⚠️ Googleスプレッドシートからの読み込みに失敗、CSVにフォールバック:', error.message);
        }
    }
    
    // フォールバック: CSVファイルから読み込み
    const url = IS_GITHUB_PAGES 
        ? './sales.csv'  // GitHub Pages: 相対パスでCSVファイルを読み込み
        : `${API_BASE_URL}/sales.csv`;
    console.log(`📥 データ取得中: ${dataType} data from ${url}`);
    
    return fetch(url)
        .then(response => {
            console.log('📦 レスポンス受信:', response.status, response.statusText);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.text();
        })
        .then(text => {
            console.log('📄 CSVテキスト取得成功:', text.length, '文字');
            console.log('📝 CSVテキストの最初の200文字:', text.substring(0, 200));
            const data = csvToArray(text);
            console.log('📊 CSV解析完了:', data.length, '行');
            console.log('🔍 データサンプル:', data.slice(0, 3));
            globalData = data;
            
            // データ情報を更新
            updateDataInfo(data);
            
            // プルダウンの選択肢をセット
            setupMonthSelector(data);

            // 初期表示は月分析
            showMonthAnalysis();
            
            // 月選択divを表示
            const monthSelectDiv = document.getElementById('month-select-div');
            if (monthSelectDiv) {
                monthSelectDiv.style.display = 'block';
            }
            
            return data;
        })
        .catch(error => {
            console.error('❌ データ取得エラー:', error);
            const errorMsg = `データの取得に失敗しました: ${error.message}`;
            console.error(errorMsg);
            
            // エラー情報を表示
            const dataInfo = document.getElementById('data-info');
            if (dataInfo) {
                dataInfo.innerHTML = `
                    <div style="
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-bottom: 8px;
                    ">
                        <span style="font-size: 16px; margin-right: 8px;">❌</span>
                        <strong style="color: #dc2626;">
                            データ読み込みエラー
                        </strong>
                    </div>
                    <div style="font-size: 13px; color: #dc2626;">
                        ${errorMsg}
                    </div>
                `;
            }
            throw error;
        });
}

/**
 * データ情報をUIに更新
 */
function updateDataInfo(data) {
    const dataInfo = document.getElementById('data-info');
    if (dataInfo) {
        const recordCount = data.length;
        const totalSales = data.reduce((sum, row) => {
            const sales = parseInt(row['売り上げ'] || 0);
            return sum + sales;
        }, 0);
        dataInfo.innerHTML = `
            <div style="
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 8px;
            ">
                <span style="font-size: 16px; margin-right: 8px;">✅</span>
                <strong style="color: #0369a1;">
                    💼 売上データ 読み込み完了
                </strong>
            </div>
            <div style="font-size: 13px; color: #0369a1;">
                📊 ${recordCount}件のレコード | 💰 総売上: ¥${totalSales.toLocaleString()}
            </div>
        `;
    } else {
        console.warn('⚠️ data-info要素が見つかりません');
    }
}

/**
 * 月選択プルダウンをセットアップ
 */
function setupMonthSelector(data) {
    const monthSelect = document.getElementById('month-select');
    if (!monthSelect) {
        console.warn('⚠️ month-select要素が見つかりません');
        return;
    }
    
    // データから月を取得してソート
    const months = Array.from(new Set(
        data.filter(row => row && row['日付']).map(row => row['日付'].slice(0,7))
    )).sort();
    
    console.log('📅 利用可能な月:', months);
    
    // セレクトボックスを初期化
    monthSelect.innerHTML = '';
    
    // 月のオプションを追加
    months.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m;
        opt.textContent = m;
        monthSelect.appendChild(opt);
    });
    
    // デフォルトは最新月を選択
    if (months.length > 0) {
        monthSelect.value = months[months.length - 1];
        console.log('📅 デフォルト月を選択:', monthSelect.value);
    }
    
    // プルダウン変更時のイベント
    monthSelect.onchange = () => {
        console.log('📅 月が変更されました:', monthSelect.value);
        showMonthAnalysis();
    };
}

/**
 * データをフィルタリング（月別）
 */
function filterDataByMonth(data, month) {
    return data.filter(row => row && row['日付'] && row['日付'].startsWith(month));
}

/**
 * データをフィルタリング（年別）
 */
function filterDataByYear(data, year) {
    return data.filter(row => row && row['日付'] && row['日付'].startsWith(year));
}

/**
 * 支払い者別の統計を取得
 */
function getPayerStats(data) {
    const stats = {};
    data.forEach(row => {
        if (!row || !row['支払い者']) return;
        const payer = row['支払い者'];
        if (payer === '不明') return; // 除外
        const sales = Number(row['売り上げ']) || 0;
        if (!stats[payer]) stats[payer] = 0;
        stats[payer] += sales;
    });
    return stats;
}

/**
 * 月別統計を取得
 */
function getMonthlyStats(data) {
    const stats = {};
    data.forEach(row => {
        if (!row || !row['日付']) return;
        const month = row['日付'].slice(0,7); // YYYY/MM
        const sales = Number(row['売り上げ']) || 0;
        if (!stats[month]) stats[month] = 0;
        stats[month] += sales;
    });
    return stats;
}

/**
 * 曜日別統計を取得
 */
function getWeekdayStats(data) {
    // グラフ表示と同じ順序: 月〜日
    const weekdayOrder = ['月', '火', '水', '木', '金', '土', '日'];
    const weekdayMap = ['日', '月', '火', '水', '木', '金', '土']; // getDay()の戻り値用
    const stats = {};
    weekdayOrder.forEach(day => stats[day] = 0);
    
    data.forEach(row => {
        if (!row || !row['日付']) return;
        const date = new Date(row['日付']);
        const weekday = weekdayMap[date.getDay()];
        const sales = Number(row['売り上げ']) || 0;
        stats[weekday] += sales;
    });
    return stats;
}

/**
 * グローバルデータを取得
 */
function getGlobalData() {
    return globalData;
}

/**
 * グローバルデータを設定
 */
function setGlobalData(data) {
    globalData = data;
}

/**
 * データの要約統計を取得
 */
function getDataSummary(data) {
    if (!data || data.length === 0) {
        return {
            recordCount: 0,
            totalSales: 0,
            averageSales: 0,
            uniquePayers: 0,
            dateRange: { start: null, end: null }
        };
    }
    
    const totalSales = data.reduce((sum, row) => {
        return sum + (Number(row['売り上げ']) || 0);
    }, 0);
    
    const uniquePayers = new Set(
        data.filter(row => row['支払い者'] && row['支払い者'] !== '不明')
            .map(row => row['支払い者'])
    ).size;
    
    const dates = data.filter(row => row['日付']).map(row => row['日付']).sort();
    const dateRange = {
        start: dates[0] || null,
        end: dates[dates.length - 1] || null
    };
    
    return {
        recordCount: data.length,
        totalSales,
        averageSales: Math.round(totalSales / data.length),
        uniquePayers,
        dateRange
    };
}