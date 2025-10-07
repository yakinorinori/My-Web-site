/**
 * セキュアなスプレッドシート連携モジュール
 * GitHub Secrets + Netlify Functions を使用
 */

// 設定は外部ファイルから取得（APIキーは含まない）
import { SECURE_CONFIG } from './secure-config.js';

/**
 * セキュアなスプレッドシートデータ送信
 */
async function sendTodayDataSecure() {
    showSpreadsheetStatus('📤 セキュアな方法でデータを送信中...', 'info');
    
    try {
        // 設定確認
        const config = getSecureSpreadsheetConfig();
        if (!config) return;
        
        // 今日のデータを集計
        const todayData = await getTodaysSalesData();
        if (!todayData || todayData.totalSales === 0) {
            showSpreadsheetStatus('⚠️ 今日の売上データがありません', 'warning');
            return;
        }
        
        // Netlify Functionsに送信（APIキーは隠蔽）
        const response = await fetch(SECURE_CONFIG.API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sheetId: config.sheetId,
                sheetName: config.sheetName,
                data: {
                    date: todayData.date,
                    sales: todayData.totalSales,
                    customers: todayData.totalCustomers,
                    groups: todayData.uniqueCustomers,
                    transactions: todayData.recordCount
                }
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        showSpreadsheetStatus(
            `✅ セキュアに送信完了！売上: ¥${todayData.totalSales.toLocaleString()}, 客数: ${todayData.totalCustomers}人`, 
            'success'
        );
        
        console.log('📊 セキュア送信成功:', result);
        
    } catch (error) {
        console.error('❌ セキュアデータ送信エラー:', error);
        showSpreadsheetStatus(`❌ 送信失敗: ${error.message}`, 'error');
    }
}

/**
 * セキュアなスプレッドシート接続テスト
 */
async function testSecureSpreadsheetConnection() {
    const config = getSecureSpreadsheetConfig();
    if (!config) return;
    
    showSpreadsheetStatus('🔍 セキュアな接続をテスト中...', 'info');
    
    try {
        // テストデータを送信
        const testData = {
            date: new Date().toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit' }),
            sales: 0,
            customers: 0,
            groups: 0,
            transactions: 0
        };
        
        const response = await fetch(SECURE_CONFIG.API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sheetId: config.sheetId,
                sheetName: config.sheetName,
                data: testData
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }
        
        const result = await response.json();
        showSpreadsheetStatus('✅ セキュア接続テスト成功！APIキーは完全に保護されています', 'success');
        
    } catch (error) {
        console.error('❌ セキュア接続テストエラー:', error);
        showSpreadsheetStatus(`❌ 接続失敗: ${error.message}`, 'error');
    }
}

/**
 * セキュア版のスプレッドシート設定取得（APIキー不要）
 */
function getSecureSpreadsheetConfig() {
    const url = document.getElementById('spreadsheet-url')?.value;
    const sheetName = document.getElementById('sheet-name')?.value || '売上データ';
    
    if (!url) {
        showSpreadsheetStatus('⚠️ スプレッドシートURLを入力してください', 'warning');
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
 * セキュア設定を保存（APIキーは不要）
 */
function saveSecureSpreadsheetSettings() {
    const url = document.getElementById('spreadsheet-url')?.value;
    const sheetName = document.getElementById('sheet-name')?.value || '売上データ';
    
    if (!url) {
        showSpreadsheetStatus('⚠️ URLは必須です', 'warning');
        return;
    }
    
    const sheetId = extractSheetId(url);
    if (!sheetId) {
        showSpreadsheetStatus('❌ 無効なスプレッドシートURLです', 'error');
        return;
    }
    
    const config = {
        url,
        sheetId,
        sheetName,
        savedAt: new Date().toISOString(),
        secureMode: true,
        version: SECURE_CONFIG.VERSION
    };
    
    localStorage.setItem('secure_spreadsheet_config', JSON.stringify(config));
    showSpreadsheetStatus('✅ セキュア設定を保存しました（APIキーは不要）', 'success');
    
    console.log('📊 セキュアスプレッドシート設定保存:', { sheetId, sheetName });
}

/**
 * セキュア設定を読み込み
 */
function loadSecureSpreadsheetSettings() {
    try {
        const config = localStorage.getItem('secure_spreadsheet_config');
        if (!config) return;
        
        const settings = JSON.parse(config);
        
        // フォームに設定値を反映
        const urlInput = document.getElementById('spreadsheet-url');
        const sheetNameInput = document.getElementById('sheet-name');
        
        if (urlInput) urlInput.value = settings.url || '';
        if (sheetNameInput) sheetNameInput.value = settings.sheetName || '売上データ';
        
        showSpreadsheetStatus('✅ セキュア設定を読み込みました - APIキーは完全に保護されています', 'success');
        
        console.log('📊 セキュアスプレッドシート設定読み込み完了');
    } catch (error) {
        console.error('❌ セキュア設定読み込みエラー:', error);
    }
}

/**
 * モバイル用セキュア送信
 */
async function sendMobileSalesDataSecure(totalAmount, reportDate) {
    try {
        const config = getSecureMobileSpreadsheetConfig();
        if (!config) {
            console.log('📊 セキュア設定がありません - スキップします');
            return;
        }
        
        const formattedDate = formatDateForSpreadsheet(reportDate);
        const mobileData = {
            date: formattedDate,
            sales: totalAmount,
            customers: receipts.length,
            groups: 1,
            transactions: receipts.length
        };
        
        console.log('📱 モバイル売上データをセキュア送信中:', mobileData);
        
        const response = await fetch(SECURE_CONFIG.API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sheetId: config.sheetId,
                sheetName: config.sheetName,
                data: mobileData
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }
        
        showNotification('📊 セキュアにスプレッドシートへ送信完了！', 'success');
        
    } catch (error) {
        console.error('❌ モバイルセキュア送信エラー:', error);
        showNotification(`⚠️ セキュア送信に失敗: ${error.message}`, 'warning');
    }
}

/**
 * モバイル用セキュア設定取得
 */
function getSecureMobileSpreadsheetConfig() {
    try {
        const config = localStorage.getItem('secure_spreadsheet_config');
        if (!config) return null;
        
        const settings = JSON.parse(config);
        if (!settings.url || !settings.sheetId) return null;
        
        return {
            url: settings.url,
            sheetId: settings.sheetId,
            sheetName: settings.sheetName || '売上データ'
        };
    } catch (error) {
        console.error('❌ セキュア設定取得エラー:', error);
        return null;
    }
}

// グローバル関数として公開
window.sendTodayDataSecure = sendTodayDataSecure;
window.testSecureSpreadsheetConnection = testSecureSpreadsheetConnection;
window.saveSecureSpreadsheetSettings = saveSecureSpreadsheetSettings;
window.loadSecureSpreadsheetSettings = loadSecureSpreadsheetSettings;
window.sendMobileSalesDataSecure = sendMobileSalesDataSecure;