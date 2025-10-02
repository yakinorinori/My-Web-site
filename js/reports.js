/**
 * レポート機能モジュール (Reports Module)
 * 売上レポートの生成、分析、エクスポート機能
 */

/**
 * 売上レポートを生成
 */
function generateSalesReport(period = 'monthly') {
    console.log('📊 売上報告書生成開始:', period);
    
    if (!globalData || globalData.length === 0) {
        console.warn('⚠️ データが読み込まれていません');
        showNotification('データが読み込まれていません', 'error');
        return;
    }
    
    const reportData = analyzeSalesData(globalData, period);
    displaySalesReport(reportData, period);
    showNotification(`${getPeriodLabel(period)}レポートを生成しました`, 'success');
}

/**
 * 売上データを分析
 */
function analyzeSalesData(data, period) {
    const analysis = {
        period: period,
        totalSales: 0,
        totalCustomers: 0,
        totalTransactions: data.length,
        averageTransaction: 0,
        topCustomers: {},
        periodAnalysis: {},
        summary: {}
    };
    
    // 基本統計の計算
    data.forEach(row => {
        if (!row || !row['日付']) return;
        
        const sales = Number(row['売り上げ']) || 0;
        const customers = Number(row['客数']) || 0;
        const person = row['支払い者'];
        
        analysis.totalSales += sales;
        analysis.totalCustomers += customers;
        
        // 支払い者別統計
        if (person && person !== '不明') {
            if (!analysis.topCustomers[person]) {
                analysis.topCustomers[person] = { sales: 0, visits: 0 };
            }
            analysis.topCustomers[person].sales += sales;
            analysis.topCustomers[person].visits += 1;
        }
        
        // 期間別分析
        let periodKey = '';
        const date = row['日付'];
        switch (period) {
            case 'monthly':
                periodKey = date.slice(0, 7); // YYYY/MM
                break;
            case 'quarterly':
                const month = parseInt(date.slice(5, 7));
                const quarter = Math.ceil(month / 3);
                periodKey = `${date.slice(0, 4)}Q${quarter}`;
                break;
            case 'yearly':
                periodKey = date.slice(0, 4); // YYYY
                break;
            default:
                periodKey = date.slice(0, 7);
        }
        
        if (!analysis.periodAnalysis[periodKey]) {
            analysis.periodAnalysis[periodKey] = { sales: 0, customers: 0, transactions: 0 };
        }
        analysis.periodAnalysis[periodKey].sales += sales;
        analysis.periodAnalysis[periodKey].customers += customers;
        analysis.periodAnalysis[periodKey].transactions += 1;
    });
    
    // 平均値の計算
    analysis.averageTransaction = analysis.totalTransactions > 0 
        ? analysis.totalSales / analysis.totalTransactions 
        : 0;
    
    // 上位顧客のソート
    analysis.topCustomersList = Object.entries(analysis.topCustomers)
        .sort(([,a], [,b]) => b.sales - a.sales)
        .slice(0, 10);
    
    // サマリー情報
    const periods = Object.keys(analysis.periodAnalysis).sort();
    if (periods.length > 1) {
        const latest = analysis.periodAnalysis[periods[periods.length - 1]];
        const previous = analysis.periodAnalysis[periods[periods.length - 2]];
        
        analysis.summary = {
            latestPeriod: periods[periods.length - 1],
            previousPeriod: periods[periods.length - 2],
            salesGrowth: previous.sales > 0 
                ? ((latest.sales - previous.sales) / previous.sales * 100) 
                : 0,
            customerGrowth: previous.customers > 0 
                ? ((latest.customers - previous.customers) / previous.customers * 100) 
                : 0
        };
    }
    
    return analysis;
}

/**
 * レポートを表示
 */
