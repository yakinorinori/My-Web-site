// ページロード時にsales.csvを自動取得して表示
// 更新: 2025-09-11 ログイン画面修正
let globalData = [];

// API設定 - 環境に応じて動的に設定
const API_BASE_URL = window.location.hostname === 'yakinorinori.github.io' 
    ? '' // GitHub Pages用: デモモードでHTTP通信なし
    : window.location.protocol === 'https:' 
        ? `https://${window.location.hostname}:3001`  // HTTPS環境
        : `http://${window.location.hostname}:3001`;  // HTTP環境（開発用）

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
        <div style="text-align: center; padding: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; min-height: 100vh;">
            <h1>🔐 売上管理システム</h1>
            
            <div style="background: white; color: #333; max-width: 400px; margin: 30px auto; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h2>ログイン</h2>
                <form id="login-form" style="text-align: left;">
                    <div style="margin-bottom: 15px;">
                        <label for="username">ユーザー名:</label>
                        <input type="text" id="username" name="username" 
                               style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ddd; border-radius: 4px;"
                               placeholder="kiradan">
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label for="password">パスワード:</label>
                        <input type="password" id="password" name="password" 
                               style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ddd; border-radius: 4px;"
                               placeholder="パスワードを入力">
                    </div>
                    <button type="submit" style="width: 100%; background: #667eea; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">
                        ログイン
                    </button>
                </form>
                
                <div id="login-error" style="margin-top: 15px; color: #dc3545; display: none;"></div>
                
                <div style="margin-top: 20px; padding: 15px; background: #e8f5e8; border-radius: 5px; border-left: 4px solid #4CAF50;">
                    <strong>💡 デモ用アカウント</strong><br>
                    ユーザー名: kiradan<br>
                    パスワード: kiradan2024!
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

function showDemoMessage() {
    console.log('🎬 デモメッセージを表示中...');
    document.getElementById('app-root').innerHTML = `
        <div style="text-align: center; padding: 50px; background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; min-height: 100vh;">
            <h1>📊 売上管理システム - デモ版</h1>
            <div style="background: white; color: #333; max-width: 600px; margin: 30px auto; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h2>🌐 GitHub Pages デモモード</h2>
                <p>このサイトはGitHub Pagesでホストされており、デモ用のサンプルデータを表示しています。</p>
                
                <div style="margin: 20px 0; padding: 15px; background: #e8f5e8; border-radius: 5px; border-left: 4px solid #4CAF50;">
                    <h3>🎯 機能紹介</h3>
                    <ul style="text-align: left; margin: 10px 0;">
                        <li>📈 売上データのグラフ表示</li>
                        <li>🍰 円グラフ、棒グラフ、線グラフ対応</li>
                        <li>📱 レスポンシブデザイン</li>
                        <li>🔐 認証システム（ローカル環境）</li>
                    </ul>
                </div>
                
                <button onclick="loadDemoData()" 
                        style="background: #4CAF50; color: white; border: none; padding: 15px 30px; border-radius: 5px; cursor: pointer; font-size: 16px; margin: 10px;">
                    📊 デモデータを表示
                </button>
                
                <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 5px; border-left: 4px solid #ffc107;">
                    <strong>💡 フル機能版</strong><br>
                    完全な認証機能とリアルタイムデータは、ローカル環境（Mac mini）で利用可能です。
                </div>
            </div>
        </div>
    `;
}

function showLoginMessage() {
    console.log('🔐 ログインメッセージを表示中...');
    const loginUrl = `${API_BASE_URL}/login`;
    document.getElementById('app-root').innerHTML = `
        <div style="text-align: center; padding: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; min-height: 100vh;">
            <h1>🔒 売上管理システム</h1>
            <div style="background: white; color: #333; max-width: 400px; margin: 30px auto; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h2>ログインが必要です</h2>
                <p>システムにアクセスするには認証が必要です。</p>
                <button onclick="window.location.href='${loginUrl}'" 
                        style="background: #667eea; color: white; border: none; padding: 12px 30px; border-radius: 5px; cursor: pointer; font-size: 16px; margin: 10px;">
                    ログインページへ
                </button>
                <div style="margin-top: 20px; padding: 15px; background: #f0f8ff; border-radius: 5px; border-left: 4px solid #2196F3;">
                    <strong>セキュリティ機能:</strong><br>
                    ✓ ユーザー認証<br>
                    ✓ セッション管理<br>
                    ✓ データ保護
                </div>
            </div>
        </div>
    `;
}

