/**
 * 売上管理システム - メインアプリケーション
 * モジュール化されたシステムのエントリーポイント
 */

// グローバル設定
const API_BASE_URL = window.location.hostname === 'yakinorinori.github.io' 
    ? 'https://yakinorinori.github.io/My-Web-site'
    : window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://yakinorinori.github.io/My-Web-site';

const IS_GITHUB_PAGES = window.location.hostname === 'yakinorinori.github.io';

console.log('🚀 売上管理システム開始');
console.log('🌐 実行環境:', IS_GITHUB_PAGES ? 'GitHub Pages' : 'ローカル環境');
console.log('🔗 API Base URL:', API_BASE_URL);

/**
 * アプリケーションの初期化
 */
function initializeApp() {
    console.log('🔧 アプリケーション初期化中...');
    
    try {
        // 認証システムの初期化
        initAuth();
        
        // データの初期読み込み
        loadData().then(() => {
            console.log('📊 データ読み込み完了');
            onDataLoaded();
        }).catch(error => {
            console.error('❌ データ読み込みエラー:', error);
        });
        
        console.log('✅ アプリケーション初期化完了');
    } catch (error) {
        console.error('❌ アプリケーション初期化エラー:', error);
        
        // エラー画面を表示
        document.getElementById('app-root').innerHTML = `
            <div style="
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: system-ui;
                background: #f8fafc;
            ">
                <div style="
                    background: white;
                    padding: 40px;
                    border-radius: 16px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    text-align: center;
                    max-width: 400px;
                ">
                    <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
                    <h2 style="color: #dc2626; margin: 0 0 12px 0;">初期化エラー</h2>
                    <p style="color: #64748b; margin: 0 0 20px 0;">
                        アプリケーションの初期化中にエラーが発生しました。<br>
                        ページを再読み込みしてください。
                    </p>
                    <button onclick="window.location.reload()" style="
                        background: #0ea5e9;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                    ">再読み込み</button>
                </div>
            </div>
        `;
    }
}

/**
 * データ読み込み完了後の処理
 */
function onDataLoaded() {
    console.log('📊 データ読み込み完了後の処理実行');
    
    // 初期表示は月分析
    showMonthAnalysis();
}

/**
 * DOM読み込み完了時の処理
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM読み込み完了');
    
    // アプリケーション初期化
    initializeApp();
    
    console.log('🎉 システム起動完了');
});

/**
 * ページ読み込み完了時の処理
 */
window.addEventListener('load', function() {
    console.log('🌐 ページ読み込み完了');
    
    // パフォーマンス測定
    if (performance.mark) {
        performance.mark('app-loaded');
        console.log('📈 アプリケーション読み込み時間:', performance.now(), 'ms');
    }
});

/**
 * エラーハンドリング
 */
window.addEventListener('error', function(event) {
    console.error('🚨 グローバルエラー:', event.error);
    
    // エラー情報をユーザーに表示
    if (typeof showNotification === 'function') {
        showNotification('システムエラーが発生しました', 'error');
    }
});

/**
 * Promise rejection のハンドリング
 */
window.addEventListener('unhandledrejection', function(event) {
    console.error('🚨 未処理のPromise rejection:', event.reason);
    
    // エラー情報をユーザーに表示
    if (typeof showNotification === 'function') {
        showNotification('データ処理エラーが発生しました', 'error');
    }
});

/**
 * アプリケーション情報
 */
const APP_INFO = {
    name: '売上管理システム',
    version: '2.0.0',
    description: 'モジュール化された売上分析・レポート生成システム',
    modules: [
        'auth.js - 認証システム',
        'data.js - データ処理',
        'charts.js - グラフ表示',

        'ui.js - ユーザーインターフェース'
    ]
};

console.log('📋 アプリケーション情報:', APP_INFO);