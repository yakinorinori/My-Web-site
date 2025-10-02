/**
 * UI制御モジュール (UI Module)
 * DOM操作、画面表示制御、ユーザーインターフェース管理
 */

/**
 * メインアプリケーションを作成
 */
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
    createHeader(root);
    
    // メインコンテンツ作成
    createMainContent(root);
    
    // ログアウト関数をグローバルに追加
    window.logout = () => {
        logout();
    };
}

/**
 * ヘッダーを作成
 */
function createHeader(root) {
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
                <span style="margin-right: 12px;">👤 ${getAuthenticatedUser()}</span>
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
            background: radial-gradient(circle at 20% 20%, rgba(255,255,255,0.05) 1px, transparent 1px),
                        radial-gradient(circle at 80% 20%, rgba(255,255,255,0.03) 1px, transparent 1px),
                        radial-gradient(circle at 50% 80%, rgba(255,255,255,0.04) 1px, transparent 1px);
            background-size: 50px 50px;
            z-index: 1;
        "></div>
    `;
    
    root.appendChild(header);
}

/**
 * メインコンテンツエリアを作成
 */
function createMainContent(root) {
    const mainContent = document.createElement('div');
    mainContent.style.cssText = `
        max-width: 1200px;
        margin: 0 auto;
        padding: 30px 20px;
    `;
    
    // モバイル切り替えボタン
    createMobileToggleButton(mainContent);
    
    // 分析選択カード
    createAnalysisSelector(mainContent);
    
    // データ情報表示エリア
    createDataInfoArea(mainContent);
    
    // 月選択エリア
    createMonthSelector(mainContent);
    
    // 分析結果表示エリア
    createAnalysisResultArea(mainContent);
    
    root.appendChild(mainContent);
}

/**
 * 分析選択カードを作成
 */
function createAnalysisSelector(mainContent) {
    const analysisSelector = document.createElement('div');
    analysisSelector.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
    `;
    
    // 年分析カード
    const yearCard = createAnalysisCard({
        icon: '📈',
        title: '年間分析',
        description: '年別の売上・客数・組数を分析',
        highlight: '🎯 長期トレンド分析に最適',
        onClick: () => {
            showYearAnalysis();
            hideMonthSelector();
            setActiveCard(yearCard, [yearCard, monthCard, reportCard]);
        }
    });
    
    // 月分析カード
    const monthCard = createAnalysisCard({
        icon: '📅',
        title: '月次分析',
        description: '月別・曜日別の詳細分析',
        highlight: '📊 詳細な期間分析が可能',
        onClick: () => {
            showMonthAnalysis();
            showMonthSelector();
            setActiveCard(monthCard, [yearCard, monthCard, reportCard]);
        }
    });
    
    // レポート生成カード
    const reportCard = createAnalysisCard({
        icon: '📋',
        title: '売上レポート生成',
        description: '包括的な売上レポートを作成',
        highlight: '💼 エクスポート機能付き',
        onClick: () => {
            generateSalesReport('monthly');
            setActiveCard(reportCard, [yearCard, monthCard, reportCard]);
        }
    });
    
    analysisSelector.appendChild(yearCard);
    analysisSelector.appendChild(monthCard);
    analysisSelector.appendChild(reportCard);
    mainContent.appendChild(analysisSelector);
    
    // グローバル参照のために保存
    window.yearCard = yearCard;
    window.monthCard = monthCard;
    window.reportCard = reportCard;
}

/**
 * 分析カードを作成
 */
