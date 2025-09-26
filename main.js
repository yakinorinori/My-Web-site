// ページロード時にsales.csvを自動取得して表示
// 更新: 2025-09-11 ログイン画面修正
console.log('🚀 main.js読み込み開始');
let globalData = [];

// API設定 - 環境に応じて動的に設定
const API_BASE_URL = window.location.hostname === 'yakinorinori.github.io' 
    ? '' // GitHub Pages用: デモモードでHTTP通信なし
    : window.location.protocol === 'https:' 
        ? `https://${window.location.hostname}:3001`  // HTTPS環境
        : `http://localhost:3001`;  // ローカル環境（HTTP）

// GitHub Pages用のフォールバック機能
const IS_GITHUB_PAGES = window.location.hostname === 'yakinorinori.github.io';

// 認証チェック機能
async function checkAuthentication() {
    try {
        console.log('🔍 認証状態をチェック中...');
        
        // GitHub Pagesの場合はローカルストレージをチェック
        if (IS_GITHUB_PAGES) {
            console.log('📱 GitHub Pages検出: ローカル認証状態をチェック');
            const isAuth = localStorage.getItem('githubPagesAuth') === 'true';
            const username = localStorage.getItem('githubPagesUser');
            
            if (isAuth && username) {
                console.log('✅ GitHub Pages認証済み:', username);
                showUserInfo(username);
                return true;
            } else {
                console.log('❌ GitHub Pages未認証');
                return false;
            }
        }
        
        const response = await fetch(`${API_BASE_URL}/check_auth`, {
            method: 'GET',
            credentials: 'include'
        });
        
        console.log('📡 認証レスポンス状態:', response.status);
        
        if (!response.ok) {
            console.log('❌ 認証失敗: レスポンスが正常ではありません');
            showLoginMessage();
            return false;
        }
        
        const authData = await response.json();
        console.log('📊 認証データ:', authData);
        
        if (!authData.authenticated) {
            console.log('❌ 認証失敗: authenticated=false');
            showLoginMessage();
            return false;
        }
        
        // 認証済みの場合、ユーザー情報を表示
        console.log('✅ 認証成功:', authData.username);
        showUserInfo(authData.username);
        return true;
    } catch (error) {
        console.error('🚨 認証チェックエラー:', error);
        showLoginMessage();
        return false;
    }
}

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
                background-image: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><circle cx=\"25\" cy=\"25\" r=\"1.5\" fill=\"white\" opacity=\"0.1\"/><circle cx=\"75\" cy=\"25\" r=\"1\" fill=\"white\" opacity=\"0.08\"/><circle cx=\"50\" cy=\"75\" r=\"1.2\" fill=\"white\" opacity=\"0.06\"/></svg>');
                background-repeat: repeat;
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
            <!-- 背景パターン -->
            <div style="
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><circle cx=\"25\" cy=\"25\" r=\"1.5\" fill=\"white\" opacity=\"0.1\"/><circle cx=\"75\" cy=\"25\" r=\"1\" fill=\"white\" opacity=\"0.08\"/><circle cx=\"50\" cy=\"75\" r=\"1.2\" fill=\"white\" opacity=\"0.06\"/></svg>');
                background-repeat: repeat;
                animation: float 30s infinite linear;
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
                    ">📊</div>
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
                    ">Business Analytics Platform</p>
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
                                       placeholder="ユーザー名を入力"
                                       required
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
                                       required
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
                            <span style="position: relative; z-index: 1;">ログイン</span>
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
                            <span style="font-size: 18px; margin-right: 8px;">�</span>
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
                            <div>👤 <strong>user1</strong> / password123</div>
                            <div>👤 <strong>user2</strong> / password456</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <style>
            @keyframes float {
                0% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-15px) rotate(180deg); }
                100% { transform: translateY(0px) rotate(360deg); }
            }
            
            input:focus {
                outline: none !important;
            }
            
            @media (max-width: 480px) {
                .login-container {
                    margin: 10px;
                    padding: 28px 18px;
                }
            }
        </style>
    `;
    
    // ログインフォームのイベントリスナーを追加
    document.getElementById('login-form').addEventListener('submit', handleLogin);
}

// ログイン処理関数
async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('login-error');
    
    console.log('🔑 ログイン試行:', username);
    
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            console.log('✅ ログイン成功:', result.username);
            // ログイン成功後、メインアプリを表示
            showUserInfo(result.username);
            createMainApp();
        } else {
            console.log('❌ ログイン失敗:', result.message);
            errorDiv.textContent = result.message || 'ログインに失敗しました';
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        console.error('🚨 ログインエラー:', error);
        errorDiv.textContent = 'ネットワークエラーが発生しました';
        errorDiv.style.display = 'block';
    }
}

function showUserInfo(username) {
    // ユーザー情報とログアウトボタンを追加
    const userInfo = document.createElement('div');
    userInfo.id = 'user-info';
    userInfo.style.cssText = 'position: fixed; top: 10px; right: 10px; background: #667eea; color: white; padding: 10px 20px; border-radius: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); z-index: 1000;';
    userInfo.innerHTML = `
        👤 ${username} 
        <button onclick="logout()" style="background: #ff4757; color: white; border: none; padding: 5px 10px; border-radius: 3px; margin-left: 10px; cursor: pointer;">
            ログアウト
        </button>
    `;
    document.body.appendChild(userInfo);
}

async function logout() {
    try {
        await fetch(`${API_BASE_URL}/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        window.location.reload();
    } catch (error) {
        console.error('ログアウトエラー:', error);
        window.location.reload();
    }
}

// 認証付きFetch関数
async function authenticatedFetch(url, options = {}) {
    const defaultOptions = {
        credentials: 'include',
        ...options
    };
    
    const response = await fetch(url, defaultOptions);
    
    if (response.status === 401) {
        showLoginMessage();
        throw new Error('認証が必要です');
    }
    
    return response;
}

// アプリケーション初期化（認証チェック後）
async function initializeApp() {
    console.log('🔧 initializeApp()開始');
    console.log('🌐 hostname:', window.location.hostname);
    console.log('📍 IS_GITHUB_PAGES:', IS_GITHUB_PAGES);
    
    // GitHub Pagesの場合
    if (IS_GITHUB_PAGES) {
        console.log('🌐 GitHub Pagesモード');
        
        // 認証状態をチェック
        const isAuthenticated = await checkAuthentication();
        if (!isAuthenticated) {
            // 未認証の場合はログイン画面を表示
            console.log('🔑 ログイン画面を表示');
            showGitHubPagesLogin();
            return;
        }
        
        // 認証済みの場合はメインアプリを表示
        console.log('✅ 認証済み - メインアプリ表示');
        createMainApp();
        return;
    }
    
    // Mac mini環境では認証チェック
    console.log('🖥️ Mac mini環境モード');
    const isAuthenticated = await checkAuthentication();
    if (!isAuthenticated) {
        return; // showLoginMessage()は既にcheckAuthentication内で呼ばれる
    }
    
    // 認証成功後、アプリのUIを構築
    createMainApp();
}
window.onload = function() {
    console.log('🌟 ページ読み込み完了 - initializeApp()を実行');
    // 認証チェックしてからアプリ初期化
    initializeApp();
}

