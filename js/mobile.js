/**
 * モバイル売上報告システム (Mobile Daily Sales Report)
 * スマートフォン向けの日次売上報告機能
 */

/**
 * モバイル売上報告アプリを初期化
 */
function initMobileSalesReport() {
    console.log('📱 モバイル売上報告システム初期化中...');
    
    // 既存のapp-rootをクリア
    const appRoot = document.getElementById('app-root');
    appRoot.innerHTML = '';
    
    // モバイル専用のスタイル設定
    appRoot.style.cssText = `
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        margin: 0;
        padding: 0;
        overflow-x: hidden;
    `;
    
    // モバイル売上報告画面を作成
    createMobileSalesReportScreen();
}

/**
 * モバイル売上報告画面を作成
 */
function createMobileSalesReportScreen() {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
    
    const appRoot = document.getElementById('app-root');
    appRoot.innerHTML = `
        <!-- ヘッダー -->
        <div style="
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            padding: 20px;
            text-align: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        ">
            <h1 style="
                color: white;
                margin: 0 0 8px 0;
                font-size: 28px;
                font-weight: 300;
                letter-spacing: 1px;
            ">売上報告システム</h1>
            <p style="
                color: rgba(255, 255, 255, 0.7);
                margin: 0;
                font-size: 12px;
                letter-spacing: 2px;
            ">モバイル版</p>
        </div>
        
        <!-- メインコンテンツ -->
        <div style="
            padding: 16px;
            height: calc(100vh - 100px);
            overflow-y: auto;
            box-sizing: border-box;
        ">
            <!-- 日付選択 -->
            <div style="
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(20px);
                border-radius: 16px;
                padding: 20px;
                margin-bottom: 20px;
                border: 1px solid rgba(255, 255, 255, 0.2);
            ">
                <div style="
                    margin-bottom: 16px;
                ">
                    <h3 style="
                        color: white;
                        margin: 0 0 12px 0;
                        font-size: 16px;
                        font-weight: 400;
                        letter-spacing: 1px;
                    ">
                        営業日報告
                    </h3>
                    <div style="
                        color: rgba(255, 255, 255, 0.8);
                        font-size: 14px;
                        margin-bottom: 8px;
                    "> 報告日をタップして変更できます</div>
                    <input type="date" id="report-date" style="
                        width: 100%;
                        padding: 16px;
                        border: 2px solid rgba(255, 255, 255, 0.4);
                        border-radius: 12px;
                        background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.1));
                        color: white;
                        font-size: 18px;
                        font-weight: 600;
                        cursor: pointer;
                        backdrop-filter: blur(15px);
                        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
                        text-align: center;
                        letter-spacing: 1px;
                    " value="${today.toISOString().split('T')[0]}">
                </div>
            </div>
            
            <!-- 伝票入力エリア -->
            <div style="
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(20px);
                border-radius: 16px;
                padding: 20px;
                margin-bottom: 20px;
                border: 1px solid rgba(255, 255, 255, 0.2);
            ">
                <h3 style="
                    color: white;
                    margin: 0 0 16px 0;
                    font-size: 16px;
                    font-weight: 400;
                    letter-spacing: 1px;
                ">
                    伝票撮影・入力
                </h3>
                
                <!-- カメラ撮影ボタン -->
                <button id="camera-btn" style="
                    width: 100%;
                    background: linear-gradient(135deg, rgba(76, 175, 80, 0.8) 0%, rgba(56, 142, 60, 0.8) 100%);
                    color: white;
                    border: 2px solid rgba(255, 255, 255, 0.5);
                    padding: 20px;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    margin-bottom: 16px;
                    letter-spacing: 0.5px;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(15px);
                    box-shadow: 0 4px 20px rgba(76, 175, 80, 0.3);
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
                ">
                    📸 伝票を撮影する
                </button>
                
                <!-- 撮影した伝票のリスト -->
                <div id="receipt-list" style="margin-bottom: 16px;"></div>
                
                <!-- 現在の伝票入力フォーム (撮影後に表示) -->
                <div id="current-receipt-form" style="display: none;">
                    <div style="
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 12px;
                        padding: 16px;
                        margin-bottom: 16px;
                    ">
                        <h4 style="color: white; margin: 0 0 12px 0;">撮影した伝票の詳細入力</h4>
                        
                        <!-- 撮影画像プレビュー（縦画面撮影対応） -->
                        <div id="image-preview" style="
                            width: 100%;
                            height: 160px;
                            background: rgba(0, 0, 0, 0.2);
                            border-radius: 8px;
                            margin-bottom: 12px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: rgba(255, 255, 255, 0.6);
                        ">縦画面で伝票を撮影してください</div>
                        
                        <!-- 支払い方法選択 -->
                        <div style="margin-bottom: 12px;">
                            <label style="
                                color: white;
                                font-size: 14px;
                                font-weight: 500;
                                display: block;
                                margin-bottom: 8px;
                            ">💳 支払い方法</label>
                            <div style="
                                background: rgba(33, 150, 243, 0.2);
                                border-radius: 6px;
                                padding: 8px 12px;
                                margin-bottom: 8px;
                                font-size: 12px;
                                color: white;
                                border-left: 3px solid white;
                            ">
                                💡 現金支払いか、カード・QR決済かを選択してください
                            </div>
                            <div style="display: flex; gap: 8px;">
                                <button class="payment-method" data-method="cash" style="
                                    flex: 1;
                                    background: linear-gradient(135deg, rgba(76, 175, 80, 0.6), rgba(56, 142, 60, 0.7));
                                    color: white;
                                    border: 2px solid rgba(255, 255, 255, 0.4);
                                    padding: 16px;
                                    border-radius: 10px;
                                    cursor: pointer;
                                    transition: all 0.3s;
                                    font-size: 13px;
                                    font-weight: 600;
                                    letter-spacing: 1px;
                                    box-shadow: 0 3px 12px rgba(76, 175, 80, 0.2);
                                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
                                    backdrop-filter: blur(10px);
                                ">💴 現金</button>
                                <button class="payment-method" data-method="other" style="
                                    flex: 1;
                                    background: linear-gradient(135deg, rgba(156, 39, 176, 0.6), rgba(123, 31, 162, 0.7));
                                    color: white;
                                    border: 2px solid rgba(255, 255, 255, 0.4);
                                    padding: 16px;
                                    border-radius: 10px;
                                    cursor: pointer;
                                    transition: all 0.3s;
                                    font-size: 13px;
                                    font-weight: 600;
                                    letter-spacing: 1px;
                                    box-shadow: 0 3px 12px rgba(156, 39, 176, 0.2);
                                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
                                    backdrop-filter: blur(10px);
                                ">💳 その他</button>
                            </div>
                        </div>
                        
                        <!-- 支払い者入力 -->
                        <div style="margin-bottom: 16px;">
                            <label style="
                                color: white;
                                font-size: 14px;
                                font-weight: 500;
                                display: block;
                                margin-bottom: 8px;
                            ">👤 支払い者</label>
                            <input type="text" id="receipt-payer" placeholder="例: 山田さん、鈴木様" style="
                                width: 100%;
                                padding: 12px;
                                border: 1px solid rgba(255, 255, 255, 0.3);
                                border-radius: 8px;
                                background: rgba(255, 255, 255, 0.1);
                                color: white;
                                font-size: 16px;
                                box-sizing: border-box;
                            ">
                            <div style="
                                color: rgba(255, 255, 255, 0.6);
                                font-size: 11px;
                                margin-top: 4px;
                            ">※ 支払った方の名前や会社名など（任意）</div>
                            <div style="
                                background: rgba(255, 193, 7, 0.15);
                                border-left: 3px solid #FFC107;
                                border-radius: 6px;
                                padding: 10px 12px;
                                margin-top: 8px;
                                font-size: 11px;
                                color: rgba(255, 193, 7, 0.95);
                                line-height: 1.5;
                            ">
                                <div style="font-weight: 600; margin-bottom: 4px;">⚠️ 同じお客様で伝票が複数ある場合</div>
                                <div style="color: rgba(255, 193, 7, 0.85);">
                                    → 1枚目は通常通り記入<br>
                                    → 2枚目以降は<strong>客数を「0」</strong>にして同じ名前を入力<br>
                                    <span style="font-size: 10px; opacity: 0.8;">（例: 山田さん 4名 + 山田さん 0名）</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 客数入力 -->
                        <div style="margin-bottom: 16px;">
                            <label style="
                                color: white;
                                font-size: 14px;
                                font-weight: 500;
                                display: block;
                                margin-bottom: 8px;
                            ">👥 客数</label>
                            <input type="number" id="receipt-customer-count" value="1" min="0" max="999" step="1" style="
                                width: 100%;
                                padding: 12px;
                                border: 1px solid rgba(255, 255, 255, 0.3);
                                border-radius: 8px;
                                background: rgba(255, 255, 255, 0.1);
                                color: white;
                                font-size: 16px;
                                box-sizing: border-box;
                            ">
                            <div style="
                                color: rgba(255, 255, 255, 0.6);
                                font-size: 11px;
                                margin-top: 4px;
                            ">※ この伝票の人数（通常: 1名以上、追加伝票: 0名）</div>
                        </div>
                        
                        <!-- 金額入力 -->
                        <div style="margin-bottom: 16px;">
                            <label style="
                                color: white;
                                font-size: 14px;
                                font-weight: 500;
                                display: block;
                                margin-bottom: 8px;
                            ">💰 金額</label>
                            <div style="
                                background: rgba(255, 193, 7, 0.2);
                                border-radius: 6px;
                                padding: 8px 12px;
                                margin-bottom: 8px;
                                font-size: 12px;
                                color: #FFC107;
                                border-left: 3px solid #FFC107;
                            ">
                                💡 伝票に記載されている合計金額を入力してください
                            </div>
                            <input type="number" id="receipt-amount" placeholder="例: 1200" min="1" step="1" style="
                                width: 100%;
                                padding: 12px;
                                border: 1px solid rgba(255, 255, 255, 0.3);
                                border-radius: 8px;
                                background: rgba(255, 255, 255, 0.1);
                                color: white;
                                font-size: 16px;
                                box-sizing: border-box;
                            ">
                            <div id="amount-error" style="
                                color: #FF5722;
                                font-size: 12px;
                                margin-top: 4px;
                                display: none;
                            "></div>
                        </div>
                        
                        <!-- 確定ボタン -->
                        <button id="confirm-receipt-btn" style="
                            width: 100%;
                            background: linear-gradient(135deg, rgba(33, 150, 243, 0.8), rgba(25, 118, 210, 0.9));
                            color: white;
                            border: 2px solid rgba(255, 255, 255, 0.4);
                            padding: 16px;
                            border-radius: 12px;
                            font-size: 15px;
                            font-weight: 700;
                            cursor: pointer;
                            box-shadow: 0 4px 16px rgba(33, 150, 243, 0.3);
                            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
                            backdrop-filter: blur(10px);
                            letter-spacing: 0.5px;
                        ">✅ この伝票を確定</button>
                    </div>
                </div>
            </div>
            
            <!-- 合計・完了エリア -->
            <div style="
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(20px);
                border-radius: 16px;
                padding: 20px;
                border: 1px solid rgba(255, 255, 255, 0.2);
            ">
                <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                ">
                    <h3 style="
                        color: white;
                        margin: 0;
                        font-size: 16px;
                        font-weight: 400;
                        letter-spacing: 1px;
                    ">本日の合計</h3>
                    <div style="
                        color: white;
                        font-size: 24px;
                        font-weight: 600;
                    " id="total-amount">¥0</div>
                </div>
                
                <div style="
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 14px;
                    margin-bottom: 16px;
                " id="receipt-count">伝票数: 0枚</div>
                
                <button id="complete-report-btn" style="
                    width: 100%;
                    background: linear-gradient(135deg, rgba(244, 67, 54, 0.8), rgba(198, 40, 40, 0.9));
                    color: white;
                    border: 2px solid rgba(255, 255, 255, 0.5);
                    padding: 20px;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 700;
                    cursor: pointer;
                    display: none;
                    letter-spacing: 1px;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(15px);
                    box-shadow: 0 6px 20px rgba(244, 67, 54, 0.4);
                    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
                ">
                    🎯 売上報告を完了する
                </button>
            </div>
            
            <!-- スプレッドシート連携状況表示 -->
            <div id="spreadsheet-status-mobile" style="
                position: fixed;
                bottom: 20px;
                left: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 12px 16px;
                border-radius: 12px;
                font-size: 13px;
                text-align: center;
                backdrop-filter: blur(10px);
                display: none;
            "></div>
        </div>


        <!-- 隠しファイル入力（縦向き撮影推奨） -->
        <input type="file" id="camera-input" accept="image/*" capture="environment" style="display: none;">
    `;
    
    // 撮影ガイドオーバーレイを別途追加
    createCameraGuideOverlay();
    
    // イベントリスナーを設定
    setupMobileEventListeners();
    
    // スプレッドシート連携状況を確認・表示
    checkAndDisplaySpreadsheetStatus();
}