function createAnalysisCard({ icon, title, description, highlight, onClick }) {
    const card = document.createElement('div');
    card.style.cssText = `
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
    
    card.innerHTML = `
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
            ">${icon}</div>
            <div>
                <h3 style="
                    margin: 0;
                    font-size: 18px;
                    font-weight: 600;
                    color: #1e293b;
                ">${title}</h3>
                <p style="
                    margin: 4px 0 0 0;
                    font-size: 14px;
                    color: #64748b;
                ">${description}</p>
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
            ">${highlight}</span>
        </div>
    `;
    
    card.onclick = onClick;
    
    card.onmouseenter = () => {
        if (!card.classList.contains('active')) {
            card.style.transform = 'translateY(-4px)';
            card.style.boxShadow = '0 12px 40px rgba(14, 165, 233, 0.15)';
        }
    };
    
    card.onmouseleave = () => {
        if (!card.classList.contains('active')) {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
        }
    };
    
    return card;
}

/**
 * アクティブカードを設定
 */
function setActiveCard(activeCard, allCards) {
    allCards.forEach(card => {
        card.classList.remove('active');
        card.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
        card.style.transform = 'translateY(0)';
    });
    
    activeCard.classList.add('active');
    activeCard.style.boxShadow = '0 8px 30px rgba(14, 165, 233, 0.2)';
    activeCard.style.transform = 'translateY(-2px)';
}

/**
 * データ情報表示エリアを作成
 */
function createDataInfoArea(mainContent) {
    const dataInfoContainer = document.createElement('div');
    dataInfoContainer.style.cssText = `
        background: white;
        border-radius: 16px;
        padding: 20px;
        margin-bottom: 24px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        border: 1px solid rgba(14, 165, 233, 0.1);
        text-align: center;
    `;
    
    const dataInfo = document.createElement('div');
    dataInfo.id = 'data-info';
    dataInfo.innerHTML = `
        <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 8px;
        ">
            <span style="font-size: 16px; margin-right: 8px;">⏳</span>
            <strong style="color: #64748b;">
                💼 データを読み込み中...
            </strong>
        </div>
        <div style="font-size: 13px; color: #64748b;">
            📊 システム初期化中
        </div>
    `;
    
    dataInfoContainer.appendChild(dataInfo);
    mainContent.appendChild(dataInfoContainer);
}

/**
 * 月選択エリアを作成
 */
function createMonthSelector(mainContent) {
    const monthSelectDiv = document.createElement('div');
    monthSelectDiv.id = 'month-select-div';
    monthSelectDiv.style.cssText = `
        background: white;
        border-radius: 16px;
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
            justify-content: center;
            margin-bottom: 16px;
        ">
            <span style="font-size: 18px; margin-right: 12px;">📅</span>
            <h3 style="
                margin: 0;
                font-size: 18px;
                font-weight: 600;
                color: #1e293b;
            ">月を選択</h3>
        </div>
        <div style="
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 12px;
        ">
            <label style="
                color: #64748b;
                font-weight: 500;
                font-size: 14px;
            ">分析対象月:</label>
            <select id="month-select" style="
                padding: 10px 16px;
                border: 1.5px solid #e2e8f0;
                border-radius: 8px;
                font-size: 14px;
                background: white;
                color: #1e293b;
                cursor: pointer;
                min-width: 120px;
            ">
                <option value="">選択してください</option>
            </select>
        </div>
    `;
    
    mainContent.appendChild(monthSelectDiv);
    
    // グローバル参照のために保存
    window.monthSelectDiv = monthSelectDiv;
}

/**
 * 分析結果表示エリアを作成
 */
function createAnalysisResultArea(mainContent) {
    const analysisArea = document.createElement('div');
    analysisArea.id = 'analysis-results';
    analysisArea.style.cssText = `
        min-height: 200px;
    `;
    
    mainContent.appendChild(analysisArea);
}

/**
 * 月選択エリアを表示
 */
function showMonthSelector() {
    const monthSelectDiv = document.getElementById('month-select-div');
    if (monthSelectDiv) {
        monthSelectDiv.style.display = 'block';
    }
}

/**
 * 月選択エリアを非表示
 */
function hideMonthSelector() {
    const monthSelectDiv = document.getElementById('month-select-div');
    if (monthSelectDiv) {
        monthSelectDiv.style.display = 'none';
    }
}

/**
 * 月次分析を表示
 */
function showMonthAnalysis() {
    const monthSelect = document.getElementById('month-select');
    const selectedMonth = monthSelect ? monthSelect.value : '';
    
    if (!selectedMonth) {
        console.warn('⚠️ 月が選択されていません');
        return;
    }
    
    console.log('📅 月次分析表示:', selectedMonth);
    
    const data = getGlobalData();
    if (!data || data.length === 0) {
        console.warn('⚠️ データが読み込まれていません');
        return;
    }
    
    // 月別データフィルタリング
    const monthData = filterDataByMonth(data, selectedMonth);
    
    // 分析結果を表示
    renderMonthAnalysis(monthData, selectedMonth);
    renderMonthPersonAnalysis(data);
    renderMonthWeekdayAnalysis(data, selectedMonth);
    
    // チャートを描画
    drawMonthlySalesChart(monthData);
}

/**
 * 年次分析を表示
 */
function showYearAnalysis() {
    console.log('📈 年次分析表示');
    
    const data = getGlobalData();
    if (!data || data.length === 0) {
        console.warn('⚠️ データが読み込まれていません');
        return;
    }
    
    renderYearAnalysis(data);
    drawMonthlyChart();
}

/**
 * テーブルを表示
 */
function renderTable(data) {
    console.log('📊 テーブル表示:', data.length, '件');
    let html = `
        <div style="
            background: white;
            border-radius: 16px;
            padding: 24px;
            margin: 24px 0;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(14, 165, 233, 0.1);
        ">
            <h2 style="
                color: #1e293b;
                font-size: 20px;
                font-weight: 600;
                margin: 0 0 20px 0;
                display: flex;
                align-items: center;
            ">
                <span style="margin-right: 12px;">📋</span>
                売上データ一覧
            </h2>
            <div style="overflow-x: auto;">
                <table style="
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 14px;
                ">
                    <thead>
                        <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                            <th style="padding: 12px; text-align: left; font-weight: 600; color: #1e293b;">日付</th>
                            <th style="padding: 12px; text-align: left; font-weight: 600; color: #1e293b;">支払い者</th>
                            <th style="padding: 12px; text-align: center; font-weight: 600; color: #1e293b;">客数</th>
                            <th style="padding: 12px; text-align: right; font-weight: 600; color: #1e293b;">売上</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    data.forEach((row, index) => {
        const isEven = index % 2 === 0;
        html += `
            <tr style="
                background: ${isEven ? '#f8fafc' : 'white'};
                border-bottom: 1px solid #f1f5f9;
            ">
                <td style="padding: 12px; color: #64748b;">${row['日付'] || '-'}</td>
                <td style="padding: 12px; font-weight: 500; color: #1e293b;">${row['支払い者'] || '-'}</td>
                <td style="padding: 12px; text-align: center; color: #64748b;">${row['客数'] || '-'}</td>
                <td style="padding: 12px; text-align: right; font-weight: 600; color: #0ea5e9;">
                    ¥${(parseInt(row['売り上げ']) || 0).toLocaleString()}
                </td>
            </tr>
        `;
    });
    
    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    // 結果表示エリアに追加
    const resultsArea = document.getElementById('analysis-results');
    if (resultsArea) {
        resultsArea.innerHTML = html;
    }
}

