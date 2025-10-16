/**
 * スプレッドシート連携設定を表示
 */
function showSpreadsheetSettings() {
    console.log('📊 スプレッドシート連携設定表示');
    
    const html = `
        <div style="
            background: white;
            border-radius: 16px;
            padding: 32px;
            margin: 24px 0;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(14, 165, 233, 0.1);
        ">
            <h2 style="
                color: #0ea5e9;
                margin: 0 0 24px 0;
                font-size: 24px;
                font-weight: 700;
                display: flex;
                align-items: center;
                gap: 12px;
            ">
                📊 Googleスプレッドシート連携設定
            </h2>
            
            <div style="margin-bottom: 24px;">
                <h3 style="color: #1e293b; margin-bottom: 12px;">🔗 スプレッドシートURL設定</h3>
                <p style="color: #64748b; margin-bottom: 16px; line-height: 1.6;">
                    「URLを知っている人のみ閲覧可能」に設定されたGoogleスプレッドシートのURLを入力してください。
                </p>
                <input 
                    type="url" 
                    id="spreadsheet-url" 
                    placeholder="https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit?usp=sharing"
                    style="
                        width: 100%;
                        padding: 12px 16px;
                        border: 2px solid #e2e8f0;
                        border-radius: 8px;
                        font-size: 14px;
                        box-sizing: border-box;
                        transition: border-color 0.2s;
                    "
                    onFocus="this.style.borderColor='#0ea5e9'"
                    onBlur="this.style.borderColor='#e2e8f0'"
                />
            </div>
            
            <div style="margin-bottom: 24px;">
                <h3 style="color: #1e293b; margin-bottom: 12px;">🔑 Google Sheets API Key</h3>
                <div style="
                    background: #dcfce7;
                    border: 1px solid #86efac;
                    border-radius: 8px;
                    padding: 12px;
                    margin-bottom: 12px;
                ">
                    <p style="color: #16a34a; font-size: 14px; font-weight: 600; margin: 0 0 8px 0;">
                        ✅ デフォルトAPI Keyが自動設定されています
                    </p>
                    <p style="color: #15803d; font-size: 13px; line-height: 1.5; margin: 0;">
                        テンプレート用の読み取り専用APIキーが設定済みです。スプレッドシートIDを入力するだけですぐに使えます！
                    </p>
                </div>
                <div style="
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    border-radius: 8px;
                    padding: 12px;
                    margin-bottom: 12px;
                ">
                    <p style="color: #dc2626; font-size: 13px; font-weight: 600; margin: 0 0 8px 0;">
                        ⚠️ オプション：独自のAPI Keyを使用する場合
                    </p>
                    <p style="color: #dc2626; font-size: 12px; line-height: 1.5; margin: 0;">
                        より高いセキュリティが必要な場合は、独自のAPIキーを入力してください。空白のままでもデフォルトキーで動作します。
                    </p>
                </div>
                <input 
                    type="password" 
                    id="api-key" 
                    placeholder="空白 = デフォルトAPI Key使用（推奨）"
                    style="
                        width: 100%;
                        padding: 12px 16px;
                        border: 2px solid #e2e8f0;
                        border-radius: 8px;
                        font-size: 14px;
                        box-sizing: border-box;
                        transition: border-color 0.2s;
                    "
                    onFocus="this.style.borderColor='#0ea5e9'"
                    onBlur="this.style.borderColor='#e2e8f0'"
                />
                <p style="color: #64748b; font-size: 12px; margin: 8px 0 0 0;">
                    💡 ヒント: 空白のままで大丈夫です。デフォルトのAPI Keyで動作します。
                </p>
            </div>
            
            <div style="margin-bottom: 24px;">
                <h3 style="color: #1e293b; margin-bottom: 12px;">📝 書き込み先シート名</h3>
                <input 
                    type="text" 
                    id="sheet-name" 
                    placeholder="売上データ"
                    value="売上データ"
                    style="
                        width: 100%;
                        padding: 12px 16px;
                        border: 2px solid #e2e8f0;
                        border-radius: 8px;
                        font-size: 14px;
                        box-sizing: border-box;
                        transition: border-color 0.2s;
                    "
                    onFocus="this.style.borderColor='#0ea5e9'"
                    onBlur="this.style.borderColor='#e2e8f0'"
                />
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 24px;">
                <button onclick="testSpreadsheetConnection()" style="
                    background: #10b981;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.2s;
                " onMouseOver="this.style.background='#059669'" onMouseOut="this.style.background='#10b981'">
                    🔍 接続テスト
                </button>
                
                <button onclick="saveSpreadsheetSettings()" style="
                    background: #0ea5e9;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.2s;
                " onMouseOver="this.style.background='#0284c7'" onMouseOut="this.style.background='#0ea5e9'">
                    💾 設定保存
                </button>
                
                <button onclick="syncDataFromSpreadsheet()" style="
                    background: #f59e0b;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.2s;
                " onMouseOver="this.style.background='#d97706'" onMouseOut="this.style.background='#f59e0b'">
                    📥 データ読み込み
                </button>
                
                <button onclick="sendTodayData()" style="
                    background: #8b5cf6;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.2s;
                " onMouseOver="this.style.background='#7c3aed'" onMouseOut="this.style.background='#8b5cf6'">
                    📤 今日のデータ送信
                </button>
            </div>
            
            <div id="spreadsheet-status" style="
                padding: 16px;
                border-radius: 8px;
                margin-top: 16px;
                display: none;
            "></div>
            
            <div style="
                background: #fef2f2;
                padding: 20px;
                border-radius: 8px;
                border-left: 4px solid #dc2626;
                margin-bottom: 20px;
            ">
                <h4 style="color: #dc2626; margin: 0 0 12px 0;">🔒 セキュアな本番環境での推奨設定</h4>
                <ul style="color: #7f1d1d; line-height: 1.6; margin: 0; padding-left: 20px;">
                    <li><strong>サーバーサイドプロキシ:</strong> バックエンドサーバーでAPIキーを管理</li>
                    <li><strong>環境変数:</strong> .envファイルでAPIキーを管理（Git除外）</li>
                    <li><strong>OAuth認証:</strong> ユーザー個別の認証フローを実装</li>
                    <li><strong>CORS制限:</strong> 特定ドメインからのみAPIアクセス許可</li>
                </ul>
            </div>
            
            <div style="
                background: #f8fafc;
                padding: 20px;
                border-radius: 8px;
                border-left: 4px solid #0ea5e9;
            ">
                <h4 style="color: #1e293b; margin: 0 0 12px 0;">💡 テスト環境での設定手順</h4>
                <ol style="color: #64748b; line-height: 1.6; margin: 0; padding-left: 20px;">
                    <li>Googleスプレッドシートを作成し、「URLを知っている人のみ閲覧可能」に設定</li>
                    <li>Google Cloud ConsoleでSheets APIを有効化し、<strong>テスト用</strong>APIキーを取得</li>
                    <li>APIキーの制限設定（HTTP リファラー、特定APIのみ等）を必ず設定</li>
                    <li>上記情報を入力し「接続テスト」で動作確認</li>
                    <li>「設定保存」で暗号化保存（セキュリティ警告あり）</li>
                    <li><strong>本番環境移行時は必ずサーバーサイドプロキシに変更</strong></li>
                </ol>
            </div>
        </div>
    `;
    
    const resultsArea = document.getElementById('analysis-results');
    if (resultsArea) {
        resultsArea.innerHTML = html;
        
        // 保存された設定を読み込み
        if (typeof loadSpreadsheetSettings === 'function') {
            loadSpreadsheetSettings();
        }
    }
}

// グローバル関数として公開
window.showSpreadsheetSettings = showSpreadsheetSettings;