/**
 * 撮影ガイドオーバーレイを作成
 */
function createCameraGuideOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'camera-guide-overlay';
    overlay.style.cssText = `
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.95);
        z-index: 99999;
        overflow: hidden;
        backdrop-filter: blur(5px);
    `;
    
    overlay.innerHTML = `
        <div style="
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            padding: 16px;
            box-sizing: border-box;
            overflow-y: auto;
        ">
            <div style="
                background: rgba(255, 255, 255, 0.1);
                border-radius: 16px;
                padding: 20px;
                text-align: center;
                max-width: 300px;
                width: 90%;
                max-height: 85vh;
                overflow-y: auto;
                box-sizing: border-box;
            ">
                <div style="font-size: 48px; margin-bottom: 16px;">📱</div>
                <h3 style="color: white; margin: 0 0 16px 0;">📸 縦向き撮影ガイド</h3>
                
                <!-- 縦向きスマホの図 -->
                <div style="
                    border: 3px solid #4CAF50;
                    border-radius: 20px;
                    width: 100px;
                    height: 160px;
                    margin: 12px auto;
                    position: relative;
                    background: rgba(76, 175, 80, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    <div style="
                        border: 2px dashed rgba(255, 255, 255, 0.8);
                        border-radius: 6px;
                        width: 60px;
                        height: 90px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 10px;
                        color: rgba(255, 255, 255, 0.9);
                        text-align: center;
                        line-height: 1.1;
                    ">
                        📄<br>伝票<br>全体
                    </div>
                    <div style="
                        position: absolute;
                        top: -8px;
                        right: -8px;
                        background: #4CAF50;
                        color: white;
                        border-radius: 50%;
                        width: 16px;
                        height: 16px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 10px;
                    ">✓</div>
                </div>
                
                <div style="
                    text-align: left;
                    font-size: 13px;
                    color: rgba(255, 255, 255, 0.9);
                    margin-bottom: 16px;
                    background: rgba(76, 175, 80, 0.1);
                    padding: 12px;
                    border-radius: 8px;
                    border-left: 4px solid #4CAF50;
                ">
                    <div style="margin-bottom: 8px; font-weight: 600; color: #4CAF50; font-size: 12px;">📱 必ず縦向きで撮影してください</div>
                    <div style="margin-bottom: 6px; font-size: 12px;">✅ スマホを縦向きに持つ</div>
                    <div style="margin-bottom: 6px; font-size: 12px;">✅ 伝票全体が画面内に収まるように</div>
                    <div style="margin-bottom: 6px; font-size: 12px;">✅ 明るい場所で撮影する</div>
                    <div style="margin-bottom: 6px; font-size: 12px;">✅ 文字がはっきり読める距離で</div>
                    <div style="color: #FF9800; font-size: 11px; margin-top: 6px;">
                        ⚠️ 横向きで撮影すると正しく表示されません
                    </div>
                </div>
                
                <button id="start-camera-btn" style="
                    width: 100%;
                    background: linear-gradient(135deg, rgba(76, 175, 80, 0.9), rgba(56, 142, 60, 0.95));
                    color: white;
                    border: 2px solid rgba(255, 255, 255, 0.5);
                    padding: 18px;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 700;
                    cursor: pointer;
                    margin-bottom: 12px;
                    transition: all 0.3s ease;
                    touch-action: manipulation;
                    -webkit-tap-highlight-color: transparent;
                    box-shadow: 0 4px 16px rgba(76, 175, 80, 0.4);
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
                    backdrop-filter: blur(10px);
                ">📸 撮影開始</button>
                
                <button id="close-guide-btn" style="
                    width: 100%;
                    background: linear-gradient(135deg, rgba(158, 158, 158, 0.6), rgba(97, 97, 97, 0.7));
                    color: white;
                    border: 2px solid rgba(255, 255, 255, 0.4);
                    padding: 14px;
                    border-radius: 10px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                    touch-action: manipulation;
                    -webkit-tap-highlight-color: transparent;
                    box-shadow: 0 3px 12px rgba(158, 158, 158, 0.2);
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
                ">❌ 閉じる</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
}

/**
 * モバイル用イベントリスナーを設定
 */
function setupMobileEventListeners() {
    // 日付変更
    document.getElementById('report-date').addEventListener('change', function() {
        // 日付が変更されたことを通知（オプション）
        showNotification('📅 報告日を変更しました', 'info');
    });
    
    // カメラ撮影
    document.getElementById('camera-btn').addEventListener('click', openCamera);
    document.getElementById('camera-input').addEventListener('change', handleImageCapture);
    
    // 支払い方法選択
    document.querySelectorAll('.payment-method').forEach(btn => {
        btn.addEventListener('click', selectPaymentMethod);
    });
    
    // 伝票確定
    document.getElementById('confirm-receipt-btn').addEventListener('click', confirmReceipt);
    
    // 報告完了
    document.getElementById('complete-report-btn').addEventListener('click', completeReport);
    
    // 撮影ガイド（動的に作成されるため、イベント委譲を使用）
    document.addEventListener('click', function(event) {
        if (event.target.id === 'start-camera-btn') {
            startCameraFromGuide();
        } else if (event.target.id === 'close-guide-btn') {
            closeGuide();
        }
    });
}

// グローバル変数
let receipts = [];
let currentReceiptData = {};

/**
 * 日付編集の切り替え
 */
function toggleDateEdit() {
    const display = document.getElementById('date-display');
    const input = document.getElementById('report-date');
    const btn = document.getElementById('edit-date-btn');
    
    if (input.style.display === 'none') {
        display.style.display = 'none';
        input.style.display = 'block';
        btn.textContent = '確定';
    } else {
        display.style.display = 'block';
        input.style.display = 'none';
        btn.textContent = '編集';
    }
}

/**

/**
 * カメラを開く（ガイド表示）
 */
function openCamera() {
    document.getElementById('camera-guide-overlay').style.display = 'block';
}

/**
 * ガイドからカメラを起動
 */
function startCameraFromGuide() {
    console.log('撮影開始ボタンがクリックされました');
    const overlay = document.getElementById('camera-guide-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
    document.getElementById('camera-input').click();
}

/**
 * ガイドを閉じる
 */
function closeGuide() {
    console.log('閉じるボタンがクリックされました');
    const overlay = document.getElementById('camera-guide-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

/**
 * 画像撮影処理
 */
function handleImageCapture(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        // 画像の縦横比をチェック
        const img = new Image();
        
        // Safari対応：crossOrigin属性を設定
        img.crossOrigin = 'anonymous';
        
        img.onload = function() {
            const isPortrait = img.height > img.width;
            
            // Safari対応：画像を最適化してcanvasで再エンコード
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // 最大サイズを制限（Safariのメモリ制限対策）
            const maxWidth = 1200;
            const maxHeight = 1600;
            let width = img.width;
            let height = img.height;
            
            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width = width * ratio;
                height = height * ratio;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // 白背景を描画（透過PNG対策）
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
            
            // 画像を描画
            ctx.drawImage(img, 0, 0, width, height);
            
            // 最適化されたData URLを取得（品質0.85でファイルサイズ削減）
            const optimizedDataURL = canvas.toDataURL('image/jpeg', 0.85);
            
            currentReceiptData = {
                image: optimizedDataURL,
                timestamp: new Date(),
                paymentMethod: null,
                amount: 0,
                payer: '',          // 支払い者
                customerCount: 1,   // 客数（デフォルト1名）
                isPortrait: isPortrait
            };
            
            // プレビュー表示（縦画面撮影に最適化）
            const preview = document.getElementById('image-preview');
            let orientationWarning = '';
            
            if (!isPortrait) {
                orientationWarning = `
                    <div style="
                        position: absolute;
                        top: 8px;
                        left: 8px;
                        background: rgba(255, 152, 0, 0.9);
                        color: white;
                        padding: 4px 8px;
                        border-radius: 4px;
                        font-size: 12px;
                        font-weight: 600;
                    ">⚠️ 縦向き推奨</div>
                `;
            }
            
            preview.innerHTML = `
                <div style="position: relative;">
                    <img src="${optimizedDataURL}" style="
                        width: 100%;
                        height: 160px;
                        object-fit: cover;
                        border-radius: 8px;
                    " crossorigin="anonymous">
                    ${orientationWarning}
                </div>
            `;
            
            // 横向き撮影の場合は警告通知
            if (!isPortrait) {
                showNotification('📱 縦向きで撮影すると見やすくなります', 'warning');
            }
            
            // フォーム表示
            document.getElementById('current-receipt-form').style.display = 'block';
            
            // 撮影ボタンを次の伝票用に更新
            const cameraBtn = document.getElementById('camera-btn');
            cameraBtn.textContent = '次の伝票を撮影する';
        };
        
        img.onerror = function() {
            console.error('画像の読み込みに失敗しました');
            showNotification('❌ 画像の読み込みに失敗しました', 'error');
        };
        
        img.src = e.target.result;
    };
    
    reader.onerror = function() {
        console.error('ファイルの読み込みに失敗しました');
        showNotification('❌ ファイルの読み込みに失敗しました', 'error');
    };
    
    reader.readAsDataURL(file);
}

/**
 * 支払い方法選択
 */
function selectPaymentMethod(event) {
    const method = event.target.dataset.method;
    currentReceiptData.paymentMethod = method;
    
    // ボタンのスタイル更新
    document.querySelectorAll('.payment-method').forEach(btn => {
        btn.style.background = 'rgba(255, 255, 255, 0.2)';
        btn.style.borderColor = 'rgba(255, 255, 255, 0.3)';
    });
    
    event.target.style.background = 'rgba(76, 175, 80, 0.5)';
    event.target.style.borderColor = '#4CAF50';
}

/**
 * 伝票を確定
 */
function confirmReceipt() {
    const amountInput = document.getElementById('receipt-amount');
    const amount = parseInt(amountInput.value);
    const errorDiv = document.getElementById('amount-error');
    
    // エラーメッセージをクリア
    errorDiv.style.display = 'none';
    amountInput.style.borderColor = 'rgba(255, 255, 255, 0.3)';
    
    if (!currentReceiptData.paymentMethod) {
        showNotification('💳 支払い方法を選択してください', 'error');
        return;
    }
    
    if (!amount || amount <= 0) {
        errorDiv.textContent = '⚠️ 正しい金額を入力してください（1円以上）';
        errorDiv.style.display = 'block';
        amountInput.style.borderColor = '#FF5722';
        amountInput.focus();
        showNotification('💰 金額を正しく入力してください', 'error');
        return;
    }
    
    if (amount > 1000000) {
        errorDiv.textContent = '⚠️ 金額が大きすぎます（100万円以下で入力）';
        errorDiv.style.display = 'block';
        amountInput.style.borderColor = '#FF5722';
        amountInput.focus();
        showNotification('💰 金額を確認してください', 'error');
        return;
    }
    
    // 支払い者と客数を取得
    const payer = document.getElementById('receipt-payer').value.trim();
    const customerCount = parseInt(document.getElementById('receipt-customer-count').value);
    
    // 客数のバリデーション（0以上999以下）
    if (isNaN(customerCount) || customerCount < 0 || customerCount > 999) {
        showNotification('👥 客数は0〜999の範囲で入力してください', 'error');
        return;
    }
    
    // データに保存
    currentReceiptData.amount = amount;
    currentReceiptData.payer = payer;
    currentReceiptData.customerCount = customerCount;
    
    receipts.push({...currentReceiptData});
    
    // フォームをリセット
    document.getElementById('current-receipt-form').style.display = 'none';
    document.getElementById('receipt-amount').value = '';
    document.getElementById('receipt-payer').value = '';
    document.getElementById('receipt-customer-count').value = '1';
    document.querySelectorAll('.payment-method').forEach(btn => {
        btn.style.background = 'rgba(255, 255, 255, 0.2)';
        btn.style.borderColor = 'rgba(255, 255, 255, 0.3)';
    });
    
    // リスト更新
    updateReceiptList();
    updateTotals();
    
    // 完了ボタン表示
    if (receipts.length > 0) {
        document.getElementById('complete-report-btn').style.display = 'block';
    }
    
    showNotification('伝票を追加しました', 'success');
}

/**
 * 伝票リストを更新
 */
function updateReceiptList() {
    const listContainer = document.getElementById('receipt-list');
    listContainer.innerHTML = '';
    
    receipts.forEach((receipt, index) => {
        const receiptItem = document.createElement('div');
        receiptItem.style.cssText = `
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        `;
        
        // 支払い者表示（空の場合は表示しない）
        const payerDisplay = receipt.payer ? `<div style="color: rgba(255, 255, 255, 0.9); font-size: 13px; margin-top: 2px;">👤 ${receipt.payer}</div>` : '';
        // 客数表示（0の場合は追加伝票マークを表示）
        const customerCountColor = receipt.customerCount === 0 ? 'rgba(255, 193, 7, 0.9)' : 'rgba(255, 255, 255, 0.7)';
        const customerCountText = receipt.customerCount === 0 ? `${receipt.customerCount}名（追加伝票）` : `${receipt.customerCount}名`;
        const customerCountDisplay = `<div style="color: ${customerCountColor}; font-size: 12px; margin-top: 2px;">👥 ${customerCountText}</div>`;
        
        receiptItem.innerHTML = `
            <div style="display: flex; align-items: center; flex: 1;">
                <img src="${receipt.image}" crossorigin="anonymous" style="
                    width: 30px;
                    height: 40px;
                    object-fit: cover;
                    border-radius: 4px;
                    margin-right: 12px;
                    flex-shrink: 0;
                ">
                <div style="flex: 1; min-width: 0;">
                    <div style="color: white; font-size: 14px; font-weight: 500;">
                        ${receipt.paymentMethod === 'cash' ? '💵 現金' : '💳 その他'}
                        <span style="margin-left: 8px; color: #4CAF50;">¥${receipt.amount.toLocaleString()}</span>
                    </div>
                    ${payerDisplay}
                    ${customerCountDisplay}
                </div>
            </div>
            <button onclick="removeReceipt(${index})" style="
                background: rgba(255, 87, 34, 0.2);
                color: #FF5722;
                border: 1px solid rgba(255, 87, 34, 0.3);
                padding: 6px 8px;
                border-radius: 4px;
                font-size: 12px;
                cursor: pointer;
                flex-shrink: 0;
                margin-left: 8px;
            ">削除</button>
        `;
        
        listContainer.appendChild(receiptItem);
    });
}

/**
 * 合計を更新
 */
function updateTotals() {
    const totalAmount = receipts.reduce((sum, receipt) => sum + receipt.amount, 0);
    const totalCustomers = receipts.reduce((sum, receipt) => sum + (receipt.customerCount || 0), 0);
    
    document.getElementById('total-amount').textContent = `¥${totalAmount.toLocaleString()}`;
    document.getElementById('receipt-count').textContent = `伝票数: ${receipts.length}枚 | 総客数: ${totalCustomers}名`;
}

/**
 * 伝票を削除
 */
function removeReceipt(index) {
    receipts.splice(index, 1);
    updateReceiptList();
    updateTotals();
    
    if (receipts.length === 0) {
        document.getElementById('complete-report-btn').style.display = 'none';
    }
    
    showNotification('伝票を削除しました', 'warning');
}

/**
 * 売上報告を完了
 */
function completeReport() {
    if (receipts.length === 0) {
        alert('伝票を追加してから完了してください');
        return;
    }
    
    // 6枚ずつのグループに分割
    const groups = [];
    for (let i = 0; i < receipts.length; i += 6) {
        groups.push(receipts.slice(i, i + 6));
    }
    
    // 各グループの画像を生成
    generateReportImages(groups);
    
    showReportSummary();
}

/**
 * レポート画像を生成（6枚1組）
 */
async function generateReportImages(groups) {
    const reportDate = document.getElementById('report-date').value;
    
    for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
        const group = groups[groupIndex];
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // キャンバスサイズ設定（縦画面2行3列レイアウト + 金額表示スペース）
        canvas.width = 1200;
        canvas.height = 1300;  // 金額表示スペースを最適化
        
        // 背景色
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // タイトル
        ctx.fillStyle = '#333';
        ctx.font = 'bold 32px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`売上報告書 - ${reportDate}`, canvas.width / 2, 50);
        
        // グループ情報
        ctx.font = '24px sans-serif';
        ctx.fillText(`${groupIndex + 1}/${groups.length}ページ`, canvas.width / 2, 80);
        
        // 伝票画像配置（縦画面撮影対応：2行3列レイアウト）
        const imgWidth = 360;  // 縦画面に最適化された幅
        const imgHeight = 480; // 縦画面に最適化された高さ（4:3比率）
        const startX = 30;     // 左端余白を最小化
        const startY = 120;    // 上端位置
        const spacingX = 390;  // 横間隔を最小化（余白10px）
        const spacingY = 500;  // 縦間隔
        
        // すべての画像を並列で読み込む（Safari対応）
        const imageLoadPromises = group.map((receipt, index) => {
            return new Promise((resolve, reject) => {
                const col = index % 3;  // 3列レイアウト
                const row = Math.floor(index / 3);  // 2行レイアウト
                const x = startX + col * spacingX;
                const y = startY + row * spacingY;
                
                const img = new Image();
                
                // Safari対応：crossOrigin属性を設定
                img.crossOrigin = 'anonymous';
                
                img.onload = function() {
                    try {
                        // 画像描画
                        ctx.drawImage(img, x, y, imgWidth, imgHeight);
                        
                        // 金額と支払い方法の表示（スタイリッシュデザイン）
                        ctx.fillStyle = '#666';
                        ctx.font = '16px sans-serif';
                        ctx.textAlign = 'center';
                        ctx.fillText(
                            `${receipt.paymentMethod === 'cash' ? '現金' : 'その他'}`,
                            x + imgWidth / 2,
                            y + imgHeight + 20
                        );
                        ctx.fillStyle = '#000';
                        ctx.font = 'bold 20px sans-serif';
                        ctx.fillText(
                            `¥${receipt.amount.toLocaleString()}`,
                            x + imgWidth / 2,
                            y + imgHeight + 45
                        );
                        
                        resolve();
                    } catch (error) {
                        console.error('画像描画エラー:', error);
                        reject(error);
                    }
                };
                
                img.onerror = function(error) {
                    console.error('画像読み込みエラー:', error);
                    reject(error);
                };
                
                // Safari対応：Data URLを直接設定
                img.src = receipt.image;
            });
        });
        
        // すべての画像が読み込まれるまで待機
        try {
            await Promise.all(imageLoadPromises);
            
            // 合計金額（最後のページに表示）
            if (groupIndex === groups.length - 1) {
                const allTotal = receipts.reduce((sum, receipt) => sum + receipt.amount, 0);
                const totalCustomers = receipts.reduce((sum, receipt) => sum + (receipt.customerCount || 0), 0);
                ctx.fillStyle = '#4CAF50';
                ctx.fillRect(50, canvas.height - 150, canvas.width - 100, 100);
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 36px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(`合計金額: ¥${allTotal.toLocaleString()}`, canvas.width / 2, canvas.height - 95);
                ctx.font = '20px sans-serif';
                ctx.fillText(`伝票数: ${receipts.length}枚 | 総客数: ${totalCustomers}名`, canvas.width / 2, canvas.height - 60);
            }
            
            // 画像を写真フォルダに保存またはダウンロード
            await saveImageToPhotos(canvas, `売上報告_${reportDate}_${groupIndex + 1}.png`);
            
        } catch (error) {
            console.error('レポート生成エラー:', error);
            showNotification('⚠️ 一部の画像の読み込みに失敗しました', 'error');
        }
    }
}

/**
 * 画像をiPhone写真アプリに保存
 */
async function saveImageToPhotos(canvas, filename) {
    try {
        // Safari対応：JPEGで圧縮してサイズを削減
        const dataURL = canvas.toDataURL('image/jpeg', 0.9);
        
        // 新しいウィンドウで画像を表示（長押しで保存可能）
        const imageWindow = window.open('', '_blank');
        
        if (!imageWindow) {
            throw new Error('ポップアップがブロックされました');
        }
        
        imageWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>売上報告書 - 長押しで保存</title>
                <style>
                    body {
                        margin: 0;
                        padding: 20px;
                        background: #000;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                    }
                    .instruction {
                        color: white;
                        text-align: center;
                        margin-bottom: 20px;
                        padding: 15px;
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 10px;
                        font-size: 16px;
                        line-height: 1.4;
                    }
                    img {
                        max-width: 100%;
                        height: auto;
                        border-radius: 10px;
                        box-shadow: 0 4px 20px rgba(255, 255, 255, 0.1);
                        display: block;
                    }
                    .close-btn {
                        margin-top: 20px;
                        background: #007AFF;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 8px;
                        font-size: 16px;
                        cursor: pointer;
                    }
                </style>
            </head>
            <body>
                <div class="instruction">
                    📱 <strong>iPhone写真アプリに保存する方法</strong><br>
                    ↓ 下の画像を長押しして「写真に保存」を選択してください
                </div>
                <img src="${dataURL}" alt="売上報告書" crossorigin="anonymous">
                <button class="close-btn" onclick="window.close()">閉じる</button>
            </body>
            </html>
        `);
        
        // ドキュメントを閉じて描画を完了
        imageWindow.document.close();
        
        showNotification('📱 新しい画面で画像を長押しして「写真に保存」を選択してください', 'success');
        
    } catch (error) {
        console.error('画像表示エラー:', error);
        
        // フォールバック：データURLで直接表示
        try {
            const dataURL = canvas.toDataURL('image/jpeg', 0.9);
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = filename;
            link.target = '_blank';
            
            // Safari対応：クリックイベントを作成
            const clickEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            link.dispatchEvent(clickEvent);
            
            showNotification('📱 開いた画像を長押しして「写真に保存」を選択してください', 'info');
        } catch (fallbackError) {
            console.error('フォールバックエラー:', fallbackError);
            
            // 最終フォールバック：従来のダウンロード
            const link = document.createElement('a');
            link.download = filename;
            link.href = canvas.toDataURL('image/jpeg', 0.9);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showNotification('ダウンロードフォルダに保存されました', 'warning');
        }
    }
}



