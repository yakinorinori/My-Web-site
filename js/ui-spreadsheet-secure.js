/**
 * セキュア版スプレッドシート連携設定UI
 */
function showSecureSpreadsheetSettings() {
    console.log('🔒 セキュアスプレッドシート連携設定表示');
    
    const html = `
        <div style="
            background: white;
            border-radius: 16px;
            padding: 32px;
            margin: 24px 0;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(76, 175, 80, 0.3);
        ">
            <h2 style="
                color: #4caf50;
                margin: 0 0 24px 0;
                font-size: 24px;
                font-weight: 700;
                display: flex;
                align-items: center;
                gap: 12px;
            ">
                🔒 セキュア スプレッドシート連携
            </h2>
            
            <div style="
                background: #e8f5e8;
                border: 1px solid #4caf50;
                border-radius: 8px;
                padding: 16px;
                margin-bottom: 24px;
            ">
                <h4 style="color: #2e7d32; margin: 0 0 8px 0;">🛡️ セキュリティ強化版</h4>
                <p style="color: #2e7d32; font-size: 14px; line-height: 1.5; margin: 0;">
                    APIキーはGitHub SecretsとNetlify Functionsで完全に保護されています。ブラウザには一切露出しません。
                </p>
            </div>
            
            <div style="margin-bottom: 24px;">
                <h3 style="color: #1e293b; margin-bottom: 12px;">🔗 スプレッドシートURL</h3>
                <p style="color: #64748b; margin-bottom: 16px; line-height: 1.6;">
                    「URLを知っている人のみ閲覧可能」に設定されたGoogleスプレッドシートのURLを入力してください。
                </p>
                <input 
                    type="url" 
                    id="secure-spreadsheet-url" 
                    placeholder="https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit?usp=sharing"
                    style="
                        width: 100%;
                        padding: 12px 16px;
                        border: 2px solid #4caf50;
                        border-radius: 8px;
                        font-size: 14px;
                        box-sizing: border-box;
                        transition: border-color 0.2s;
                    "
                    onFocus="this.style.borderColor='#2e7d32'"
                    onBlur="this.style.borderColor='#4caf50'"
                />
            </div>
            
            <div style="margin-bottom: 24px;">
                <h3 style="color: #1e293b; margin-bottom: 12px;">📝 書き込み先シート名</h3>
                <input 
                    type="text" 
                    id="secure-sheet-name" 
                    placeholder="売上データ"
                    value="売上データ"
                    style="
                        width: 100%;
                        padding: 12px 16px;
                        border: 2px solid #4caf50;
                        border-radius: 8px;
                        font-size: 14px;
                        box-sizing: border-box;
                        transition: border-color 0.2s;
                    "
                    onFocus="this.style.borderColor='#2e7d32'"
                    onBlur="this.style.borderColor='#4caf50'"
                />
            </div>
            
            <div style="display: flex; gap: 12px; margin-bottom: 24px;">
                <button onclick="testSecureConnection()" style="
                    background: #4caf50;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.2s;
                " onMouseOver="this.style.background='#45a049'" onMouseOut="this.style.background='#4caf50'">
                    🔍 セキュア接続テスト
                </button>
                
                <button onclick="saveSecureSettings()" style="
                    background: #2196f3;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.2s;
                " onMouseOver="this.style.background='#1976d2'" onMouseOut="this.style.background='#2196f3'">
                    💾 設定保存
                </button>
                
                <button onclick="sendSecureData()" style="
                    background: #ff9800;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.2s;
                " onMouseOver="this.style.background='#f57c00'" onMouseOut="this.style.background='#ff9800'">
                    📤 今日のデータ送信
                </button>
            </div>
            
            <div id="secure-spreadsheet-status" style="
                padding: 16px;
                border-radius: 8px;
                margin-top: 16px;
                display: none;
            "></div>
            
            <div style="
                background: #e3f2fd;
                padding: 20px;
                border-radius: 8px;
                border-left: 4px solid #2196f3;
                margin-bottom: 20px;
            ">
                <h4 style="color: #1565c0; margin: 0 0 12px 0;">🔒 セキュリティ機能</h4>
                <ul style="color: #1565c0; line-height: 1.6; margin: 0; padding-left: 20px;">
                    <li>APIキーはGitHub Secretsで管理（ブラウザに露出なし）</li>
                    <li>Netlify Functionsで安全なプロキシ処理</li>
                    <li>CORS制限で不正アクセスを防止</li>
                    <li>許可されたスプレッドシートIDのみ書き込み可能</li>
                </ul>
            </div>
            
            <div style="
                background: #f8fafc;
                padding: 20px;
                border-radius: 8px;
                border-left: 4px solid #64748b;
            ">
                <h4 style="color: #1e293b; margin: 0 0 12px 0;">📋 設定手順</h4>
                <ol style="color: #64748b; line-height: 1.6; margin: 0; padding-left: 20px;">
                    <li>Googleスプレッドシートを作成・共有設定</li>
                    <li>Google Cloud ConsoleでAPIキーを取得</li>
                    <li>GitHub SecretsにAPIキーを設定</li>
                    <li>Netlify環境変数を設定</li>
                    <li>スプレッドシートURL入力・接続テスト</li>
                </ol>
            </div>
        </div>
    `;
    
    const resultsArea = document.getElementById('analysis-results');
    if (resultsArea) {
        resultsArea.innerHTML = html;
        loadSecureSpreadsheetSettings();
    }
}

// セキュア版のイベントハンドラ関数
function testSecureConnection() {
    // IDを一時的に設定して既存関数を利用
    const url = document.getElementById('secure-spreadsheet-url')?.value;
    const sheetName = document.getElementById('secure-sheet-name')?.value;
    
    if (document.getElementById('spreadsheet-url')) {
        document.getElementById('spreadsheet-url').value = url;
    }
    if (document.getElementById('sheet-name')) {
        document.getElementById('sheet-name').value = sheetName;
    }
    
    testSecureSpreadsheetConnection();
}

function saveSecureSettings() {
    const url = document.getElementById('secure-spreadsheet-url')?.value;
    const sheetName = document.getElementById('secure-sheet-name')?.value;
    
    if (document.getElementById('spreadsheet-url')) {
        document.getElementById('spreadsheet-url').value = url;
    }
    if (document.getElementById('sheet-name')) {
        document.getElementById('sheet-name').value = sheetName;
    }
    
    saveSecureSpreadsheetSettings();
}

function sendSecureData() {
    const url = document.getElementById('secure-spreadsheet-url')?.value;
    const sheetName = document.getElementById('secure-sheet-name')?.value;
    
    if (document.getElementById('spreadsheet-url')) {
        document.getElementById('spreadsheet-url').value = url;
    }
    if (document.getElementById('sheet-name')) {
        document.getElementById('sheet-name').value = sheetName;
    }
    
    sendTodayDataSecure();
}

// グローバル関数として公開
window.showSecureSpreadsheetSettings = showSecureSpreadsheetSettings;