function displaySalesReport(reportData, period) {
    let reportContainer = document.getElementById('sales-report-container');
    if (!reportContainer) {
        // レポートコンテナを作成
        reportContainer = document.createElement('div');
        reportContainer.id = 'sales-report-container';
        reportContainer.style.cssText = `
            background: white;
            border-radius: 16px;
            padding: 24px;
            margin: 24px 0;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(14, 165, 233, 0.1);
        `;
        
        // メインコンテンツエリアに追加
        const mainContent = document.querySelector('#app-root > div:last-child');
        if (mainContent) {
            mainContent.appendChild(reportContainer);
        }
    }
    
    // 成長率の表示設定
    const salesGrowthColor = reportData.summary.salesGrowth >= 0 ? '#22c55e' : '#ef4444';
    const salesGrowthIcon = reportData.summary.salesGrowth >= 0 ? '📈' : '📉';
    
    // レポートHTMLの生成
    const reportHTML = `
        <div style="margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="
                    color: #1e293b;
                    font-size: 24px;
                    font-weight: 600;
                    margin: 0;
                    display: flex;
                    align-items: center;
                ">
                    <span style="margin-right: 12px;">📊</span>
                    売上報告書 - ${getPeriodLabel(period)}
                </h2>
                <div style="display: flex; gap: 8px;">
                    <button onclick="generateSalesReport('monthly')" style="
                        padding: 8px 16px;
                        background: ${period === 'monthly' ? '#0ea5e9' : '#f8fafc'};
                        color: ${period === 'monthly' ? 'white' : '#64748b'};
                        border: 1px solid #e2e8f0;
                        border-radius: 6px;
                        font-size: 13px;
                        cursor: pointer;
                        transition: all 0.2s;
                    " ${period === 'monthly' ? '' : 'onmouseover="this.style.background=\'#f1f5f9\'" onmouseout="this.style.background=\'#f8fafc\'"'}>月次</button>
                    <button onclick="generateSalesReport('quarterly')" style="
                        padding: 8px 16px;
                        background: ${period === 'quarterly' ? '#0ea5e9' : '#f8fafc'};
                        color: ${period === 'quarterly' ? 'white' : '#64748b'};
                        border: 1px solid #e2e8f0;
                        border-radius: 6px;
                        font-size: 13px;
                        cursor: pointer;
                        transition: all 0.2s;
                    " ${period === 'quarterly' ? '' : 'onmouseover="this.style.background=\'#f1f5f9\'" onmouseout="this.style.background=\'#f8fafc\'"'}>四半期</button>
                    <button onclick="generateSalesReport('yearly')" style="
                        padding: 8px 16px;
                        background: ${period === 'yearly' ? '#0ea5e9' : '#f8fafc'};
                        color: ${period === 'yearly' ? 'white' : '#64748b'};
                        border: 1px solid #e2e8f0;
                        border-radius: 6px;
                        font-size: 13px;
                        cursor: pointer;
                        transition: all 0.2s;
                    " ${period === 'yearly' ? '' : 'onmouseover="this.style.background=\'#f1f5f9\'" onmouseout="this.style.background=\'#f8fafc\'"'}>年次</button>
                </div>
            </div>
            
            <!-- 概要統計 -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;">
                <div style="background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%); color: white; padding: 20px; border-radius: 12px;">
                    <div style="font-size: 14px; opacity: 0.9; margin-bottom: 8px;">💰 総売上</div>
                    <div style="font-size: 24px; font-weight: 600;">¥${reportData.totalSales.toLocaleString()}</div>
                </div>
                <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 20px; border-radius: 12px;">
                    <div style="font-size: 14px; opacity: 0.9; margin-bottom: 8px;">👥 総客数</div>
                    <div style="font-size: 24px; font-weight: 600;">${reportData.totalCustomers.toLocaleString()}人</div>
                </div>
                <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 20px; border-radius: 12px;">
                    <div style="font-size: 14px; opacity: 0.9; margin-bottom: 8px;">📝 取引件数</div>
                    <div style="font-size: 24px; font-weight: 600;">${reportData.totalTransactions.toLocaleString()}件</div>
                </div>
                <div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 20px; border-radius: 12px;">
                    <div style="font-size: 14px; opacity: 0.9; margin-bottom: 8px;">💵 平均単価</div>
                    <div style="font-size: 24px; font-weight: 600;">¥${Math.round(reportData.averageTransaction).toLocaleString()}</div>
                </div>
            </div>
            
            ${reportData.summary.latestPeriod ? `
            <!-- 成長率 -->
            <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <h3 style="margin: 0 0 16px 0; color: #1e293b; font-size: 18px; display: flex; align-items: center;">
                    <span style="margin-right: 8px;">${salesGrowthIcon}</span>
                    成長率分析
                </h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div>
                        <div style="font-size: 14px; color: #64748b; margin-bottom: 4px;">売上成長率</div>
                        <div style="font-size: 20px; font-weight: 600; color: ${salesGrowthColor};">
                            ${reportData.summary.salesGrowth >= 0 ? '+' : ''}${reportData.summary.salesGrowth.toFixed(1)}%
                        </div>
                        <div style="font-size: 12px; color: #64748b;">
                            ${reportData.summary.previousPeriod} → ${reportData.summary.latestPeriod}
                        </div>
                    </div>
                    <div>
                        <div style="font-size: 14px; color: #64748b; margin-bottom: 4px;">客数成長率</div>
                        <div style="font-size: 20px; font-weight: 600; color: ${reportData.summary.customerGrowth >= 0 ? '#22c55e' : '#ef4444'};">
                            ${reportData.summary.customerGrowth >= 0 ? '+' : ''}${reportData.summary.customerGrowth.toFixed(1)}%
                        </div>
                        <div style="font-size: 12px; color: #64748b;">
                            ${reportData.summary.previousPeriod} → ${reportData.summary.latestPeriod}
                        </div>
                    </div>
                </div>
            </div>
            ` : ''}
            
            <!-- 上位顧客 -->
            <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <h3 style="margin: 0 0 16px 0; color: #1e293b; font-size: 18px; display: flex; align-items: center;">
                    <span style="margin-right: 8px;">🏆</span>
                    上位顧客（売上ベース）
                </h3>
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="border-bottom: 2px solid #e2e8f0;">
                                <th style="padding: 12px; text-align: left; font-weight: 600; color: #1e293b;">順位</th>
                                <th style="padding: 12px; text-align: left; font-weight: 600; color: #1e293b;">顧客名</th>
                                <th style="padding: 12px; text-align: right; font-weight: 600; color: #1e293b;">売上</th>
                                <th style="padding: 12px; text-align: right; font-weight: 600; color: #1e293b;">来店回数</th>
                                <th style="padding: 12px; text-align: right; font-weight: 600; color: #1e293b;">平均単価</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${reportData.topCustomersList.map(([customer, data], index) => `
                                <tr style="border-bottom: 1px solid #f1f5f9;">
                                    <td style="padding: 12px; color: #64748b;">${index + 1}</td>
                                    <td style="padding: 12px; font-weight: 500; color: #1e293b;">${customer}</td>
                                    <td style="padding: 12px; text-align: right; font-weight: 600; color: #0ea5e9;">¥${data.sales.toLocaleString()}</td>
                                    <td style="padding: 12px; text-align: right; color: #64748b;">${data.visits}回</td>
                                    <td style="padding: 12px; text-align: right; color: #64748b;">¥${Math.round(data.sales / data.visits).toLocaleString()}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- エクスポート機能 -->
            <div style="display: flex; gap: 12px; justify-content: center; margin-top: 24px;">
                <button onclick="exportReportToCSV()" style="
                    padding: 12px 24px;
                    background: #22c55e;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.2s;
                " onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(34, 197, 94, 0.3)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                    <span>📊</span>
                    CSV エクスポート
                </button>
                <button onclick="exportReportToPDF()" style="
                    padding: 12px 24px;
                    background: #ef4444;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.2s;
                " onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(239, 68, 68, 0.3)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                    <span>📄</span>
                    PDF エクスポート
                </button>
            </div>
        </div>
    `;
    
    reportContainer.innerHTML = reportHTML;
}

/**
 * 期間ラベルを取得
 */
function getPeriodLabel(period) {
    switch (period) {
        case 'monthly': return '月次分析';
        case 'quarterly': return '四半期分析';
        case 'yearly': return '年次分析';  
        default: return '期間分析';
    }
}

/**
 * 自動レポート機能をセットアップ
 */
function setupAutomaticReports() {
    console.log('⏰ 自動レポート機能をセットアップ中...');
    
    // 月次レポートの自動生成（毎月1日）
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const timeToNextMonth = nextMonth.getTime() - now.getTime();
    
    setTimeout(() => {
        console.log('🗓️ 月次レポートを自動生成');
        generateSalesReport('monthly');
        showNotification('月次レポートが自動生成されました', 'info');
        
        // 毎月実行するためのインターバルを設定
        setInterval(() => {
            generateSalesReport('monthly');
            showNotification('月次レポートが自動生成されました', 'info');
        }, 30 * 24 * 60 * 60 * 1000); // 30日間隔
    }, timeToNextMonth);
    
    // 四半期レポートの自動生成
    const currentQuarter = Math.floor((now.getMonth() + 3) / 3);
    const nextQuarterMonth = currentQuarter * 3;
    const nextQuarterDate = new Date(now.getFullYear(), nextQuarterMonth, 1);
    if (nextQuarterDate <= now) {
        nextQuarterDate.setFullYear(nextQuarterDate.getFullYear() + 1);
    }
    const timeToNextQuarter = nextQuarterDate.getTime() - now.getTime();
    
    setTimeout(() => {
        console.log('📊 四半期レポートを自動生成');
        generateSalesReport('quarterly');
        showNotification('四半期レポートが自動生成されました', 'info');
        
        // 毎四半期実行するためのインターバルを設定
        setInterval(() => {
            generateSalesReport('quarterly');
            showNotification('四半期レポートが自動生成されました', 'info');
        }, 90 * 24 * 60 * 60 * 1000); // 90日間隔
    }, timeToNextQuarter);
    
    console.log('✅ 自動レポート機能のセットアップ完了');
}

/**
 * CSVエクスポート機能
 */
function exportReportToCSV() {
    console.log('📊 CSVエクスポート開始');
    
    if (!globalData || globalData.length === 0) {
        showNotification('エクスポートするデータがありません', 'error');
        return;
    }
    
    // CSVヘッダー
    const headers = ['日付', '支払い者', '客数', '売り上げ'];
    
    // データ行
    const csvData = globalData.map(row => [
        row['日付'] || '',
        row['支払い者'] || '',
        row['客数'] || '',
        row['売り上げ'] || ''
    ]);
    
    // CSV文字列を作成
    const csvContent = [headers, ...csvData]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');
    
    // BOMを追加（Excel用）
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // ダウンロード
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `売上レポート_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('CSVファイルをエクスポートしました', 'success');
}

/**
 * PDFエクスポート機能（プレースホルダー）
 */
function exportReportToPDF() {
    console.log('📄 PDFエクスポート試行');
    showNotification('PDF機能は開発中です。CSVエクスポートをご利用ください。', 'warning');
    
    // TODO: PDF生成ライブラリ（jsPDF等）を統合
}

/**
 * 通知システム
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#0ea5e9'};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        font-weight: 500;
        max-width: 300px;
        animation: slideIn 0.3s ease;
    `;
    
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️';
    notification.innerHTML = `<span style="margin-right: 8px;">${icon}</span>${message}`;
    
    document.body.appendChild(notification);
    
    // 3秒後に自動削除
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// CSS アニメーション
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);