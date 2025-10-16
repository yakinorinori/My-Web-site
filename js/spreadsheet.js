/**
 * Googleスプレッドシート連携モジュール (Spreadsheet Module)
 * Netlify Functions経由でGoogle Sheets APIを使用
 * 🔒 APIキーはサーバー側で安全に管理されます
 */

// 設定キー
const SPREADSHEET_CONFIG_KEY = 'spreadsheet_config';

// Netlify Functions エンドポイント
const NETLIFY_FUNCTION_URL = '/.netlify/functions/sheets';

/**
 * マイグレーション: 古いAPI Key情報を削除
 */
function migrateOldApiKeySettings() {
    try {
        const stored = localStorage.getItem(SPREADSHEET_CONFIG_KEY);
        if (stored) {
            const config = JSON.parse(stored);
            // API Keyが保存されていたら削除
            if (config.apiKey) {
                console.log('🔄 古いAPI Key設定を削除します');
                delete config.apiKey;
                delete config._warning;
                localStorage.setItem(SPREADSHEET_CONFIG_KEY, JSON.stringify(config));
                console.log('✅ マイグレーション完了: API KeyはNetlify Functionsで管理されます');
            }
        }
    } catch (error) {
        console.error('⚠️ マイグレーションエラー:', error);
    }
}

// ページ読み込み時にマイグレーション実行
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', migrateOldApiKeySettings);
}

/**
 * Netlify Functions経由でスプレッドシート操作を実行
 */