/**
 * レポート完了画面を表示
 */
function showReportSummary() {
    const totalAmount = receipts.reduce((sum, receipt) => sum + receipt.amount, 0);
    const totalCustomers = receipts.reduce((sum, receipt) => sum + (receipt.customerCount || 0), 0);
    const reportDate = document.getElementById('report-date').value;
    
    // スプレッドシートに売上データを送信（伝票ごとに送信）
    sendMobileSalesDataToSpreadsheet(receipts, reportDate);
    
    const appRoot = document.getElementById('app-root');
    appRoot.innerHTML = `
        <div style="
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            text-align: center;
            overflow: hidden;
            box-sizing: border-box;
        ">
            <div style="
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(20px);
                border-radius: 20px;
                padding: 30px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                max-width: 350px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-sizing: border-box;
            ">
                <div style="font-size: 64px; margin-bottom: 20px;">✅</div>
                <h2 style="color: white; margin: 0 0 16px 0;">売上報告完了</h2>
                <div style="color: rgba(255, 255, 255, 0.8); margin-bottom: 24px;">
                    <div style="margin-bottom: 8px;">📅 ${reportDate}</div>
                    <div style="margin-bottom: 8px;">📄 伝票数: ${receipts.length}枚</div>
                    <div style="margin-bottom: 8px;">👥 総客数: ${totalCustomers}名</div>
                    <div style="font-size: 18px; font-weight: 600; color: #4CAF50;">
                        💰 合計: ¥${totalAmount.toLocaleString()}
                    </div>
                </div>
                <div style="
                    background: rgba(76, 175, 80, 0.2);
                    border-radius: 12px;
                    padding: 16px;
                    margin-bottom: 24px;
                    font-size: 14px;
                    color: #4CAF50;
                    border-left: 4px solid #4CAF50;
                ">
                    📱 <strong>iPhone写真アプリに保存完了</strong><br>
                    新しい画面で画像を長押しして「写真に保存」を選択してください
                </div>
                <div style="
                    background: rgba(33, 150, 243, 0.2);
                    border-radius: 12px;
                    padding: 16px;
                    margin-bottom: 24px;
                    font-size: 14px;
                    color: white;
                    border-left: 4px solid white;
                ">
                    📊 <strong>スプレッドシートに自動送信</strong><br>
                    売上データが設定されたシートに記録されました
                </div>
                <button onclick="location.reload()" style="
                    width: 100%;
                    background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
                    color: white;
                    border: none;
                    padding: 16px;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                ">新しい報告を開始</button>
            </div>
        </div>
    `;
}