function createMainApp() {
    console.log('🏢 メインアプリケーション初期化中...');
    
    // ルート要素取得
    const root = document.getElementById('app-root');
    root.innerHTML = '';
    
    // メインコンテナのスタイル設定
    root.style.cssText = `
        min-height: 100vh;
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        margin: 0;
        padding: 0;
    `;
    
    // ヘッダー作成
    const header = document.createElement('div');
    header.style.cssText = `
        background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
        color: white;
        padding: 20px 0;
        box-shadow: 0 4px 20px rgba(14, 165, 233, 0.15);
        position: relative;
        overflow: hidden;
    `;
    
    header.innerHTML = `
        <div style="
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            z-index: 2;
        ">
            <div style="display: flex; align-items: center;">
                <div style="
                    width: 48px;
                    height: 48px;
                    background: rgba(255, 255, 255, 0.15);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    margin-right: 16px;
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.25);
                ">📊</div>
                <div>
                    <h1 style="
                        margin: 0;
                        font-size: 24px;
                        font-weight: 600;
                        letter-spacing: -0.3px;
                    ">${IS_GITHUB_PAGES ? '売上管理システム - デモ版' : '売上管理システム'}</h1>
                    <p style="
                        margin: 4px 0 0 0;
                        font-size: 14px;
                        opacity: 0.9;
                        font-weight: 400;
                    ">Business Analytics Dashboard</p>
                </div>
            </div>
            <div style="
                display: flex;
                align-items: center;
                font-size: 14px;
                opacity: 0.9;
            ">
                <span style="margin-right: 12px;">👤 ${localStorage.getItem('username') || 'ユーザー'}</span>
                <button onclick="logout()" style="
                    background: rgba(255, 255, 255, 0.15);
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.25);
                    padding: 8px 16px;
                    border-radius: 8px;
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    backdrop-filter: blur(12px);
                    transition: all 0.2s ease;
                "
                onmouseover="this.style.background='rgba(255, 255, 255, 0.25)'"
                onmouseout="this.style.background='rgba(255, 255, 255, 0.15)'">
                    ログアウト
                </button>
            </div>
        </div>
        
        <!-- 背景パターン -->
        <div style="
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><circle cx=\"25\" cy=\"25\" r=\"1.5\" fill=\"white\" opacity=\"0.06\"/><circle cx=\"75\" cy=\"25\" r=\"1\" fill=\"white\" opacity=\"0.04\"/><circle cx=\"50\" cy=\"75\" r=\"1.2\" fill=\"white\" opacity=\"0.05\"/></svg>');
            background-repeat: repeat;
            z-index: 1;
        "></div>
    `;
    
    root.appendChild(header);
    
    // メインコンテンツ領域
    const mainContent = document.createElement('div');
    mainContent.style.cssText = `
        max-width: 1200px;
        margin: 0 auto;
        padding: 30px 20px;
    `;
    
    // 分析選択カード
    const analysisSelector = document.createElement('div');
    analysisSelector.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
    `;
    
    // 年分析ボタン
    const yearCard = document.createElement('div');
    yearCard.style.cssText = `
        background: white;
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        border: 1px solid rgba(14, 165, 233, 0.1);
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    `;
    
    yearCard.innerHTML = `
        <div style="
            display: flex;
            align-items: center;
            margin-bottom: 16px;
        ">
            <div style="
                width: 48px;
                height: 48px;
                background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                color: white;
                margin-right: 16px;
            ">📈</div>
            <div>
                <h3 style="
                    margin: 0;
                    font-size: 18px;
                    font-weight: 600;
                    color: #1e293b;
                ">年間分析</h3>
                <p style="
                    margin: 4px 0 0 0;
                    font-size: 14px;
                    color: #64748b;
                ">年別の売上・客数・組数を分析</p>
            </div>
        </div>
        <div style="
            padding: 12px 16px;
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border-radius: 8px;
            border: 1px solid #bae6fd;
        ">
            <span style="
                color: #0369a1;
                font-size: 13px;
                font-weight: 500;
            ">🎯 長期トレンド分析に最適</span>
        </div>
    `;
    
    yearCard.onclick = () => {
        showYearAnalysis();
        monthSelectDiv.style.display = 'none';
        // アクティブ状態の管理
        yearCard.style.boxShadow = '0 8px 30px rgba(14, 165, 233, 0.2)';
        yearCard.style.transform = 'translateY(-2px)';
        monthCard.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
        monthCard.style.transform = 'translateY(0)';
    };
    
    yearCard.onmouseenter = () => {
        if (yearCard.style.transform !== 'translateY(-2px)') {
            yearCard.style.transform = 'translateY(-4px)';
            yearCard.style.boxShadow = '0 12px 40px rgba(14, 165, 233, 0.15)';
        }
    };
    
    yearCard.onmouseleave = () => {
        if (yearCard.style.transform !== 'translateY(-2px)') {
            yearCard.style.transform = 'translateY(0)';
            yearCard.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
        }
    };
    
    // 月分析ボタン
    const monthCard = document.createElement('div');
    monthCard.style.cssText = `
        background: white;
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        border: 1px solid rgba(14, 165, 233, 0.1);
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    `;
    
    monthCard.innerHTML = `
        <div style="
            display: flex;
            align-items: center;
            margin-bottom: 16px;
        ">
            <div style="
                width: 48px;
                height: 48px;
                background: linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                color: white;
                margin-right: 16px;
            ">📊</div>
            <div>
                <h3 style="
                    margin: 0;
                    font-size: 18px;
                    font-weight: 600;
                    color: #1e293b;
                ">月間分析</h3>
                <p style="
                    margin: 4px 0 0 0;
                    font-size: 14px;
                    color: #64748b;
                ">月別の詳細な売上分析</p>
            </div>
        </div>
        <div style="
            padding: 12px 16px;
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border-radius: 8px;
            border: 1px solid #bae6fd;
        ">
            <span style="
                color: #0369a1;
                font-size: 13px;
                font-weight: 500;
            ">📋 詳細な月次レポート</span>
        </div>
    `;
    
    monthCard.onclick = () => {
        showMonthAnalysis();
        monthSelectDiv.style.display = 'block';
        // アクティブ状態の管理
        monthCard.style.boxShadow = '0 8px 30px rgba(14, 165, 233, 0.2)';
        monthCard.style.transform = 'translateY(-2px)';
        yearCard.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
        yearCard.style.transform = 'translateY(0)';
    };
    
    monthCard.onmouseenter = () => {
        if (monthCard.style.transform !== 'translateY(-2px)') {
            monthCard.style.transform = 'translateY(-4px)';
            monthCard.style.boxShadow = '0 12px 40px rgba(14, 165, 233, 0.15)';
        }
    };
    
    monthCard.onmouseleave = () => {
        if (monthCard.style.transform !== 'translateY(-2px)') {
            monthCard.style.transform = 'translateY(0)';
            monthCard.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
        }
    };
    
    analysisSelector.appendChild(yearCard);
    analysisSelector.appendChild(monthCard);
    mainContent.appendChild(analysisSelector);
    
    // 月選択プルダウン（スタイリッシュに）
    const monthSelectDiv = document.createElement('div');
    monthSelectDiv.id = 'month-select-div';
    monthSelectDiv.style.cssText = `
        background: white;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 24px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        border: 1px solid rgba(14, 165, 233, 0.1);
        display: none;
    `;
    
    monthSelectDiv.innerHTML = `
        <div style="
            display: flex;
            align-items: center;
            margin-bottom: 12px;
        ">
            <span style="
                color: #1e293b;
                font-size: 16px;
                font-weight: 600;
                margin-right: 12px;
            ">📅 対象月を選択</span>
        </div>
        <select id="month-select" style="
            width: 100%;
            max-width: 300px;
            padding: 12px 16px;
            border: 1.5px solid #e2e8f0;
            border-radius: 8px;
            font-size: 15px;
            background: #f8fafc;
            color: #1e293b;
            font-weight: 500;
            transition: all 0.2s ease;
        "
        onfocus="this.style.borderColor='#0ea5e9'; this.style.background='white'; this.style.boxShadow='0 0 0 3px rgba(14, 165, 233, 0.1)'"
        onblur="this.style.borderColor='#e2e8f0'; this.style.background='#f8fafc'; this.style.boxShadow='none'">
        </select>
    `;
    
    
    const monthSelect = monthSelectDiv.querySelector('#month-select');
    mainContent.appendChild(monthSelectDiv);

    // 分析結果表示エリア
    const analysisContainer = document.createElement('div');
    analysisContainer.style.cssText = `
        background: white;
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        border: 1px solid rgba(14, 165, 233, 0.1);
        overflow: hidden;
        margin-bottom: 24px;
    `;
    
    // 分析用div
    const divYear = document.createElement('div');
    divYear.id = 'analysis-year';
    divYear.style.cssText = `
        display: none;
        padding: 24px;
    `;
    
    const divMonth = document.createElement('div');
    divMonth.id = 'analysis-month';
    divMonth.style.cssText = `
        padding: 24px;
    `;
    
    const divWeekday = document.createElement('div');
    divWeekday.id = 'analysis-weekday';
    divWeekday.style.cssText = `
        padding: 24px;
    `;
    
    const divTable = document.createElement('div');
    divTable.id = 'sales-table';
    divTable.style.cssText = `
        padding: 24px;
    `;

    analysisContainer.appendChild(divYear);
    analysisContainer.appendChild(divMonth);
    analysisContainer.appendChild(divWeekday);
    analysisContainer.appendChild(divTable);
    mainContent.appendChild(analysisContainer);

    // Chart.js用のグラフエリア
    let chartArea = document.getElementById('chart-area');
    if (!chartArea) {
        chartArea = document.createElement('div');
        chartArea.id = 'chart-area';
        chartArea.style.cssText = `
            margin-top: 24px;
            display: flex;
            justify-content: center;
        `;
        
        // データソース選択カード
        const dataSourceCard = document.createElement('div');
        dataSourceCard.style.cssText = `
            background: white;
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 24px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(14, 165, 233, 0.1);
        `;
        
        dataSourceCard.innerHTML = `
            <div style="
                display: flex;
                align-items: center;
                margin-bottom: 20px;
            ">
                <div style="
                    width: 48px;
                    height: 48px;
                    background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    color: white;
                    margin-right: 16px;
                ">💾</div>
                <div>
                    <h3 style="
                        margin: 0;
                        font-size: 18px;
                        font-weight: 600;
                        color: #1e293b;
                    ">データソース選択</h3>
                    <p style="
                        margin: 4px 0 0 0;
                        font-size: 14px;
                        color: #64748b;
                    ">分析に使用するデータを選択してください</p>
                </div>
            </div>
            
            <div style="
                display: grid;
                grid-template-columns: 1fr;
                gap: 16px;
                margin-bottom: 16px;
            ">
                <button id="real-data-btn" style="
                    background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
                    color: white;
                    border: none;
                    padding: 14px 20px;
                    border-radius: 10px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                "
                onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 8px 20px rgba(14, 165, 233, 0.3)'"
                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                    💼 売上データを読み込み
                </button>
            </div>
            
            <div id="data-info" style="
                padding: 16px;
                background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
                border-radius: 8px;
                border: 1px solid #bae6fd;
                font-size: 14px;
                color: #0369a1;
                font-weight: 500;
                text-align: center;
            ">データを選択してください</div>
        `;
        
        mainContent.appendChild(dataSourceCard);
        mainContent.appendChild(chartArea);
        
        // データソースボタンのイベントリスナーを追加
        setTimeout(() => {
            const realBtn = document.getElementById('real-data-btn');
            
            if (realBtn) {
                realBtn.onclick = () => {
                    console.log('💼 実データ選択');
                    loadData('real');
                };
            }
        }, 100);
        
        // デフォルトで実データを読み込み
        loadData('real');
    }
    
    // メインコンテンツをrootに追加
    root.appendChild(mainContent);
    
    // ログアウト関数をグローバルに定義
    window.logout = function() {
        console.log('🚪 ログアウト実行中...');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('username');
        localStorage.removeItem('githubPagesAuth');
        localStorage.removeItem('githubPagesUser');
        
        // ログイン画面に戻る
        if (IS_GITHUB_PAGES) {
            showGitHubPagesLogin();
        } else {
            showLoginMessage();
        }
    };

    // データ取得関数
    function loadData(dataType = 'real') {
        // GitHub Pages環境では静的ファイルを直接読み込み
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
                
                // プルダウンの選択肢をセット（エラーハンドリング追加）
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

                // 初期表示は月分析
                showMonthAnalysis();
                
                // 月選択divを表示
                const monthSelectDiv = document.getElementById('month-select-div');
                if (monthSelectDiv) {
                    monthSelectDiv.style.display = 'block';
                }
            })
        .catch(error => {
            console.error('データ読み込みエラー:', error);
            const errorMsg = document.createElement('div');
            errorMsg.style.cssText = 'text-align: center; padding: 50px; color: #ff4757; background: #ffecec; margin: 20px; border-radius: 10px; border: 1px solid #ff4757;';
            errorMsg.innerHTML = `
                <h3>⚠️ データ読み込みエラー</h3>
                <p>sales.csvファイルの読み込みに失敗しました。</p>
                <p>ファイルが存在することを確認してください。</p>
                <button onclick="window.location.reload()" style="background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                    再読み込み
                </button>
            `;
            root.appendChild(errorMsg);
        });
};

function showMonthAnalysis() {
    console.log('📊 月分析表示開始');
    console.log('🔍 globalData:', globalData ? globalData.length + '件' : 'undefined');
    
    document.getElementById('analysis-year').style.display = 'none';
    document.getElementById('analysis-month').style.display = '';
    document.getElementById('analysis-weekday').style.display = 'none';
    document.getElementById('sales-table').style.display = 'none';
    
    // データが存在しない場合は警告
    if (!globalData || globalData.length === 0) {
        const analysisMonth = document.getElementById('analysis-month');
        if (analysisMonth) {
            analysisMonth.innerHTML = `
                <div style="
                    text-align: center;
                    padding: 40px;
                    color: #f59e0b;
                    background: #fef3c7;
                    border-radius: 12px;
                    border: 1px solid #fbbf24;
                ">
                    <h3>⚠️ データが読み込まれていません</h3>
                    <p>データソース選択ボタンをクリックしてデータを読み込んでください。</p>
                </div>
            `;
        }
        return;
    }
    
    // プルダウンで選択された月のみ抽出
    const monthSelect = document.getElementById('month-select');
    let filtered = globalData;
    let selectedMonth = '';
    if (monthSelect && monthSelect.value) {
        selectedMonth = monthSelect.value;
        filtered = globalData.filter(row => row && row['日付'] && row['日付'].slice(0,7) === selectedMonth);
        console.log('📅 選択された月:', selectedMonth, 'フィルター後:', filtered.length + '件');
    } else {
        console.log('📅 月選択なし、全データ表示:', filtered.length + '件');
    }
    
    renderMonthAnalysis(filtered, selectedMonth);
    renderMonthPersonAnalysis(filtered, selectedMonth);
}

function showYearAnalysis() {
    document.getElementById('analysis-year').style.display = '';
    document.getElementById('analysis-month').style.display = 'none';
    document.getElementById('analysis-weekday').style.display = 'none';
    document.getElementById('sales-table').style.display = 'none';
    document.getElementById('month-select-div').style.display = 'none';
    renderYearAnalysis(globalData);
}

// 年ごとの売上・客数・組数・支払い者別合計金額（上位10名・不明除外）
function renderYearAnalysis(data) {
    const weekdays = ['日','月','火','水','木','金','土'];
    const yearStats = {};
    const yearGroups = {};
    const yearPersonStats = {};
    const yearMonthStats = {};
    const yearWeekdayStats = {};
    data.forEach(row => {
        if (!row || !row['日付']) return; // null/undefined チェック
        const year = row['日付'].slice(0,4); // YYYY
        const month = row['日付'].slice(0,7); // YYYY/MM
        const date = row['日付'];
        const d = new Date(date.replace(/\//g,'-'));
        const wd = weekdays[d.getDay()];
        const sales = Number(row['売り上げ']) || 0;
        const customers = Number(row['客数']) || 0;
        const person = row['支払い者'];
        if (!yearStats[year]) yearStats[year] = { sales: 0, customers: 0 };
        yearStats[year].sales += sales;
        yearStats[year].customers += customers;
        // 組数
        if (!yearGroups[year]) yearGroups[year] = {};
        if (!yearGroups[year][date]) yearGroups[year][date] = {};
        yearGroups[year][date][person] = true;
        // 支払い者別合計金額（不明除外）
        if (person !== '不明') {
            if (!yearPersonStats[year]) yearPersonStats[year] = {};
            if (!yearPersonStats[year][person]) yearPersonStats[year][person] = 0;
            yearPersonStats[year][person] += sales;
        }
        // 月ごとの合計
        if (!yearMonthStats[year]) yearMonthStats[year] = {};
        if (!yearMonthStats[year][month]) yearMonthStats[year][month] = { sales: 0, customers: 0 };
        yearMonthStats[year][month].sales += sales;
        yearMonthStats[year][month].customers += customers;
        // 曜日ごとの合計
        if (!yearWeekdayStats[year]) yearWeekdayStats[year] = {};
        if (!yearWeekdayStats[year][wd]) yearWeekdayStats[year][wd] = { sales: 0, customers: 0 };
        yearWeekdayStats[year][wd].sales += sales;
        yearWeekdayStats[year][wd].customers += customers;
    });
    
    // スタイリッシュなテーブル作成
    let html = `
        <div style="margin-bottom: 24px;">
            <h2 style="
                color: #1e293b;
                font-size: 20px;
                font-weight: 600;
                margin: 0 0 16px 0;
                display: flex;
                align-items: center;
            ">
                <span style="
                    font-size: 20px;
                    margin-right: 8px;
                ">📈</span>
                年別売上・客数・組数
            </h2>
            
            <div style="
                overflow-x: auto;
                border-radius: 12px;
                border: 1px solid #e2e8f0;
                background: white;
            ">
                <table style="
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 14px;
                ">
                    <thead>
                        <tr style="background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);">
                            <th style="
                                padding: 16px;
                                text-align: left;
                                color: white;
                                font-weight: 600;
                                border: none;
                                font-size: 13px;
                                text-transform: uppercase;
                                letter-spacing: 0.05em;
                            ">年</th>
                            <th style="
                                padding: 16px;
                                text-align: right;
                                color: white;
                                font-weight: 600;
                                border: none;
                                font-size: 13px;
                                text-transform: uppercase;
                                letter-spacing: 0.05em;
                            ">売上合計</th>
                            <th style="
                                padding: 16px;
                                text-align: right;
                                color: white;
                                font-weight: 600;
                                border: none;
                                font-size: 13px;
                                text-transform: uppercase;
                                letter-spacing: 0.05em;
                            ">客数合計</th>
                            <th style="
                                padding: 16px;
                                text-align: right;
                                color: white;
                                font-weight: 600;
                                border: none;
                                font-size: 13px;
                                text-transform: uppercase;
                                letter-spacing: 0.05em;
                            ">組数</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    Object.keys(yearStats).sort().forEach((year, index) => {
        // 組数計算
        let groupCount = 0;
        if (yearGroups[year]) {
            Object.values(yearGroups[year]).forEach(dateGroup => {
                groupCount += Object.keys(dateGroup).length;
            });
        }
        
        const bgColor = index % 2 === 0 ? '#f8fafc' : 'white';
        html += `
            <tr style="
                background: ${bgColor};
                transition: background-color 0.2s ease;
            "
            onmouseover="this.style.background='#f0f9ff'"
            onmouseout="this.style.background='${bgColor}'">
                <td style="
                    padding: 16px;
                    border: none;
                    color: #1e293b;
                    font-weight: 600;
                ">${year}</td>
                <td style="
                    padding: 16px;
                    border: none;
                    color: #1e293b;
                    text-align: right;
                    font-weight: 500;
                ">¥${yearStats[year].sales.toLocaleString()}</td>
                <td style="
                    padding: 16px;
                    border: none;
                    color: #1e293b;
                    text-align: right;
                    font-weight: 500;
                ">${yearStats[year].customers}名</td>
                <td style="
                    padding: 16px;
                    border: none;
                    color: #1e293b;
                    text-align: right;
                    font-weight: 500;
                ">${groupCount}組</td>
            </tr>
        `;
    });
    
    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;

    // 月ごとの合計（折れ線グラフ）
    html += `
        <div style="margin-bottom: 24px;">
            <h2 style="
                color: #1e293b;
                font-size: 20px;
                font-weight: 600;
                margin: 0 0 16px 0;
                display: flex;
                align-items: center;
            ">
                <span style="
                    font-size: 20px;
                    margin-right: 8px;
                ">📊</span>
                月ごとの合計
            </h2>
        </div>
    `;
    Object.keys(yearMonthStats).sort().forEach(year => {
        html += `
            <div style="
                background: white;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 20px;
                border: 1px solid #e2e8f0;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            ">
                <h3 style="
                    color: #1e293b;
                    font-size: 18px;
                    font-weight: 600;
                    margin: 0 0 16px 0;
                    display: flex;
                    align-items: center;
                ">
                    <span style="
                        font-size: 18px;
                        margin-right: 8px;
                    ">📅</span>
                    ${year}年
                </h3>
                
                <div style="
                    margin-bottom: 16px;
                    padding: 16px;
                    background: #f8fafc;
                    border-radius: 8px;
                ">
                    <canvas id="lineChart-year-${year}" width="500" height="220"></canvas>
                </div>
                
                <div style="
                    overflow-x: auto;
                    border-radius: 8px;
                    border: 1px solid #e2e8f0;
                ">
                    <table id="table-year-month-${year}" style="
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 14px;
                    ">
                        <thead>
                            <tr style="background: linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%);">
                                <th style="
                                    padding: 12px 16px;
                                    text-align: left;
                                    color: white;
                                    font-weight: 600;
                                    border: none;
                                    font-size: 13px;
                                    text-transform: uppercase;
                                    letter-spacing: 0.05em;
                                ">月</th>
                                <th style="
                                    padding: 12px 16px;
                                    text-align: right;
                                    color: white;
                                    font-weight: 600;
                                    border: none;
                                    font-size: 13px;
                                    text-transform: uppercase;
                                    letter-spacing: 0.05em;
                                ">売上合計</th>
                                <th style="
                                    padding: 12px 16px;
                                    text-align: right;
                                    color: white;
                                    font-weight: 600;
                                    border: none;
                                    font-size: 13px;
                                    text-transform: uppercase;
                                    letter-spacing: 0.05em;
                                ">客数合計</th>
                            </tr>
                        </thead>
                        <tbody>
        `;
        
        const months = Object.keys(yearMonthStats[year]).sort();
        months.forEach((month, index) => {
            const bgColor = index % 2 === 0 ? '#f8fafc' : 'white';
            html += `
                <tr style="
                    background: ${bgColor};
                    transition: background-color 0.2s ease;
                "
                onmouseover="this.style.background='#f0f9ff'"
                onmouseout="this.style.background='${bgColor}'">
                    <td style="
                        padding: 12px 16px;
                        border: none;
                        color: #1e293b;
                        font-weight: 500;
                    ">${month}</td>
                    <td style="
                        padding: 12px 16px;
                        border: none;
                        color: #1e293b;
                        text-align: right;
                        font-weight: 500;
                    ">¥${yearMonthStats[year][month].sales.toLocaleString()}</td>
                    <td style="
                        padding: 12px 16px;
                        border: none;
                        color: #1e293b;
                        text-align: right;
                        font-weight: 500;
                    ">${yearMonthStats[year][month].customers}名</td>
                </tr>
            `;
        });
        
        html += `
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        setTimeout(() => {
            const table = document.getElementById(`table-year-month-${year}`);
            if (!table) return;
            const rows = Array.from(table.querySelectorAll('tr')).slice(1);
            const labels = [], salesArr = [], customersArr = [];
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 3) {
                    labels.push(cells[0].textContent);
                    salesArr.push(Number(cells[1].textContent.replace(/,/g, '')));
                    customersArr.push(Number(cells[2].textContent.replace(/,/g, '')));
                }
            });
            const ctx = document.getElementById(`lineChart-year-${year}`)?.getContext('2d');
            if (ctx) {
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: '売上',
                                data: salesArr,
                                borderColor: '#4e79a7',
                                backgroundColor: 'rgba(78,121,167,0.1)',
                                fill: false,
                                tension: 0.2,
                                yAxisID: 'y'
                            },
                            {
                                label: '客数',
                                data: customersArr,
                                borderColor: '#f28e2b',
                                backgroundColor: 'rgba(242,142,43,0.1)',
                                fill: false,
                                tension: 0.2,
                                yAxisID: 'y1'
                            }
                        ]
                    },
                    options: {
                        responsive: false,
                        plugins: {
                            legend: { position: 'top' },
                            title: { display: false }
                        },
                        scales: {
                            y: { 
                                beginAtZero: true,
                                type: 'linear',
                                display: true,
                                position: 'left'
                            },
                            y1: {
                                beginAtZero: true,
                                type: 'linear',
                                display: true,
                                position: 'right',
                                grid: {
                                    drawOnChartArea: false
                                }
                            }
                        }
                    }
                });
            }
        }, 100);
    });

    // 年ごとの支払い者別合計金額は表示しない

    // 曜日ごとの合計（棒グラフ）
    html += '<h2>曜日ごとの合計</h2>';
    Object.keys(yearWeekdayStats).sort().forEach(year => {
        html += `<h3>${year}</h3><canvas id="barChart-year-${year}" width="500" height="220"></canvas>`;
        html += `<table id="table-year-weekday-${year}" border="1"><tr><th>曜日</th><th>売上合計</th><th>客数合計</th></tr>`;
        weekdays.forEach(wd => {
            if (yearWeekdayStats[year][wd]) {
                html += `<tr><td>${wd}</td><td>${yearWeekdayStats[year][wd].sales.toLocaleString()}</td><td>${yearWeekdayStats[year][wd].customers}</td></tr>`;
            }
        });
        html += '</table>';
        setTimeout(() => {
            const table = document.getElementById(`table-year-weekday-${year}`);
            if (!table) return;
            const rows = Array.from(table.querySelectorAll('tr')).slice(1);
            const labels = [], salesArr = [], customersArr = [];
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 3) {
                    labels.push(cells[0].textContent);
                    salesArr.push(Number(cells[1].textContent.replace(/,/g, '')));
                    customersArr.push(Number(cells[2].textContent.replace(/,/g, '')));
                }
            });
            const ctx = document.getElementById(`barChart-year-${year}`)?.getContext('2d');
            if (ctx) {
                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: '売上',
                                data: salesArr,
                                backgroundColor: 'rgba(78,121,167,0.7)',
                                borderColor: '#4e79a7',
                                borderWidth: 1,
                                yAxisID: 'y'
                            },
                            {
                                label: '客数',
                                data: customersArr,
                                backgroundColor: 'rgba(242,142,43,0.7)',
                                borderColor: '#f28e2b',
                                borderWidth: 1,
                                yAxisID: 'y1'
                            }
                        ]
                    },
                    options: {
                        responsive: false,
                        plugins: {
                            legend: { position: 'top' },
                            title: { display: false }
                        },
                        scales: {
                            y: { 
                                beginAtZero: true,
                                type: 'linear',
                                display: true,
                                position: 'left'
                            },
                            y1: {
                                beginAtZero: true,
                                type: 'linear',
                                display: true,
                                position: 'right',
                                grid: {
                                    drawOnChartArea: false
                                }
                            }
                        }
                    }
                });
            }
        }, 100);
    });

    document.getElementById('analysis-year').innerHTML = html;
}

// CSVテキストを配列に変換
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

// 月ごとに支払い者ごとの合計金額を集計・表示
function renderMonthPersonAnalysis(data) {
    const monthPersonStats = {};
    data.forEach(row => {
        if (!row || !row['日付']) return; // null/undefined チェック
        const month = row['日付'].slice(0,7); // YYYY/MM
        const person = row['支払い者'];
        if (person === '不明') return; // 除外
        const sales = Number(row['売り上げ']) || 0;
        if (!monthPersonStats[month]) monthPersonStats[month] = {};
        if (!monthPersonStats[month][person]) monthPersonStats[month][person] = 0;
        monthPersonStats[month][person] += sales;
    });
    let html = '<h2>月ごとの支払い者別合計金額（上位10名・不明除外）</h2>';
    Object.keys(monthPersonStats).sort().forEach(month => {
        html += `<h3>${month}</h3><table border="1"><tr><th>支払い者</th><th>合計金額</th></tr>`;
        // 金額順に並べて上位10名のみ
        const sortedPersons = Object.entries(monthPersonStats[month])
            .sort((a,b)=>b[1]-a[1])
            .slice(0,10);
        sortedPersons.forEach(([person, total]) => {
            html += `<tr><td>${person}</td><td>${total.toLocaleString()}</td></tr>`;
        });
        html += '</table>';
    });
    // 分析結果を表示
    let target = document.getElementById('analysis-month-person');
    if (!target) {
        target = document.createElement('div');
        target.id = 'analysis-month-person';
        // #app-root内のanalysis-monthの次に挿入
        const root = document.getElementById('app-root');
        const monthDiv = document.getElementById('analysis-month');
        if (monthDiv && monthDiv.nextSibling) {
            root.insertBefore(target, monthDiv.nextSibling);
        } else {
            root.appendChild(target);
        }
    }
    target.innerHTML = html;
}
// 売上データをテーブル表示
function renderTable(data) {
    if (!data || data.length === 0) {
        document.getElementById('sales-table').innerHTML = '<p>データがありません</p>';
        return;
    }
    let html = '<table border="1"><tr>';
    // ヘッダー
    Object.keys(data[0]).forEach(key => {
        html += `<th>${key}</th>`;
    });
    html += '</tr>';
    // データ
    data.forEach(row => {
        html += '<tr>';
        Object.values(row).forEach(val => {
            html += `<td>${val}</td>`;
        });
        html += '</tr>';
    });
    html += '</table>';
    document.getElementById('sales-table').innerHTML = html;
}



// 月別売上・客数分析
function renderMonthAnalysis(data, selectedMonth) {
    console.log('📊 renderMonthAnalysis開始:', data ? data.length + '件' : 'データなし');
    
    const weekdays = ['日','月','火','水','木','金','土'];
    
    // データが存在しない場合の処理
    if (!data || data.length === 0) {
        console.log('⚠️ 表示するデータがありません');
        const analysisMonth = document.getElementById('analysis-month');
        if (analysisMonth) {
            analysisMonth.innerHTML = `
                <div style="
                    text-align: center;
                    padding: 40px;
                    color: #6b7280;
                    background: #f9fafb;
                    border-radius: 12px;
                    border: 1px solid #e5e7eb;
                ">
                    <div style="font-size: 48px; margin-bottom: 16px;">📊</div>
                    <h3 style="color: #374151; margin: 0 0 8px 0;">データがありません</h3>
                    <p style="margin: 0; font-size: 14px;">
                        ${selectedMonth ? `${selectedMonth}のデータが見つかりません` : 'データを読み込んでください'}
                    </p>
                </div>
            `;
        }
        return;
    }
    
    // 1ヶ月分の合計集計
    let totalSales = 0, totalCustomers = 0, totalGroupCount = 0;
    const groupSet = {};
    
    // 曜日別集計
    const weekdayStats = {};
    const weekdayGroups = {};
    
    data.forEach(row => {
        const date = row['日付'];
        const d = new Date(date.replace(/\//g,'-'));
        const wd = weekdays[d.getDay()];
        const sales = Number(row['売り上げ']) || 0;
        const customers = Number(row['客数']) || 0;
        const person = row['支払い者'];
        
        // 合計集計
        totalSales += sales;
        totalCustomers += customers;
        if (!groupSet[date]) groupSet[date] = {};
        groupSet[date][person] = true;
        
        // 曜日別集計
        if (!weekdayStats[wd]) weekdayStats[wd] = { sales: 0, customers: 0 };
        weekdayStats[wd].sales += sales;
        weekdayStats[wd].customers += customers;
        
        if (!weekdayGroups[wd]) weekdayGroups[wd] = {};
        if (!weekdayGroups[wd][date]) weekdayGroups[wd][date] = {};
        weekdayGroups[wd][date][person] = true;
    });
    
    // 合計組数計算
    Object.values(groupSet).forEach(dateGroup => {
        totalGroupCount += Object.keys(dateGroup).length;
    });
    
    // HTML構築
    let html = `<h2>${selectedMonth}の分析</h2>`;
    
    // 合計値をテキストで表示
    html += `<div style="background-color: #f5f5f5; padding: 20px; margin-bottom: 20px; border-radius: 8px;">`;
    html += `<h3>月間合計</h3>`;
    html += `<p style="font-size: 18px; margin: 10px 0;"><strong>合計売上:</strong> ${totalSales.toLocaleString()}円</p>`;
    html += `<p style="font-size: 18px; margin: 10px 0;"><strong>合計客数:</strong> ${totalCustomers}人</p>`;
    html += `<p style="font-size: 18px; margin: 10px 0;"><strong>合計組数:</strong> ${totalGroupCount}組</p>`;
    html += `</div>`;
    
    // 曜日別グラフ
    html += `<h3>曜日別分析</h3>`;
    html += `<canvas id="monthWeekdayChart-${selectedMonth}" width="600" height="400"></canvas>`;
    
    // 曜日別テーブル
    html += '<table border="1" style="margin-top: 15px;"><tr><th>曜日</th><th>売上</th><th>客数</th><th>組数</th></tr>';
    const chartData = [];
    weekdays.forEach(wd => {
        if (weekdayStats[wd]) {
            let groupCount = 0;
            if (weekdayGroups[wd]) {
                Object.values(weekdayGroups[wd]).forEach(dateGroup => {
                    groupCount += Object.keys(dateGroup).length;
                });
            }
            html += `<tr><td>${wd}</td><td>${weekdayStats[wd].sales.toLocaleString()}円</td><td>${weekdayStats[wd].customers}人</td><td>${groupCount}組</td></tr>`;
            chartData.push({
                weekday: wd,
                sales: weekdayStats[wd].sales,
                customers: weekdayStats[wd].customers,
                groups: groupCount
            });
        }
    });
    html += '</table>';
    
    document.getElementById('analysis-month').innerHTML = html;
    
    // 曜日別グラフ描画
    setTimeout(() => {
        const ctx = document.getElementById(`monthWeekdayChart-${selectedMonth}`)?.getContext('2d');
        if (ctx && chartData.length > 0) {
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: chartData.map(d => d.weekday + '曜日'),
                    datasets: [
                        {
                            label: '売上',
                            data: chartData.map(d => d.sales),
                            backgroundColor: 'rgba(78,121,167,0.7)',
                            borderColor: '#4e79a7',
                            borderWidth: 1,
                            yAxisID: 'y'
                        },
                        {
                            label: '客数',
                            data: chartData.map(d => d.customers),
                            backgroundColor: 'rgba(242,142,43,0.7)',
                            borderColor: '#f28e2b',
                            borderWidth: 1,
                            yAxisID: 'y1'
                        },
                        {
                            label: '組数',
                            data: chartData.map(d => d.groups),
                            backgroundColor: 'rgba(88,195,76,0.7)',
                            borderColor: '#58c34c',
                            borderWidth: 1,
                            yAxisID: 'y1'
                        }
                    ]
                },
                options: {
                    responsive: false,
                    plugins: {
                        legend: { position: 'top' },
                        title: { display: true, text: `${selectedMonth}の曜日別実績` }
                    },
                    scales: {
                        y: { 
                            beginAtZero: true,
                            position: 'left',
                            title: { display: true, text: '売上（円）' }
                        },
                        y1: {
                            beginAtZero: true,
                            position: 'right',
                            title: { display: true, text: '客数・組数' },
                            grid: { drawOnChartArea: false }
                        }
                    }
                }
            });
        }
    }, 100);
}

// 月ごとの分析専用の曜日別分析
function renderMonthWeekdayAnalysis(data, selectedMonth) {
    const weekdays = ['日','月','火','水','木','金','土'];
    // 曜日ごとに集計
    const weekdayStats = {};
    const weekdayGroups = {};
    const weekdayPersons = {};
    
    data.forEach(row => {
        const date = row['日付'];
        const d = new Date(date.replace(/\//g,'-'));
        const wd = weekdays[d.getDay()];
        const sales = Number(row['売り上げ']) || 0;
        const customers = Number(row['客数']) || 0;
        const person = row['支払い者'];
        
        if (!weekdayStats[wd]) weekdayStats[wd] = { sales: 0, customers: 0, count: 0 };
        weekdayStats[wd].sales += sales;
        weekdayStats[wd].customers += customers;
        weekdayStats[wd].count += 1;
        
        // 組数
        if (!weekdayGroups[wd]) weekdayGroups[wd] = {};
        if (!weekdayGroups[wd][date]) weekdayGroups[wd][date] = {};
        weekdayGroups[wd][date][person] = true;
        
        // 支払い者別（不明除外）
        if (person !== '不明') {
            if (!weekdayPersons[wd]) weekdayPersons[wd] = {};
            if (!weekdayPersons[wd][person]) weekdayPersons[wd][person] = 0;
            weekdayPersons[wd][person] += sales;
        }
    });
    
    let html = `<h2>${selectedMonth}の曜日別分析</h2>`;
    html += `<canvas id="monthWeekdayChart-${selectedMonth}" width="600" height="400"></canvas>`;
    html += '<table border="1" style="margin-top: 15px;"><tr><th>曜日</th><th>売上合計</th><th>客数合計</th><th>組数</th><th>平均売上</th><th>回数</th></tr>';
    
    const chartData = [];
    weekdays.forEach(wd => {
        if (weekdayStats[wd]) {
            let groupCount = 0;
            if (weekdayGroups[wd]) {
                Object.values(weekdayGroups[wd]).forEach(dateGroup => {
                    groupCount += Object.keys(dateGroup).length;
                });
            }
            const avgSales = Math.round(weekdayStats[wd].sales / weekdayStats[wd].count);
            html += `<tr><td>${wd}</td><td>${weekdayStats[wd].sales.toLocaleString()}</td><td>${weekdayStats[wd].customers}</td><td>${groupCount}</td><td>${avgSales.toLocaleString()}</td><td>${weekdayStats[wd].count}</td></tr>`;
            chartData.push({
                weekday: wd,
                sales: weekdayStats[wd].sales,
                customers: weekdayStats[wd].customers,
                groups: groupCount
            });
        }
    });
    html += '</table>';
    
    // 支払い者別上位分析
    html += `<h3>${selectedMonth}の曜日別主要顧客</h3>`;
    weekdays.forEach(wd => {
        if (weekdayPersons[wd]) {
            const topPersons = Object.entries(weekdayPersons[wd])
                .sort((a,b) => b[1] - a[1])
                .slice(0, 3);
            if (topPersons.length > 0) {
                html += `<h4>${wd}曜日の上位3名</h4>`;
                html += `<table border="1"><tr><th>順位</th><th>支払い者</th><th>合計金額</th></tr>`;
                topPersons.forEach(([person, total], idx) => {
                    html += `<tr><td>${idx+1}</td><td>${person}</td><td>${total.toLocaleString()}円</td></tr>`;
                });
                html += '</table>';
            }
        }
    });
    
    // 分析結果を表示
    let target = document.getElementById('analysis-month-weekday');
    if (!target) {
        target = document.createElement('div');
        target.id = 'analysis-month-weekday';
        // #app-root内のanalysis-monthの次に挿入
        const root = document.getElementById('app-root');
        const monthDiv = document.getElementById('analysis-month');
        if (monthDiv && monthDiv.nextSibling) {
            root.insertBefore(target, monthDiv.nextSibling);
        } else {
            root.appendChild(target);
        }
    }
    target.innerHTML = html;
    
    // グラフ描画
    setTimeout(() => {
        const ctx = document.getElementById(`monthWeekdayChart-${selectedMonth}`)?.getContext('2d');
        if (ctx && chartData.length > 0) {
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: chartData.map(d => d.weekday),
                    datasets: [
                        {
                            label: '売上',
                            data: chartData.map(d => d.sales),
                            backgroundColor: 'rgba(78,121,167,0.7)',
                            borderColor: '#4e79a7',
                            borderWidth: 1,
                            yAxisID: 'y'
                        },
                        {
                            label: '客数',
                            data: chartData.map(d => d.customers),
                            backgroundColor: 'rgba(242,142,43,0.7)',
                            borderColor: '#f28e2b',
                            borderWidth: 1,
                            yAxisID: 'y1'
                        },
                        {
                            label: '組数',
                            data: chartData.map(d => d.groups),
                            backgroundColor: 'rgba(88,195,76,0.7)',
                            borderColor: '#58c34c',
                            borderWidth: 1,
                            yAxisID: 'y1'
                        }
                    ]
                },
                options: {
                    responsive: false,
                    plugins: {
                        legend: { position: 'top' },
                        title: { display: true, text: `${selectedMonth}の曜日別実績` }
                    },
                    scales: {
                        y: { 
                            beginAtZero: true,
                            position: 'left',
                            title: { display: true, text: '売上（円）' }
                        },
                        y1: {
                            beginAtZero: true,
                            position: 'right',
                            title: { display: true, text: '客数・組数' },
                            grid: { drawOnChartArea: false }
                        }
                    }
                }
            });
        }
    }, 100);
}

// 曜日別売上・客数分析（年・月ごと）
function renderWeekdayAnalysis(data, selectedMonth) {
    const weekdays = ['日','月','火','水','木','金','土'];
    // 曜日ごとに詳細集計
    const weekdayStats = {};
    const weekdayGroups = {};
    const weekdayDetails = {}; // 日付別詳細
    const weekdayPersons = {}; // 支払い者別
    
    data.forEach(row => {
        const date = row['日付'];
        const d = new Date(date.replace(/\//g,'-'));
        const wd = weekdays[d.getDay()];
        const sales = Number(row['売り上げ']) || 0;
        const customers = Number(row['客数']) || 0;
        const person = row['支払い者'];
        
        // 基本統計
        if (!weekdayStats[wd]) weekdayStats[wd] = { sales: 0, customers: 0, count: 0 };
        weekdayStats[wd].sales += sales;
        weekdayStats[wd].customers += customers;
        weekdayStats[wd].count += 1;
        
        // 組数
        if (!weekdayGroups[wd]) weekdayGroups[wd] = {};
        if (!weekdayGroups[wd][date]) weekdayGroups[wd][date] = {};
        weekdayGroups[wd][date][person] = true;
        
        // 日付別詳細
        if (!weekdayDetails[wd]) weekdayDetails[wd] = {};
        if (!weekdayDetails[wd][date]) weekdayDetails[wd][date] = { sales: 0, customers: 0 };
        weekdayDetails[wd][date].sales += sales;
        weekdayDetails[wd][date].customers += customers;
        
        // 支払い者別（不明除外）
        if (person !== '不明') {
            if (!weekdayPersons[wd]) weekdayPersons[wd] = {};
            if (!weekdayPersons[wd][person]) weekdayPersons[wd][person] = 0;
            weekdayPersons[wd][person] += sales;
        }
    });
    
    let html = `<h2>${selectedMonth || ''}の曜日別詳細分析</h2>`;
    
    // 各曜日ごとに詳細分析を作成
    weekdays.forEach(wd => {
        if (weekdayStats[wd]) {
            let groupCount = 0;
            if (weekdayGroups[wd]) {
                Object.values(weekdayGroups[wd]).forEach(dateGroup => {
                    groupCount += Object.keys(dateGroup).length;
                });
            }
            
            // 平均値計算
            const avgSales = Math.round(weekdayStats[wd].sales / weekdayStats[wd].count);
            const avgCustomers = Math.round(weekdayStats[wd].customers / weekdayStats[wd].count);
            
            html += `<div style="margin-bottom: 30px; padding: 15px; border: 1px solid #ddd; border-radius: 8px;">`;
            html += `<h3>${wd}曜日の分析</h3>`;
            
            // 基本統計
            html += `<h4>基本統計</h4>`;
            html += `<table border="1" style="margin-bottom: 15px;"><tr><th>項目</th><th>合計</th><th>平均</th><th>回数</th></tr>`;
            html += `<tr><td>売上</td><td>${weekdayStats[wd].sales.toLocaleString()}円</td><td>${avgSales.toLocaleString()}円</td><td>${weekdayStats[wd].count}回</td></tr>`;
            html += `<tr><td>客数</td><td>${weekdayStats[wd].customers}人</td><td>${avgCustomers}人</td><td>-</td></tr>`;
            html += `<tr><td>組数</td><td>${groupCount}組</td><td>${Math.round(groupCount / weekdayStats[wd].count)}組</td><td>-</td></tr>`;
            html += '</table>';
            
            // グラフ1: 基本統計
            html += `<canvas id="weekdayChart-basic-${selectedMonth}-${wd}" width="400" height="300"></canvas>`;
            
            // 日付別推移
            if (weekdayDetails[wd]) {
                html += `<h4>日付別推移</h4>`;
                html += `<canvas id="weekdayChart-trend-${selectedMonth}-${wd}" width="500" height="300"></canvas>`;
                html += `<table border="1" style="margin-bottom: 15px;"><tr><th>日付</th><th>売上</th><th>客数</th></tr>`;
                Object.keys(weekdayDetails[wd]).sort().forEach(date => {
                    const detail = weekdayDetails[wd][date];
                    html += `<tr><td>${date}</td><td>${detail.sales.toLocaleString()}円</td><td>${detail.customers}人</td></tr>`;
                });
                html += '</table>';
            }
            
            // 支払い者別上位5名
            if (weekdayPersons[wd]) {
                const topPersons = Object.entries(weekdayPersons[wd])
                    .sort((a,b) => b[1] - a[1])
                    .slice(0, 5);
                if (topPersons.length > 0) {
                    html += `<h4>支払い者別上位5名</h4>`;
                    html += `<canvas id="weekdayChart-person-${selectedMonth}-${wd}" width="400" height="300"></canvas>`;
                    html += `<table border="1"><tr><th>順位</th><th>支払い者</th><th>合計金額</th></tr>`;
                    topPersons.forEach(([person, total], idx) => {
                        html += `<tr><td>${idx+1}</td><td>${person}</td><td>${total.toLocaleString()}円</td></tr>`;
                    });
                    html += '</table>';
                }
            }
            
            html += `</div>`;
        }
    });
    
    document.getElementById('analysis-weekday').innerHTML = html;
    
    // 各曜日ごとにグラフを描画
    setTimeout(() => {
        weekdays.forEach(wd => {
            if (weekdayStats[wd]) {
                let groupCount = 0;
                if (weekdayGroups[wd]) {
                    Object.values(weekdayGroups[wd]).forEach(dateGroup => {
                        groupCount += Object.keys(dateGroup).length;
                    });
                }
                
                // 基本統計グラフ
                const basicCtx = document.getElementById(`weekdayChart-basic-${selectedMonth}-${wd}`)?.getContext('2d');
                if (basicCtx) {
                    new Chart(basicCtx, {
                        type: 'bar',
                        data: {
                            labels: ['売上', '客数', '組数'],
                            datasets: [{
                                label: `${wd}曜日の実績`,
                                data: [weekdayStats[wd].sales, weekdayStats[wd].customers, groupCount],
                                backgroundColor: [
                                    'rgba(78,121,167,0.7)',
                                    'rgba(242,142,43,0.7)',
                                    'rgba(88,195,76,0.7)'
                                ],
                                borderColor: ['#4e79a7', '#f28e2b', '#58c34c'],
                                borderWidth: 2
                            }]
                        },
                        options: {
                            responsive: false,
                            plugins: {
                                legend: { display: false },
                                title: { display: true, text: `${wd}曜日の基本統計` }
                            },
                            scales: {
                                y: { beginAtZero: true }
                            }
                        }
                    });
                }
                
                // 日付別推移グラフ
                if (weekdayDetails[wd]) {
                    const trendCtx = document.getElementById(`weekdayChart-trend-${selectedMonth}-${wd}`)?.getContext('2d');
                    if (trendCtx) {
                        const dates = Object.keys(weekdayDetails[wd]).sort();
                        const salesData = dates.map(date => weekdayDetails[wd][date].sales);
                        const customersData = dates.map(date => weekdayDetails[wd][date].customers);
                        
                        new Chart(trendCtx, {
                            type: 'line',
                            data: {
                                labels: dates,
                                datasets: [
                                    {
                                        label: '売上',
                                        data: salesData,
                                        borderColor: '#4e79a7',
                                        backgroundColor: 'rgba(78,121,167,0.2)',
                                        tension: 0.1,
                                        yAxisID: 'y'
                                    },
                                    {
                                        label: '客数',
                                        data: customersData,
                                        borderColor: '#f28e2b',
                                        backgroundColor: 'rgba(242,142,43,0.2)',
                                        tension: 0.1,
                                        yAxisID: 'y1'
                                    }
                                ]
                            },
                            options: {
                                responsive: false,
                                plugins: {
                                    title: { display: true, text: `${wd}曜日の日付別推移` }
                                },
                                scales: {
                                    y: { 
                                        beginAtZero: true,
                                        position: 'left',
                                        title: { display: true, text: '売上（円）' }
                                    },
                                    y1: {
                                        beginAtZero: true,
                                        position: 'right',
                                        title: { display: true, text: '客数（人）' },
                                        grid: { drawOnChartArea: false }
                                    }
                                }
                            }
                        });
                    }
                }
                
                // 支払い者別グラフ
                if (weekdayPersons[wd]) {
                    const topPersons = Object.entries(weekdayPersons[wd])
                        .sort((a,b) => b[1] - a[1])
                        .slice(0, 5);
                    if (topPersons.length > 0) {
                        const personCtx = document.getElementById(`weekdayChart-person-${selectedMonth}-${wd}`)?.getContext('2d');
                        if (personCtx) {
                            new Chart(personCtx, {
                                type: 'doughnut',
                                data: {
                                    labels: topPersons.map(([person, _]) => person),
                                    datasets: [{
                                        data: topPersons.map(([_, total]) => total),
                                        backgroundColor: [
                                            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
                                        ],
                                        borderWidth: 2
                                    }]
                                },
                                options: {
                                    responsive: false,
                                    plugins: {
                                        title: { display: true, text: `${wd}曜日の支払い者別構成` },
                                        legend: { position: 'right' }
                                    }
                                }
                            });
                        }
                    }
                }
            }
        });
    }, 100);
}

// 円グラフ・折れ線グラフの初期化はデータ取得後に必要に応じて行う

function drawMonthlyChart() {
    // GitHub Pages環境では静的CSVファイルを読み込み
    const url = IS_GITHUB_PAGES 
        ? './sales.csv'
        : `${API_BASE_URL}/sales.csv?ts=` + new Date().getTime();
    
    (IS_GITHUB_PAGES ? fetch(url) : authenticatedFetch(url))
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                return response.text();
            })
            .then(csv => {
                const lines = csv.trim().split('\n');
                const header = lines[0].split(',');
                const monthMap = {};
                for (let i = 1; i < lines.length; i++) {
                    const cols = lines[i].split(',');
                    const date = cols[0];
                    const customer = parseInt(cols[2], 10) || 0;
                    const sales = parseInt(cols[3], 10) || 0;
                    const month = date.split('/')[1];
                    if (!monthMap[month]) monthMap[month] = { sales: 0, customers: 0, groups: 0 };
                    monthMap[month].sales += sales;
                    monthMap[month].customers += customer;
                    monthMap[month].groups += 1;
                }
                const months = Object.keys(monthMap).sort((a,b)=>a-b).map(m => m+'月');
                const salesArr = Object.values(monthMap).map(m => m.sales);
                const customersArr = Object.values(monthMap).map(m => m.customers);
                const groupsArr = Object.values(monthMap).map(m => m.groups);

                // Chart.js描画（小さめサイズ、下部に表示）
                let chartArea = document.getElementById('chart-area');
                if (!chartArea) {
                    // #app-root内にchart-areaがなければ作成
                    const root = document.getElementById('app-root');
                    chartArea = document.createElement('div');
                    chartArea.id = 'chart-area';
                    chartArea.style.marginTop = '40px';
                    chartArea.style.display = 'flex';
                    chartArea.style.justifyContent = 'center';
                    root.appendChild(chartArea);
                }
                chartArea.innerHTML = '<canvas id="multiLineChart" width="350" height="180"></canvas>';
                const ctx = document.getElementById('multiLineChart').getContext('2d');
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: months,
                        datasets: [
                            {
                                label: '売上',
                                data: salesArr,
                                borderColor: '#4e79a7',
                                backgroundColor: 'rgba(78,121,167,0.1)',
                                fill: false,
                                tension: 0.2
                            },
                            {
                                label: '客数',
                                data: customersArr,
                                borderColor: '#f28e2b',
                                backgroundColor: 'rgba(242,142,43,0.1)',
                                fill: false,
                                tension: 0.2
                            },
                            {
                                label: '組数',
                                data: groupsArr,
                                borderColor: '#e15759',
                                backgroundColor: 'rgba(225,87,89,0.1)',
                                fill: false,
                                tension: 0.2
                            }
                        ]
                    },
                    options: {
                        responsive: false,
                        plugins: {
                            legend: { position: 'top' },
                            title: { display: true, text: '月別売上・客数・組数' }
                        },
                        scales: {
                            y: { beginAtZero: true }
                        }
                    }
                });

            // 月別売上推移グラフ
            const monthlySales = Object.values(monthStats).map(stat => stat.sales);
            const monthlyLabels = Object.keys(monthStats).map(month => month.slice(5)); // MM
            const lineCtx = document.getElementById('lineChart').getContext('2d');
            if (window.lineChart) {
                window.lineChart.destroy();
            }
            window.lineChart = new Chart(lineCtx, {
                type: 'line',
                data: {
                    labels: monthlyLabels,
                    datasets: [{
                        label: '売上',
                        data: monthlySales,
                        borderColor: '#4e79a7',
                        backgroundColor: 'rgba(78,121,167,0.1)',
                        fill: true
                    }]
                }
            });
        });
}

// データソース選択ボタンのイベントリスナー
document.addEventListener('DOMContentLoaded', function() {
    const demoBtn = document.getElementById('demo-data-btn');
    const realBtn = document.getElementById('real-data-btn');
    
    if (demoBtn) {
        demoBtn.addEventListener('click', () => {
            console.log('🎬 デモデータを選択');
            loadData('demo');
        });
    }
    
    if (realBtn) {
        realBtn.addEventListener('click', () => {
            console.log('💼 実データを選択');
            loadData('real');
        });
    }
});
}