async function callNetlifyFunction(action, params) {
    try {
        const response = await fetch(NETLIFY_FUNCTION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action,
                ...params
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Netlify Function エラー (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('❌ Netlify Function呼び出しエラー:', error);
        throw error;
    }
}

/**
 * スプレッドシート設定を保存
 */
function saveSpreadsheetSettings() {
    const url = document.getElementById('spreadsheet-url')?.value;
    const sheetName = document.getElementById('sheet-name')?.value || '売上データ';
    
    if (!url) {
        showSpreadsheetStatus('⚠️ スプレッドシートURLは必須です', 'warning');
        return;
    }
    
    // スプレッドシートIDを抽出
    const sheetId = extractSheetId(url);
    if (!sheetId) {
        showSpreadsheetStatus('❌ 無効なスプレッドシートURLです', 'error');
        return;
    }
    
    const config = {
        url,
        sheetId,
        sheetName,
        savedAt: new Date().toISOString()
    };
    
    localStorage.setItem(SPREADSHEET_CONFIG_KEY, JSON.stringify(config));
    
    console.log('📊 スプレッドシート設定保存:', { sheetId, sheetName });
    
    // 設定を即座に反映（リロード不要）
    if (document.getElementById('spreadsheet-url')) {
        document.getElementById('spreadsheet-url').value = url;
    }
    if (document.getElementById('sheet-name')) {
        document.getElementById('sheet-name').value = sheetName;
    }
    
    showSpreadsheetStatus('✅ 設定を保存しました！「📥 データ読み込み」ボタンでデータを取得できます', 'success');
}

/**
 * スプレッドシート設定を読み込み
 */
function loadSpreadsheetSettings() {
    try {
        const config = localStorage.getItem(SPREADSHEET_CONFIG_KEY);
        if (!config) return;
        
        const settings = JSON.parse(config);
        
        // フォームに設定値を反映
        const urlInput = document.getElementById('spreadsheet-url');
        const sheetNameInput = document.getElementById('sheet-name');
        
        if (urlInput && settings.url) {
            urlInput.value = settings.url;
        }
        if (sheetNameInput && settings.sheetName) {
            sheetNameInput.value = settings.sheetName;
        }
        
        console.log('✅ スプレッドシート設定を読み込みました');
    } catch (error) {
        console.error('⚠️ 設定読み込みエラー:', error);
    }
}

/**
 * スプレッドシート接続テスト
 */
async function testSpreadsheetConnection() {
    const config = getSpreadsheetConfig();
    
    if (!config || !config.sheetId) {
        showSpreadsheetStatus('⚠️ スプレッドシートIDが設定されていません。まず「💾 設定保存」してください', 'warning');
        return;
    }
    
    showSpreadsheetStatus('🔍 接続テスト中...', 'info');
    
    console.log('🔧 接続テスト開始:', {
        sheetId: config.sheetId,
        sheetName: config.sheetName,
        functionUrl: NETLIFY_FUNCTION_URL
    });
    
    try {
        const result = await callNetlifyFunction('test', {
            sheetId: config.sheetId,
            sheetName: config.sheetName
        });
        
        if (result.success) {
            showSpreadsheetStatus(`✅ 接続成功！${result.title || 'スプレッドシート'}に接続できました`, 'success');
            console.log('✅ スプレッドシート情報:', result);
        } else {
            throw new Error(result.error || '接続テスト失敗');
        }
    } catch (error) {
        console.error('❌ 接続テストエラー:', error);
        let errorMsg = `❌ 接続失敗: ${error.message}`;
        
        if (error.message.includes('404')) {
            errorMsg += '\n\n💡 Netlify Functionsがデプロイされていない可能性があります。';
        } else if (error.message.includes('403')) {
            errorMsg += '\n\n💡 API Keyが無効か、スプレッドシートの共有設定を確認してください。';
        }
        
        showSpreadsheetStatus(errorMsg, 'error');
    }
}

/**
 * URLからスプレッドシートIDを抽出
 */
function extractSheetId(url) {
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
}

/**
 * 今日の売上データを送信
 */
async function sendTodayData() {
    const config = getSpreadsheetConfig();
    if (!config || !config.sheetId) {
        showSpreadsheetStatus('⚠️ スプレッドシートが設定されていません', 'warning');
        return;
    }
    
    showSpreadsheetStatus('📤 今日のデータを送信中...', 'info');
    
    try {
        // 今日のデータを集計
        const todayData = await getTodaysSalesData();
        
        if (!todayData || todayData.totalSales === 0) {
            showSpreadsheetStatus('⚠️ 今日の売上データがありません', 'warning');
            return;
        }
        
        // Netlify Functions経由でスプレッドシートに書き込み
        const result = await callNetlifyFunction('append', {
            sheetId: config.sheetId,
            sheetName: config.sheetName || '売上データ',
            values: [[
                todayData.date,
                todayData.payer || '不明',
                todayData.totalCustomers,
                todayData.totalSales
            ]]
        });
        
        if (result.success) {
            showSpreadsheetStatus(`✅ データ送信完了！売上: ¥${todayData.totalSales.toLocaleString()}, 客数: ${todayData.totalCustomers}人`, 'success');
        } else {
            throw new Error(result.error || 'データ送信失敗');
        }
        
    } catch (error) {
        console.error('❌ データ送信エラー:', error);
        showSpreadsheetStatus(`❌ データ送信失敗: ${error.message}`, 'error');
    }
}

/**
 * 今日の売上データを集計
 */
async function getTodaysSalesData() {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const todayFormatted = today.replace(/-/g, '/').replace(/^\d{4}\//, ''); // MM/DD形式
    
    const data = getGlobalData();
    if (!data || data.length === 0) {
        throw new Error('売上データが読み込まれていません');
    }
    
    // 今日のデータを抽出
    const todayRecords = data.filter(row => {
        if (!row || !row['日付']) return false;
        const date = row['日付'];
        return date.includes(todayFormatted) || date === todayFormatted;
    });
    
    if (todayRecords.length === 0) {
        return null;
    }
    
    // データを集計
    let totalSales = 0;
    let totalCustomers = 0;
    const customers = new Set();
    
    todayRecords.forEach(row => {
        const sales = Number(row['売り上げ']) || 0;
        const customerCount = Number(row['客数']) || 0;
        const person = row['支払い者'];
        
        totalSales += sales;
        totalCustomers += customerCount;
        if (person) customers.add(person);
    });
    
    return {
        date: todayFormatted,
        totalSales,
        totalCustomers,
        uniqueCustomers: customers.size,
        recordCount: todayRecords.length,
        details: todayRecords
    };
}

/**
 * スプレッドシート設定を取得（LocalStorageまたは入力フィールドから）
 */
function getSpreadsheetConfig() {
    // まずLocalStorageから取得を試みる
    try {
        const stored = localStorage.getItem(SPREADSHEET_CONFIG_KEY);
        if (stored) {
            const config = JSON.parse(stored);
            
            if (config.sheetId && config.sheetName) {
                return {
                    sheetId: config.sheetId,
                    sheetName: config.sheetName,
                    url: config.url
                };
            }
        }
    } catch (error) {
        console.error('設定読み込みエラー:', error);
    }
    
    // LocalStorageになければ入力フィールドから取得
    const url = document.getElementById('spreadsheet-url')?.value;
    const sheetName = document.getElementById('sheet-name')?.value || '売上データ';
    
    if (!url) {
        showSpreadsheetStatus('⚠️ スプレッドシート設定がありません。URLを入力して「💾 設定保存」ボタンをクリックしてください', 'warning');
        return null;
    }
    
    const sheetId = extractSheetId(url);
    if (!sheetId) {
        showSpreadsheetStatus('❌ 無効なスプレッドシートURLです', 'error');
        return null;
    }
    
    return { url, sheetId, sheetName };
}

/**
 * ステータスメッセージを表示
 */
function showSpreadsheetStatus(message, type = 'info') {
    const statusDiv = document.getElementById('spreadsheet-status');
    if (!statusDiv) return;
    
    const colors = {
        success: { bg: '#dcfce7', border: '#22c55e', text: '#15803d' },
        error: { bg: '#fef2f2', border: '#ef4444', text: '#dc2626' },
        warning: { bg: '#fef3c7', border: '#f59e0b', text: '#d97706' },
        info: { bg: '#dbeafe', border: '#3b82f6', text: '#1d4ed8' }
    };
    
    const color = colors[type] || colors.info;
    
    statusDiv.style.cssText = `
        background: ${color.bg};
        border: 1px solid ${color.border};
        color: ${color.text};
        padding: 16px;
        border-radius: 8px;
        margin-top: 16px;
        display: block;
        font-weight: 500;
    `;
    
    statusDiv.textContent = message;
    
    // 成功メッセージは3秒後に自動で非表示
    if (type === 'success') {
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 3000);
    }
}

/**
 * スプレッドシートから売上データを取得してCSV形式に変換
 */
async function loadSalesDataFromSpreadsheet() {
    try {
        const config = getSpreadsheetConfig();
        if (!config || !config.sheetId) {
            throw new Error('スプレッドシート設定が見つかりません');
        }
        
        showSpreadsheetStatus('📊 スプレッドシートからデータを読み込み中...', 'info');
        
        // Netlify Functions経由でデータを取得
        const result = await callNetlifyFunction('read', {
            sheetId: config.sheetId,
            sheetName: config.sheetName || '売上データ',
            range: 'A:E' // 日付、支払い者、客数、売り上げ、その他
        });
        
        if (!result.success || !result.values || result.values.length === 0) {
            throw new Error('スプレッドシートにデータがありません');
        }
        
        // データをCSV形式に変換
        const csvData = convertSpreadsheetDataToCSV(result.values);
        
        showSpreadsheetStatus(`✅ ${result.values.length - 1}件のデータを読み込みました`, 'success');
        
        return csvData;
        
    } catch (error) {
        console.error('❌ スプレッドシートデータ読み込みエラー:', error);
        showSpreadsheetStatus(`❌ データ読み込み失敗: ${error.message}`, 'error');
        throw error;
    }
}

/**
 * スプレッドシートのデータをCSV形式の配列に変換
 */
function convertSpreadsheetDataToCSV(values) {
    if (!values || values.length < 2) {
        return [];
    }
    
    // ヘッダー行を取得（1行目）
    const headers = values[0];
    
    // ヘッダーから列のインデックスを特定
    const dateCol = findColumnIndex(headers, ['日付', 'date', '日付']);
    const payerCol = findColumnIndex(headers, ['支払い者', 'payer', '名前', 'name']);
    const customersCol = findColumnIndex(headers, ['客数', 'customers', '人数']);
    const salesCol = findColumnIndex(headers, ['売り上げ', 'sales', '売上', '金額', 'amount']);
    
    // データ行を変換（2行目以降）
    const csvData = [];
    for (let i = 1; i < values.length; i++) {
        const row = values[i];
        
        // 空行をスキップ
        if (!row || row.length === 0 || !row[dateCol]) {
            continue;
        }
        
        csvData.push({
            '日付': row[dateCol] || '',
            '支払い者': row[payerCol] || '不明',
            '客数': parseInt(row[customersCol]) || 0,
            '売り上げ': parseInt(row[salesCol]) || 0
        });
    }
    
    console.log(`📊 スプレッドシートから${csvData.length}件のデータを変換しました`);
    return csvData;
}

/**
 * ヘッダーから列のインデックスを検索
 */
function findColumnIndex(headers, possibleNames) {
    for (let i = 0; i < headers.length; i++) {
        const header = (headers[i] || '').toString().trim();
        for (const name of possibleNames) {
            if (header.includes(name) || header.toLowerCase().includes(name.toLowerCase())) {
                return i;
            }
        }
    }
    return -1;
}

/**
 * スプレッドシートからデータを読み込んでシステムに反映
 */
async function syncDataFromSpreadsheet() {
    try {
        showSpreadsheetStatus('🔄 スプレッドシートと同期中...', 'info');
        
        const csvData = await loadSalesDataFromSpreadsheet();
        
        // グローバルデータを更新
        if (typeof setGlobalData === 'function') {
            setGlobalData(csvData);
            showSpreadsheetStatus('✅ データ同期完了！', 'success');
            
            // UIを更新
            if (typeof showYearAnalysis === 'function') {
                showYearAnalysis();
            }
        } else {
            throw new Error('データ設定関数が見つかりません');
        }
        
    } catch (error) {
        console.error('❌ データ同期エラー:', error);
        showSpreadsheetStatus(`❌ 同期失敗: ${error.message}`, 'error');
    }
}

// グローバル関数として公開
window.saveSpreadsheetSettings = saveSpreadsheetSettings;
window.loadSpreadsheetSettings = loadSpreadsheetSettings;
window.testSpreadsheetConnection = testSpreadsheetConnection;
window.sendTodayData = sendTodayData;
window.loadSalesDataFromSpreadsheet = loadSalesDataFromSpreadsheet;
window.syncDataFromSpreadsheet = syncDataFromSpreadsheet;

// 初期化：デフォルトAPI Keyを自動設定
if (typeof window !== 'undefined') {
    // ページ読み込み時に自動実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeDefaultApiKey);
    } else {
        initializeDefaultApiKey();
    }
}