/**
 * モバイル専用通知表示
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const colors = {
        success: '#4CAF50',
        error: '#FF5722',
        warning: '#FF9800',
        info: '#2196F3'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${colors[type] || colors.info};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        max-width: 90%;
        text-align: center;
        line-height: 1.4;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // 6秒後に自動削除（写真保存メッセージは長めに表示）
    const duration = message.includes('写真に保存') ? 8000 : 4000;
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, duration);
}

/**
 * スプレッドシート連携状況を確認・表示
 */
function checkAndDisplaySpreadsheetStatus() {
    const config = getMobileSpreadsheetConfig();
    const statusDiv = document.getElementById('spreadsheet-status-mobile');
    
    if (!statusDiv) return;
    
    if (config) {
        statusDiv.innerHTML = '📊 スプレッドシート連携: 有効 - 売上報告完了時に自動送信されます';
        statusDiv.style.background = 'rgba(76, 175, 80, 0.9)';
        statusDiv.style.display = 'block';
        
        // 5秒後に自動で非表示
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 5000);
    } else {
        statusDiv.innerHTML = '📊 スプレッドシート連携: 未設定 - デスクトップ版で設定できます';
        statusDiv.style.background = 'rgba(255, 152, 0, 0.9)';
        statusDiv.style.display = 'block';
        
        // 3秒後に自動で非表示
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 3000);
    }
}

