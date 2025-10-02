/**
 * 認証モジュール (Auth Module)
 * GitHub Pages認証システムとローカル認証システムの管理
 */

/**
 * GitHub Pagesログイン画面を表示
 */
function showGitHubPagesLogin() {
    console.log('🌐 GitHub Pagesログイン画面を表示中...');
    document.getElementById('app-root').innerHTML = `
        <div style="
            min-height: 100vh;
            background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #22d3ee 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            position: relative;
            overflow: hidden;
        ">
            <!-- 背景パターン -->
            <div style="
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                            radial-gradient(circle at 75% 25%, rgba(255,255,255,0.08) 1px, transparent 1px),
                            radial-gradient(circle at 50% 75%, rgba(255,255,255,0.06) 1px, transparent 1px);
                background-size: 50px 50px;
                animation: float 25s infinite linear;
                z-index: 1;
            "></div>
            
            <!-- メインコンテナ -->
            <div style="
                background: rgba(255, 255, 255, 0.96);
                backdrop-filter: blur(24px);
                border-radius: 20px;
                box-shadow: 0 24px 48px rgba(14, 165, 233, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.2);
                width: 100%;
                max-width: 420px;
                margin: 20px;
                overflow: hidden;
                position: relative;
                z-index: 1;
            ">
                <!-- ヘッダー -->
                <div style="
                    background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
                    padding: 40px 40px 45px 40px;
                    text-align: center;
                    position: relative;
                ">
                    <div style="
                        width: 72px;
                        height: 72px;
                        background: rgba(255, 255, 255, 0.15);
                        border-radius: 16px;
                        margin: 0 auto 20px auto;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 28px;
                        backdrop-filter: blur(12px);
                        border: 1px solid rgba(255, 255, 255, 0.25);
                    ">🌐</div>
                    <h1 style="
                        color: white;
                        margin: 0;
                        font-size: 26px;
                        font-weight: 600;
                        letter-spacing: -0.3px;
                    ">売上管理システム</h1>
                    <p style="
                        color: rgba(255, 255, 255, 0.92);
                        margin: 8px 0 0 0;
                        font-size: 15px;
                        font-weight: 400;
                        opacity: 0.9;
                    ">GitHub Pages Demo</p>
                </div>
                
                <!-- ログインフォーム -->
                <div style="padding: 36px;">
                    <form id="login-form">
                        <div style="margin-bottom: 22px;">
                            <label style="
                                display: block;
                                margin-bottom: 6px;
                                color: #1e293b;
                                font-size: 13px;
                                font-weight: 600;
                                text-transform: uppercase;
                                letter-spacing: 0.05em;
                            ">ユーザー名</label>
                            <div style="position: relative;">
                                <input type="text" id="username" name="username" 
                                       style="
                                           width: 100%;
                                           padding: 14px 14px 14px 44px;
                                           border: 1.5px solid #e2e8f0;
                                           border-radius: 10px;
                                           font-size: 15px;
                                           transition: all 0.2s ease;
                                           background: #f8fafc;
                                           box-sizing: border-box;
                                           color: #1e293b;
                                       "
                                       placeholder="kiradan"
                                       onfocus="this.style.borderColor='#0ea5e9'; this.style.background='white'; this.style.boxShadow='0 0 0 3px rgba(14, 165, 233, 0.1)'"
                                       onblur="this.style.borderColor='#e2e8f0'; this.style.background='#f8fafc'; this.style.boxShadow='none'">
                                <div style="
                                    position: absolute;
                                    left: 14px;
                                    top: 50%;
                                    transform: translateY(-50%);
                                    color: #64748b;
                                    font-size: 16px;
                                ">👤</div>
                            </div>
                        </div>
                        
                        <div style="margin-bottom: 28px;">
                            <label style="
                                display: block;
                                margin-bottom: 6px;
                                color: #1e293b;
                                font-size: 13px;
                                font-weight: 600;
                                text-transform: uppercase;
                                letter-spacing: 0.05em;
                            ">パスワード</label>
                            <div style="position: relative;">
                                <input type="password" id="password" name="password" 
                                       style="
                                           width: 100%;
                                           padding: 14px 14px 14px 44px;
                                           border: 1.5px solid #e2e8f0;
                                           border-radius: 10px;
                                           font-size: 15px;
                                           transition: all 0.2s ease;
                                           background: #f8fafc;
                                           box-sizing: border-box;
                                           color: #1e293b;
                                       "
                                       placeholder="パスワードを入力"
                                       onfocus="this.style.borderColor='#0ea5e9'; this.style.background='white'; this.style.boxShadow='0 0 0 3px rgba(14, 165, 233, 0.1)'"
                                       onblur="this.style.borderColor='#e2e8f0'; this.style.background='#f8fafc'; this.style.boxShadow='none'">
                                <div style="
                                    position: absolute;
                                    left: 14px;
                                    top: 50%;
                                    transform: translateY(-50%);
                                    color: #64748b;
                                    font-size: 16px;
                                ">🔒</div>
                            </div>
                        </div>
                        
                        <button type="submit" style="
                            width: 100%;
                            background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
                            color: white;
                            border: none;
                            padding: 14px;
                            border-radius: 10px;
                            font-size: 15px;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.2s ease;
                            position: relative;
                            overflow: hidden;
                            text-transform: uppercase;
                            letter-spacing: 0.05em;
                        "
                        onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 8px 20px rgba(14, 165, 233, 0.3)'"
                        onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'"
                        onmousedown="this.style.transform='translateY(0px)'"
                        onmouseup="this.style.transform='translateY(-1px)'">
                            <span style="position: relative; z-index: 1;">デモログイン</span>
                        </button>
                    </form>
                    
                    <div id="login-error" style="
                        margin-top: 18px;
                        padding: 14px;
                        background: #fef2f2;
                        border: 1px solid #fecaca;
                        border-radius: 8px;
                        color: #dc2626;
                        font-size: 13px;
                        display: none;
                    "></div>
                    
                    <!-- デモアカウント情報 -->
                    <div style="
                        margin-top: 28px;
                        padding: 18px;
                        background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
                        border-radius: 10px;
                        border: 1px solid #bae6fd;
                    ">
                        <div style="
                            display: flex;
                            align-items: center;
                            margin-bottom: 10px;
                        ">
                            <span style="font-size: 18px; margin-right: 8px;">🎯</span>
                            <span style="
                                color: #0369a1;
                                font-weight: 600;
                                font-size: 13px;
                                text-transform: uppercase;
                                letter-spacing: 0.05em;
                            ">デモアカウント</span>
                        </div>
                        <div style="
                            color: #0369a1;
                            font-size: 13px;
                            line-height: 1.5;
                            font-family: 'SF Mono', Monaco, monospace;
                        ">
                            <div>👨‍💼 <strong>kiradan</strong> / kiradan2024!</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // ログインフォームのイベントリスナー
    document.getElementById('login-form').addEventListener('submit', handleGitHubPagesLogin);
}

/**
 * GitHub Pagesログイン処理
 */
async function handleGitHubPagesLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('login-error');
    
    console.log('🔑 GitHub Pagesログイン試行:', username);
    
    // 簡易認証（GitHub Pages用）
    if (username === 'kiradan' && password === 'kiradan2024!') {
        console.log('✅ GitHub Pagesログイン成功');
        
        // ローカルストレージに認証状態を保存
        localStorage.setItem('githubPagesAuth', 'true');
        localStorage.setItem('githubPagesUser', username);
        
        // メインアプリを表示
        createMainApp();
    } else {
        console.log('❌ GitHub Pagesログイン失敗');
        errorDiv.textContent = 'ユーザー名またはパスワードが正しくありません';
        errorDiv.style.display = 'block';
    }
}

/**
 * ローカル認証用のログインメッセージ表示
 */
function showLoginMessage() {
    console.log('🔐 ログインメッセージを表示中...');
    document.getElementById('app-root').innerHTML = `
        <div style="
            min-height: 100vh;
            background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #22d3ee 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            position: relative;
            overflow: hidden;
        ">
            <div style="
                background: rgba(255, 255, 255, 0.96);
                backdrop-filter: blur(24px);
                border-radius: 20px;
                box-shadow: 0 24px 48px rgba(14, 165, 233, 0.12);
                width: 100%;
                max-width: 420px;
                margin: 20px;
                text-align: center;
                padding: 40px;
            ">
                <div style="font-size: 64px; margin-bottom: 20px;">🔐</div>
                <h1 style="color: #1e293b; margin: 0 0 16px 0; font-size: 24px;">認証が必要です</h1>
                <p style="color: #64748b; margin: 0 0 28px 0;">
                    このアプリケーションにアクセスするには、<br>
                    バックエンドサーバーでの認証が必要です。
                </p>
                <a href="${API_BASE_URL}/login" style="
                    display: inline-block;
                    background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
                    color: white;
                    text-decoration: none;
                    padding: 14px 28px;
                    border-radius: 10px;
                    font-weight: 600;
                    transition: all 0.2s ease;
                ">ログイン画面へ</a>
            </div>
        </div>
    `;
}

/**
 * 認証状態を確認
 */
function isAuthenticated() {
    if (IS_GITHUB_PAGES) {
        return localStorage.getItem('githubPagesAuth') === 'true';
    }
    // ローカル環境では常に認証済みとして扱う（開発用）
    return true;
}

/**
 * 認証ユーザー名を取得
 */
function getAuthenticatedUser() {
    if (IS_GITHUB_PAGES) {
        return localStorage.getItem('githubPagesUser') || 'Guest';
    }
    return 'Developer';
}

/**
 * ログアウト処理
 */
function logout() {
    if (IS_GITHUB_PAGES) {
        localStorage.removeItem('githubPagesAuth');
        localStorage.removeItem('githubPagesUser');
        showGitHubPagesLogin();
    } else {
        window.location.href = `${API_BASE_URL}/logout`;
    }
}

/**
 * 認証初期化
 */
function initAuth() {
    console.log('🔐 認証システム初期化...');
    
    if (IS_GITHUB_PAGES) {
        if (isAuthenticated()) {
            console.log('✅ GitHub Pages認証済み');
            createMainApp();
        } else {
            console.log('❌ GitHub Pages未認証');
            showGitHubPagesLogin();
        }
    } else {
        // ローカル環境では認証をスキップ
        console.log('🏠 ローカル環境 - 認証スキップ');
        createMainApp();
    }
}