/**
 * Googleスプレッドシート連携モジュール (Spreadsheet Module)
 * Google Sheets APIを使用したデータ読み書き機能
 */

// 設定キー
const SPREADSHEET_CONFIG_KEY = 'spreadsheet_config';

/**
 * スプレッドシート設定を保存
 */
function saveSpreadsheetSettings() {
    const url = document.getElementById('spreadsheet-url')?.value;
    const apiKey = document.getElementById('api-key')?.value;
    const sheetName = document.getElementById('sheet-name')?.value || '売上データ';
    
    if (!url || !apiKey) {
        showSpreadsheetStatus('⚠️ URLとAPIキーは必須です', 'warning');
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
        apiKey,
        sheetName,
        savedAt: new Date().toISOString()
    };
    
    localStorage.setItem(SPREADSHEET_CONFIG_KEY, JSON.stringify(config));
    showSpreadsheetStatus('✅ 設定を保存しました', 'success');
    
    console.log('📊 スプレッドシート設定保存:', { sheetId, sheetName });
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
        const apiKeyInput = document.getElementById('api-key');
        const sheetNameInput = document.getElementById('sheet-name');
        
        if (urlInput) urlInput.value = settings.url || '';
        if (apiKeyInput) apiKeyInput.value = settings.apiKey || '';
        if (sheetNameInput) sheetNameInput.value = settings.sheetName || '売上データ';
        
        console.log('📊 スプレッドシート設定読み込み完了');
    } catch (error) {
        console.error('❌ 設定読み込みエラー:', error);
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
 * スプレッドシート接続テスト
 */
async function testSpreadsheetConnection() {
    const config = getSpreadsheetConfig();
    if (!config) return;
    
    showSpreadsheetStatus('🔍 接続テスト中...', 'info');
    
    try {
        // スプレッドシートの基本情報を取得してテスト
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.sheetId}?key=${config.apiKey}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        const title = data.properties?.title || '不明';
        
        showSpreadsheetStatus(`✅ 接続成功！スプレッドシート: "${title}"`, 'success');
        console.log('📊 接続テスト成功:', { title, sheetId: config.sheetId });
        
    } catch (error) {
        console.error('❌ 接続テストエラー:', error);
        showSpreadsheetStatus(`❌ 接続失敗: ${error.message}`, 'error');
    }
}

/**
 * 今日の売上データを送信
 */
async function sendTodayData() {
    const config = getSpreadsheetConfig();
    if (!config) return;
    
    showSpreadsheetStatus('📤 今日のデータを送信中...', 'info');
    
    try {
        // 今日のデータを集計
        const todayData = await getTodaysSalesData();
        
        if (!todayData || todayData.totalSales === 0) {
            showSpreadsheetStatus('⚠️ 今日の売上データがありません', 'warning');
            return;
        }
        
        // スプレッドシートに書き込み
        await appendToSpreadsheet(config, todayData);
        
        showSpreadsheetStatus(`✅ データ送信完了！売上: ¥${todayData.totalSales.toLocaleString()}, 客数: ${todayData.totalCustomers}人`, 'success');
        
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
 * スプレッドシートにデータを追加
 */
async function appendToSpreadsheet(config, data) {
    const range = `${config.sheetName}!A:E`; // 日付、売上、客数、組数、取引数
    const values = [[
        data.date,
        data.totalSales,
        data.totalCustomers,
        data.uniqueCustomers,
        data.recordCount
    ]];
    
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.sheetId}/values/${range}:append?valueInputOption=RAW&key=${config.apiKey}`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            values: values
        })
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
    }
    
    const result = await response.json();
    console.log('📊 スプレッドシート書き込み成功:', result);
    
    return result;
}

/**
 * スプレッドシート設定を取得
 */
function getSpreadsheetConfig() {
    const url = document.getElementById('spreadsheet-url')?.value;
    const apiKey = document.getElementById('api-key')?.value;
    const sheetName = document.getElementById('sheet-name')?.value || '売上データ';
    
    if (!url || !apiKey) {
        showSpreadsheetStatus('⚠️ URLとAPIキーを入力してください', 'warning');
        return null;
    }
    
    const sheetId = extractSheetId(url);
    if (!sheetId) {
        showSpreadsheetStatus('❌ 無効なスプレッドシートURLです', 'error');
        return null;
    }
    
    return { url, sheetId, apiKey, sheetName };
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
 * スプレッドシートからデータを読み取り（将来の拡張用）
 */
async function readFromSpreadsheet(config, range) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.sheetId}/values/${range}?key=${config.apiKey}`;
    
    const response = await fetch(url);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
    }
    
    return await response.json();
}

// グローバル関数として公開
window.saveSpreadsheetSettings = saveSpreadsheetSettings;
window.loadSpreadsheetSettings = loadSpreadsheetSettings;
window.testSpreadsheetConnection = testSpreadsheetConnection;
window.sendTodayData = sendTodayData;