/**
 * モバイル売上データをスプレッドシートに送信
 */
async function sendMobileSalesDataToSpreadsheet(receipts, reportDate) {
    try {
        // スプレッドシート設定を確認
        const config = getMobileSpreadsheetConfig();
        if (!config) {
            console.log('📊 スプレッドシート設定がありません - スキップします');
            return;
        }
        
        // 日付形式を変換（YYYY-MM-DD → YYYY/MM/DD）
        const formattedDate = reportDate.replace(/-/g, '/');
        
        console.log('📱 モバイル売上データをスプレッドシートに送信中:', {
            date: formattedDate,
            receiptsCount: receipts.length
        });
        
        // 各伝票のデータを配列に変換
        const rows = receipts.map(receipt => [
            formattedDate,                      // 日付
            receipt.payer || '（未記入）',      // 支払い者
            receipt.customerCount || 1,         // 客数
            receipt.amount                      // 売上金額
        ]);
        
        console.log('📊 送信データ:', rows);
        
        // Netlify Functions経由でスプレッドシートにデータを送信
        const response = await fetch('/.netlify/functions/sheets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'append',
                sheetId: config.sheetId,
                sheetName: config.sheetName || '売上データ',
                values: rows  // 複数行をまとめて送信
            })
        });

        console.log('📥 Response status:', response.status, response.statusText);

        const result = await response.json();
        console.log('📄 Response body:', result);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${result.error || response.statusText}\n詳細: ${result.details || 'なし'}`);
        }
        
        if (result.success) {
            console.log('✅ スプレッドシートに送信成功:', result);
            showNotification(`📊 ${receipts.length}件の売上データを送信しました！`, 'success');
        } else {
            throw new Error(result.error || 'データ送信失敗');
        }
        
    } catch (error) {
        console.error('❌ モバイル売上データ送信エラー:', error);
        
        // エラーの詳細をより分かりやすく表示
        let errorMessage = error.message;
        if (errorMessage.includes('API Key')) {
            errorMessage = '🔑 API Keyが設定されていません。Netlifyの環境変数を確認してください。';
        } else if (errorMessage.includes('403')) {
            errorMessage = '🚫 スプレッドシートへのアクセスが拒否されました。共有設定を確認してください。';
        } else if (errorMessage.includes('404')) {
            errorMessage = '🔍 スプレッドシートが見つかりません。URLを確認してください。';
        }
        
        showNotification(`⚠️ ${errorMessage}`, 'warning');
    }
}

/**
 * モバイル用スプレッドシート設定を取得
 */
function getMobileSpreadsheetConfig() {
    try {
        const config = localStorage.getItem('spreadsheet_config');
        if (!config) return null;
        
        const settings = JSON.parse(config);
        if (!settings.sheetId) return null;
        
        return {
            url: settings.url,
            sheetId: settings.sheetId,
            sheetName: settings.sheetName || '売上データ'
        };
        
    } catch (error) {
        console.error('❌ スプレッドシート設定取得エラー:', error);
        return null;
    }
}

/**
 * 日付形式を変換（YYYY-MM-DD → MM/DD）
 */
function formatDateForSpreadsheet(dateString) {
    try {
        const date = new Date(dateString);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${month}/${day}`;
    } catch (error) {
        console.error('❌ 日付変換エラー:', error);
        return dateString;
    }
}

// モバイルアプリ開始用のグローバル関数
window.startMobileSalesReport = initMobileSalesReport;