/**
 * 分析結果エリアをクリア
 */
function clearAnalysisResults() {
    const resultsArea = document.getElementById('analysis-results');
    if (resultsArea) {
        resultsArea.innerHTML = '';
    }
}

/**
 * モバイル切り替えボタンを作成
 */
function createMobileToggleButton(mainContent) {
    const mobileToggle = document.createElement('div');
    mobileToggle.style.cssText = `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 16px;
        padding: 20px;
        margin-bottom: 24px;
        text-align: center;
        box-shadow: 0 4px 20px rgba(102, 126, 234, 0.15);
    `;
    
    mobileToggle.innerHTML = `
        <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 12px;
        ">
            <span style="font-size: 24px; margin-right: 12px;">📱</span>
            <h3 style="
                color: white;
                margin: 0;
                font-size: 20px;
                font-weight: 600;
            ">モバイル売上報告</h3>
        </div>
        <p style="
            color: rgba(255, 255, 255, 0.9);
            margin: 0 0 16px 0;
            font-size: 14px;
        ">スマートフォンで伝票撮影・即時報告</p>
        <button onclick="startMobileSalesReport()" style="
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
            padding: 12px 24px;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            backdrop-filter: blur(12px);
            transition: all 0.2s ease;
        "
        onmouseover="this.style.background='rgba(255, 255, 255, 0.3)'"
        onmouseout="this.style.background='rgba(255, 255, 255, 0.2)'">
            📸 モバイル報告を開始
        </button>
    `;
    
    mainContent.appendChild(mobileToggle);
}