// デモデータ読み込み機能
function loadDemoData() {
    console.log('🎬 デモデータを読み込み中...');
    
    // GitHub Pages用のサンプルデータ
    const demoData = [
        { 日付: "2024-01-01", 商品名: "サンプル商品A", 販売数量: 10, 単価: 1000, 売上: 10000 },
        { 日付: "2024-01-02", 商品名: "サンプル商品B", 販売数量: 5, 単価: 2000, 売上: 10000 },
        { 日付: "2024-01-03", 商品名: "サンプル商品C", 販売数量: 8, 単価: 1500, 売上: 12000 },
        { 日付: "2024-01-04", 商品名: "サンプル商品A", 販売数量: 12, 単価: 1000, 売上: 12000 },
        { 日付: "2024-01-05", 商品名: "サンプル商品D", 販売数量: 3, 単価: 3000, 売上: 9000 },
        { 日付: "2024-01-06", 商品名: "サンプル商品B", 販売数量: 7, 単価: 2000, 売上: 14000 },
        { 日付: "2024-01-07", 商品名: "サンプル商品C", 販売数量: 15, 単価: 1500, 売上: 22500 },
        { 日付: "2024-01-08", 商品名: "サンプル商品A", 販売数量: 20, 単価: 1000, 売上: 20000 }
    ];
    
    globalData = demoData;
    
    // デモ用ユーザー情報を表示
    showDemoUserInfo();
    
    // メインアプリケーションを初期化
    createMainApp();
    
    // グラフを生成
    createCharts();
    
    console.log('✅ デモデータ読み込み完了');
}

function showDemoUserInfo() {
    // デモ用ユーザー情報表示
    const userInfo = document.createElement('div');
    userInfo.id = 'user-info';
    userInfo.style.cssText = 'position: fixed; top: 10px; right: 10px; background: #4CAF50; color: white; padding: 10px 20px; border-radius: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); z-index: 1000;';
    userInfo.innerHTML = `
        🎬 デモモード 
        <button onclick="location.reload()" 
                style="margin-left: 10px; background: white; color: #4CAF50; border: none; padding: 5px 10px; border-radius: 10px; cursor: pointer; font-size: 12px;">
            リセット
        </button>
    `;
    document.body.appendChild(userInfo);
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
    // GitHub Pagesの場合
    if (IS_GITHUB_PAGES) {
        console.log('🌐 GitHub Pagesモード');
        
        // 認証状態をチェック
        const isAuthenticated = await checkAuthentication();
        if (!isAuthenticated) {
            // 未認証の場合はログイン画面を表示
            showGitHubPagesLogin();
            return;
        }
        
        // 認証済みの場合はメインアプリを表示
        createMainApp();
        return;
    }
    
    // Mac mini環境では認証チェック
    const isAuthenticated = await checkAuthentication();
    if (!isAuthenticated) {
        return; // showLoginMessage()は既にcheckAuthentication内で呼ばれる
    }
    
    // 認証成功後、アプリのUIを構築
    createMainApp();
}
window.onload = function() {
    // 認証チェックしてからアプリ初期化
    initializeApp();
}

