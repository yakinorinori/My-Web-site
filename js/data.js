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
    const rows = str.trim().split('\n');
    const headers = rows[0].split(',');
    return rows.slice(1).map(row => {
        const values = row.split(',');
        let obj = {};
        headers.forEach((h, i) => obj[h] = values[i]);
        return obj;
    });
}

/**
 * データを読み込む（リアルデータ、サンプルデータ、またはデモデータ）
 */
function loadData(dataType = 'real') {
    // GitHub Pages環境では静的ファイルを直接読み込み
    let csvFileName;
    switch (dataType) {
        case 'sample':
            csvFileName = 'sample.csv';
            break;
        case 'real':
        default:
            csvFileName = 'sales.csv';
            break;
    }
    
    const url = IS_GITHUB_PAGES 
        ? `./${csvFileName}`  // GitHub Pages: 相対パスでCSVファイルを読み込み
        : `${API_BASE_URL}/${csvFileName}`;
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
    if (monthSelect) {
        const months = Array.from(new Set(
            data.filter(row => row && row['日付']).map(row => row['日付'].slice(0,7))
        )).sort();
        monthSelect.innerHTML = '';
        months.forEach(m => {
            const opt = document.createElement('option');
            opt.value = m;
            opt.textContent = m;
            monthSelect.appendChild(opt);
        });
        // デフォルトは最新月
        if (months.length > 0) monthSelect.value = months[months.length-1];
        
        // プルダウン変更時のイベント
        monthSelect.onchange = () => {
            showMonthAnalysis();
        };
    }
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
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const stats = {};
    weekdays.forEach(day => stats[day] = 0);
    
    data.forEach(row => {
        if (!row || !row['日付']) return;
        const date = new Date(row['日付']);
        const weekday = weekdays[date.getDay()];
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