/**
 * 年次分析結果を表示
 */
function renderYearAnalysis(data) {
    const weekdays = ['日','月','火','水','木','金','土'];
    const yearStats = {};
    const yearGroups = {};
    const yearPersonStats = {};
    const yearMonthStats = {};
    const yearWeekdayStats = {};
    
    data.forEach(row => {
        if (!row || !row['日付']) return;
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

    // 年次統計テーブルのHTML作成
    let html = `
        <div style="
            background: white;
            border-radius: 16px;
            padding: 24px;
            margin: 24px 0;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(14, 165, 233, 0.1);
        ">
            <h2 style="
                color: #1e293b;
                font-size: 20px;
                font-weight: 600;
                margin: 0 0 20px 0;
                display: flex;
                align-items: center;
            ">
                <span style="margin-right: 12px;">📈</span>
                年次統計
            </h2>
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                            <th style="padding: 12px; text-align: left; font-weight: 600; color: #1e293b;">年</th>
                            <th style="padding: 12px; text-align: right; font-weight: 600; color: #1e293b;">売上</th>
                            <th style="padding: 12px; text-align: right; font-weight: 600; color: #1e293b;">客数</th>
                            <th style="padding: 12px; text-align: right; font-weight: 600; color: #1e293b;">組数</th>
                        </tr>
                    </thead>
                <tbody>
    `;
    
    Object.keys(yearStats).sort().forEach((year, index) => {
        const stat = yearStats[year];
        const groups = Object.keys(yearGroups[year] || {}).reduce((total, date) => {
            return total + Object.keys(yearGroups[year][date]).length;
        }, 0);
        const isEven = index % 2 === 0;
        
        html += `
            <tr style="
                background: ${isEven ? '#f8fafc' : 'white'};
                border-bottom: 1px solid #f1f5f9;
            ">
                <td style="padding: 12px; font-weight: 500; color: #1e293b;">${year}年</td>
                <td style="padding: 12px; text-align: right; font-weight: 600; color: #0ea5e9;">¥${stat.sales.toLocaleString()}</td>
                <td style="padding: 12px; text-align: right; color: #64748b;">${stat.customers.toLocaleString()}人</td>
                <td style="padding: 12px; text-align: right; color: #64748b;">${groups}組</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    </div>
    `;
    
    // 結果表示エリアに設定
    const resultsArea = document.getElementById('analysis-results');
    if (resultsArea) {
        resultsArea.innerHTML = html;
    }
}

/**
 * 月次分析結果を表示
 */
function renderMonthAnalysis(data, selectedMonth) {
    const weekdays = ['日','月','火','水','木','金','土'];
    const monthStats = { sales: 0, customers: 0, groups: {} };
    const weekdayStats = {};
    const personStats = {};
    
    // 曜日統計の初期化
    weekdays.forEach(wd => weekdayStats[wd] = { sales: 0, customers: 0 });
    
    data.forEach(row => {
        if (!row || !row['日付']) return;
        const date = row['日付'];
        const d = new Date(date.replace(/\//g,'-'));
        const wd = weekdays[d.getDay()];
        const sales = Number(row['売り上げ']) || 0;
        const customers = Number(row['客数']) || 0;
        const person = row['支払い者'];
        
        monthStats.sales += sales;
        monthStats.customers += customers;
        
        // 組数カウント
        if (!monthStats.groups[date]) monthStats.groups[date] = {};
        monthStats.groups[date][person] = true;
        
        // 曜日別統計
        weekdayStats[wd].sales += sales;
        weekdayStats[wd].customers += customers;
        
        // 支払い者別統計（不明除外）
        if (person !== '不明') {
            if (!personStats[person]) personStats[person] = 0;
            personStats[person] += sales;
        }
    });
    
    const totalGroups = Object.keys(monthStats.groups).reduce((total, date) => {
        return total + Object.keys(monthStats.groups[date]).length;
    }, 0);
    
    // 月次統計のHTML作成
    let html = `
        <div style="
            background: white;
            border-radius: 16px;
            padding: 24px;
            margin: 24px 0;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(14, 165, 233, 0.1);
        ">
            <h2 style="
                color: #1e293b;
                font-size: 20px;
                font-weight: 600;
                margin: 0 0 20px 0;
                display: flex;
                align-items: center;
            ">
                <span style="margin-right: 12px;">📅</span>
                ${selectedMonth} 月次統計
            </h2>
            
            <!-- 概要カード -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;">
                <div style="background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%); color: white; padding: 20px; border-radius: 12px;">
                    <div style="font-size: 14px; opacity: 0.9; margin-bottom: 8px;">💰 売上</div>
                    <div style="font-size: 24px; font-weight: 600;">¥${monthStats.sales.toLocaleString()}</div>
                </div>
                <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 20px; border-radius: 12px;">
                    <div style="font-size: 14px; opacity: 0.9; margin-bottom: 8px;">👥 客数</div>
                    <div style="font-size: 24px; font-weight: 600;">${monthStats.customers}人</div>
                </div>
                <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 20px; border-radius: 12px;">
                    <div style="font-size: 14px; opacity: 0.9; margin-bottom: 8px;">👥 組数</div>
                    <div style="font-size: 24px; font-weight: 600;">${totalGroups}組</div>
                </div>
            </div>
            
            <!-- 曜日別統計 -->
            <h3 style="color: #1e293b; font-size: 16px; margin: 24px 0 12px 0;">📊 曜日別内訳</h3>
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                    <thead>
                        <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                            <th style="padding: 10px; text-align: left; font-weight: 600; color: #1e293b;">曜日</th>
                            <th style="padding: 10px; text-align: right; font-weight: 600; color: #1e293b;">売上</th>
                            <th style="padding: 10px; text-align: right; font-weight: 600; color: #1e293b;">客数</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    weekdays.forEach((wd, index) => {
        const stat = weekdayStats[wd];
        const isEven = index % 2 === 0;
        html += `
            <tr style="
                background: ${isEven ? '#f8fafc' : 'white'};
                border-bottom: 1px solid #f1f5f9;
            ">
                <td style="padding: 10px; font-weight: 500; color: #1e293b;">${wd}曜日</td>
                <td style="padding: 10px; text-align: right; font-weight: 600; color: #0ea5e9;">¥${stat.sales.toLocaleString()}</td>
                <td style="padding: 10px; text-align: right; color: #64748b;">${stat.customers}人</td>
            </tr>
        `;
    });
    
    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    // 結果表示エリアに設定
    const resultsArea = document.getElementById('analysis-results');
    if (resultsArea) {
        resultsArea.innerHTML = html;
    }
}

/**
 * 月ごとの支払い者別分析を表示
 */
function renderMonthPersonAnalysis(data) {
    const monthPersonStats = {};
    data.forEach(row => {
        if (!row || !row['日付']) return;
        const month = row['日付'].slice(0,7); // YYYY/MM
        const person = row['支払い者'];
        if (person === '不明') return; // 除外
        const sales = Number(row['売り上げ']) || 0;
        if (!monthPersonStats[month]) monthPersonStats[month] = {};
        if (!monthPersonStats[month][person]) monthPersonStats[month][person] = 0;
        monthPersonStats[month][person] += sales;
    });
    
    let html = `
        <div style="
            background: white;
            border-radius: 16px;
            padding: 24px;
            margin: 24px 0;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(14, 165, 233, 0.1);
        ">
            <h2 style="
                color: #1e293b;
                font-size: 20px;
                font-weight: 600;
                margin: 0 0 20px 0;
                display: flex;
                align-items: center;
            ">
                <span style="margin-right: 12px;">👥</span>
                月ごとの支払い者別合計金額（上位10名・不明除外）
            </h2>
    `;
    
    Object.keys(monthPersonStats).sort().forEach(month => {
        html += `
            <div style="margin-bottom: 24px;">
                <h3 style="color: #1e293b; font-size: 16px; margin: 0 0 12px 0;">${month}</h3>
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                        <thead>
                            <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                                <th style="padding: 10px; text-align: left; font-weight: 600; color: #1e293b;">支払い者</th>
                                <th style="padding: 10px; text-align: right; font-weight: 600; color: #1e293b;">合計金額</th>
                            </tr>
                        </thead>
                        <tbody>
        `;
        
        // 金額順に並べて上位10名のみ
        const sortedPersons = Object.entries(monthPersonStats[month])
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10);
            
        sortedPersons.forEach(([person, total], index) => {
            const isEven = index % 2 === 0;
            html += `
                <tr style="
                    background: ${isEven ? '#f8fafc' : 'white'};
                    border-bottom: 1px solid #f1f5f9;
                ">
                    <td style="padding: 10px; font-weight: 500; color: #1e293b;">${person}</td>
                    <td style="padding: 10px; text-align: right; font-weight: 600; color: #0ea5e9;">¥${total.toLocaleString()}</td>
                </tr>
            `;
        });
        
        html += `
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    // 既存の結果に追加
    const resultsArea = document.getElementById('analysis-results');
    if (resultsArea) {
        resultsArea.innerHTML += html;
    }
}

/**
 * 月別曜日分析を表示
 */
function renderMonthWeekdayAnalysis(data, selectedMonth) {
    const weekdays = ['日','月','火','水','木','金','土'];
    const monthData = data.filter(row => row && row['日付'] && row['日付'].startsWith(selectedMonth));
    const weekdayStats = {};
    
    weekdays.forEach(wd => weekdayStats[wd] = { sales: 0, customers: 0, count: 0 });
    
    monthData.forEach(row => {
        const date = row['日付'];
        const d = new Date(date.replace(/\//g,'-'));
        const wd = weekdays[d.getDay()];
        const sales = Number(row['売り上げ']) || 0;
        const customers = Number(row['客数']) || 0;
        
        weekdayStats[wd].sales += sales;
        weekdayStats[wd].customers += customers;
        weekdayStats[wd].count += 1;
    });
    
    let html = `
        <div style="
            background: white;
            border-radius: 16px;
            padding: 24px;
            margin: 24px 0;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(14, 165, 233, 0.1);
        ">
            <h2 style="
                color: #1e293b;
                font-size: 20px;
                font-weight: 600;
                margin: 0 0 20px 0;
                display: flex;
                align-items: center;
            ">
                <span style="margin-right: 12px;">📊</span>
                ${selectedMonth} 曜日別詳細分析
            </h2>
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                    <thead>
                        <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                            <th style="padding: 12px; text-align: left; font-weight: 600; color: #1e293b;">曜日</th>
                            <th style="padding: 12px; text-align: right; font-weight: 600; color: #1e293b;">売上</th>
                            <th style="padding: 12px; text-align: right; font-weight: 600; color: #1e293b;">客数</th>
                            <th style="padding: 12px; text-align: right; font-weight: 600; color: #1e293b;">平均単価</th>
                            <th style="padding: 12px; text-align: right; font-weight: 600; color: #1e293b;">営業日数</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    weekdays.forEach((wd, index) => {
        const stat = weekdayStats[wd];
        const avgPrice = stat.customers > 0 ? Math.round(stat.sales / stat.customers) : 0;
        const isEven = index % 2 === 0;
        
        html += `
            <tr style="
                background: ${isEven ? '#f8fafc' : 'white'};
                border-bottom: 1px solid #f1f5f9;
            ">
                <td style="padding: 12px; font-weight: 500; color: #1e293b;">${wd}曜日</td>
                <td style="padding: 12px; text-align: right; font-weight: 600; color: #0ea5e9;">¥${stat.sales.toLocaleString()}</td>
                <td style="padding: 12px; text-align: right; color: #64748b;">${stat.customers}人</td>
                <td style="padding: 12px; text-align: right; color: #64748b;">¥${avgPrice.toLocaleString()}</td>
                <td style="padding: 12px; text-align: right; color: #64748b;">${stat.count}日</td>
            </tr>
        `;
    });
    
    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    // 既存の結果に追加
    const resultsArea = document.getElementById('analysis-results');
    if (resultsArea) {
        resultsArea.innerHTML += html;
    }
}