function createMainApp() {
    // ルート要素取得
    const root = document.getElementById('app-root');
    root.innerHTML = '';

    // タイトル
    const h1 = document.createElement('h1');
    h1.textContent = IS_GITHUB_PAGES ? '📊 売上管理Webサイト - デモ版' : '売上管理Webサイト';
    root.appendChild(h1);

    // ボタン
    const btnDiv = document.createElement('div');
    const btnYear = document.createElement('button');
    btnYear.id = 'btn-year';
    btnYear.textContent = '年ごとの分析';
    const btnMonth = document.createElement('button');
    btnMonth.id = 'btn-month';
    btnMonth.textContent = '月ごとの分析';
    btnDiv.appendChild(btnYear);
    btnDiv.appendChild(btnMonth);
    root.appendChild(btnDiv);

    // プルダウン（select）追加
    const monthSelectDiv = document.createElement('div');
    monthSelectDiv.id = 'month-select-div';
    monthSelectDiv.style.display = 'none';
    monthSelectDiv.style.margin = '10px 0 20px 0';
    const monthLabel = document.createElement('label');
    monthLabel.textContent = '月を選択: ';
    monthLabel.setAttribute('for', 'month-select');
    const monthSelect = document.createElement('select');
    monthSelect.id = 'month-select';
    monthSelectDiv.appendChild(monthLabel);
    monthSelectDiv.appendChild(monthSelect);
    root.appendChild(monthSelectDiv);

    // 分析用div
    const divYear = document.createElement('div');
    divYear.id = 'analysis-year';
    divYear.style.display = 'none';
    root.appendChild(divYear);
    const divMonth = document.createElement('div');
    divMonth.id = 'analysis-month';
    root.appendChild(divMonth);
    const divWeekday = document.createElement('div');
    divWeekday.id = 'analysis-weekday';
    root.appendChild(divWeekday);
    const divTable = document.createElement('div');
    divTable.id = 'sales-table';
    root.appendChild(divTable);

    // Chart.js用のグラフエリアも#app-root内に生成
    let chartArea = document.getElementById('chart-area');
    if (!chartArea) {
        chartArea = document.createElement('div');
        chartArea.id = 'chart-area';
        chartArea.style.marginTop = '40px';
        chartArea.style.display = 'flex';
        chartArea.style.justifyContent = 'center';
        
        // データソース選択ボタンを追加
        const dataSourceSelector = document.createElement('div');
        dataSourceSelector.style.cssText = 'margin: 20px 0; text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px;';
        dataSourceSelector.innerHTML = `
            <h3>📊 データソース選択</h3>
            <button id="demo-data-btn" class="data-source-btn" style="margin: 5px; padding: 10px 20px; background: #17a2b8; color: white; border: none; border-radius: 5px; cursor: pointer;">
                📋 デモデータ
            </button>
            <button id="real-data-btn" class="data-source-btn" style="margin: 5px; padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">
                💼 実データ（Mac mini）
            </button>
            <div id="data-info" style="margin-top: 10px; font-size: 14px; color: #6c757d;"></div>
        `;
        root.appendChild(dataSourceSelector);
        root.appendChild(chartArea);
        
        // デフォルトでデモデータを読み込み
        loadData('demo');
    }

    // データ取得関数
    function loadData(dataType = 'demo') {
        const url = `${API_BASE_URL}/sales.csv?type=${dataType}`;
        console.log(`📥 データ取得中: ${dataType} data from ${url}`);
        
        return authenticatedFetch(url)
            .then(response => response.text())
            .then(text => {
                const data = csvToArray(text);
                globalData = data;
                
                // データ情報を更新
                const dataInfo = document.getElementById('data-info');
                if (dataInfo) {
                    const recordCount = data.length;
                    const totalSales = data.reduce((sum, row) => sum + parseInt(row['売上'] || 0), 0);
                    dataInfo.innerHTML = `
                        ${dataType === 'real' ? '💼 実データ' : '📋 デモデータ'}: 
                        ${recordCount}件のレコード, 
                        総売上: ¥${totalSales.toLocaleString()}
                    `;
                }
                
                // プルダウンの選択肢をセット
                const months = Array.from(new Set(data.map(row => row['日付'].slice(0,7)))).sort();
                monthSelect.innerHTML = '';
                months.forEach(m => {
                    const opt = document.createElement('option');
                    opt.value = m;
                    opt.textContent = m;
                    monthSelect.appendChild(opt);
                });
                // デフォルトは最新月
            if (months.length > 0) monthSelect.value = months[months.length-1];

            showMonthAnalysis();
            // ボタンイベント
            btnYear.onclick = () => {
                showYearAnalysis();
                monthSelectDiv.style.display = 'none';
            };
            btnMonth.onclick = () => {
                showMonthAnalysis();
                monthSelectDiv.style.display = '';
            };
            // プルダウン変更時
            monthSelect.onchange = () => {
                showMonthAnalysis();
            };
            // 月分析時のみプルダウン表示
            monthSelectDiv.style.display = '';
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
    document.getElementById('analysis-year').style.display = 'none';
    document.getElementById('analysis-month').style.display = '';
    document.getElementById('analysis-weekday').style.display = 'none';
    document.getElementById('sales-table').style.display = 'none';
    // プルダウンで選択された月のみ抽出
    const monthSelect = document.getElementById('month-select');
    let filtered = globalData;
    let selectedMonth = '';
    if (monthSelect && monthSelect.value) {
        selectedMonth = monthSelect.value;
        filtered = globalData.filter(row => row['日付'].slice(0,7) === selectedMonth);
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
    let html = '<h2>年別売上・客数・組数</h2><table border="1"><tr><th>年</th><th>売上合計</th><th>客数合計</th><th>組数</th></tr>';
    Object.keys(yearStats).sort().forEach(year => {
        // 組数計算
        let groupCount = 0;
        if (yearGroups[year]) {
            Object.values(yearGroups[year]).forEach(dateGroup => {
                groupCount += Object.keys(dateGroup).length;
            });
        }
        html += `<tr><td>${year}</td><td>${yearStats[year].sales.toLocaleString()}</td><td>${yearStats[year].customers}</td><td>${groupCount}</td></tr>`;
    });
    html += '</table>';

    // 月ごとの合計（折れ線グラフ）
    html += '<h2>月ごとの合計</h2>';
    Object.keys(yearMonthStats).sort().forEach(year => {
        html += `<h3>${year}</h3><canvas id="lineChart-year-${year}" width="500" height="220"></canvas>`;
        html += `<table id="table-year-month-${year}" border="1"><tr><th>月</th><th>売上合計</th><th>客数合計</th></tr>`;
        const months = Object.keys(yearMonthStats[year]).sort();
        months.forEach(month => {
            html += `<tr><td>${month}</td><td>${yearMonthStats[year][month].sales.toLocaleString()}</td><td>${yearMonthStats[year][month].customers}</td></tr>`;
        });
        html += '</table>';
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
    const weekdays = ['日','月','火','水','木','金','土'];
    
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
    // キャッシュ回避のためにダミークエリを付与（認証付き・バックエンドから）
    authenticatedFetch(`${API_BASE_URL}/sales.csv?ts=` + new Date().getTime())
            .then(response => response.text())
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
