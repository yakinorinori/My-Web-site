/**
 * チャート機能モジュール (Charts Module)
 * Chart.js を使用した各種データ可視化機能
 */

// チャートインスタンスの管理
let chartInstances = {};

/**
 * 月別売上チャートを描画
 */
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
                    if (!cols[0] || cols[0].trim() === '') continue; // 空行をスキップ
                    
                    const date = cols[0].trim();
                    const payer = cols[1] ? cols[1].trim() : '';
                    const customer = parseInt(cols[2], 10); // NaNの場合は0として扱う
                    const sales = parseInt(cols[3], 10) || 0;
                    
                    // 月を取得（YYYY/MM形式から）
                    const monthMatch = date.match(/(\d+)\/(\d+)/);
                    if (!monthMatch) continue;
                    const month = monthMatch[2]; // MM
                    
                    if (!monthMap[month]) {
                        monthMap[month] = { sales: 0, customers: 0, groups: 0 };
                    }
                    
                    monthMap[month].sales += sales;
                    monthMap[month].customers += (isNaN(customer) ? 0 : customer); // 客数0も正しく加算
                    monthMap[month].groups += 1; // 伝票数
                }
                const months = Object.keys(monthMap).sort((a,b)=>a-b).map(m => m+'月');
                const salesArr = Object.values(monthMap).map(m => m.sales);
                const customersArr = Object.values(monthMap).map(m => m.customers);
                const groupsArr = Object.values(monthMap).map(m => m.groups);

                // Chart.js描画（大きめサイズ、下部に表示）
                let chartArea = document.getElementById('chart-area');
                if (!chartArea) {
                    // #app-root内にchart-areaがなければ作成
                    const root = document.getElementById('app-root');
                    chartArea = document.createElement('div');
                    chartArea.id = 'chart-area';
                    chartArea.style.marginTop = '40px';
                    chartArea.style.display = 'flex';
                    chartArea.style.justifyContent = 'center';
                    chartArea.style.width = '100%';
                    chartArea.style.maxWidth = '900px';
                    chartArea.style.margin = '40px auto';
                    root.appendChild(chartArea);
                }
                // 確実にチャートを更新するため、タイムスタンプ付きIDを作成
                const chartId = 'multiLineChart_' + Date.now();
                chartArea.innerHTML = `<canvas id="${chartId}" width="800" height="400"></canvas>`;
                const ctx = document.getElementById(chartId).getContext('2d');
                
                // 既存チャートを破棄
                if (chartInstances.multiLineChart) {
                    chartInstances.multiLineChart.destroy();
                    delete chartInstances.multiLineChart;
                }
                
                chartInstances.multiLineChart = new Chart(ctx, {
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
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { 
                                position: 'top',
                                labels: {
                                    font: {
                                        size: 14
                                    }
                                }
                            },
                            title: { 
                                display: true, 
                                text: '月別売上・客数',
                                font: {
                                    size: 18,
                                    weight: 'bold'
                                }
                            }
                        },
                        scales: {
                            y: { 
                                type: 'linear',
                                display: true,
                                position: 'left',
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: '売上 (¥)',
                                    font: {
                                        size: 14,
                                        weight: 'bold'
                                    },
                                    color: '#4e79a7'
                                },
                                ticks: {
                                    font: {
                                        size: 12
                                    },
                                    color: '#4e79a7',
                                    callback: function(value) {
                                        return '¥' + value.toLocaleString();
                                    }
                                },
                                grid: {
                                    color: 'rgba(78, 121, 167, 0.1)'
                                }
                            },
                            y1: {
                                type: 'linear',
                                display: true,
                                position: 'right',
                                beginAtZero: true,
                                // 客数の最大値に余裕を持たせる（1.2倍）
                                max: Math.ceil(Math.max(...customersArr) * 1.2),
                                title: {
                                    display: true,
                                    text: '客数（人）',
                                    font: {
                                        size: 14,
                                        weight: 'bold'
                                    },
                                    color: '#f28e2b'
                                },
                                ticks: {
                                    font: {
                                        size: 12
                                    },
                                    color: '#f28e2b',
                                    callback: function(value) {
                                        return value + '人';
                                    }
                                },
                                grid: {
                                    drawOnChartArea: false // 右軸のグリッド線は非表示
                                }
                            },
                            x: {
                                ticks: {
                                    font: {
                                        size: 12
                                    }
                                }
                            }
                        }
                    }
                });
            })
            .catch(error => {
                console.error('チャート描画エラー:', error);
            });
}

/**
 * 月別売上推移チャートを描画
 */
function drawMonthlySalesChart(data, canvasId = 'lineChart') {
    const monthStats = getMonthlyStats(data);
    const monthlySales = Object.values(monthStats);
    const monthlyLabels = Object.keys(monthStats).map(month => month.slice(5)); // MM
    
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error(`❌ Canvas要素 '${canvasId}' が見つかりません`);
        console.log('📊 利用可能なCanvas要素:', Array.from(document.querySelectorAll('canvas')).map(c => c.id));
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    // 既存チャートを破棄
    if (chartInstances[canvasId]) {
        chartInstances[canvasId].destroy();
    }
    
    chartInstances[canvasId] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: monthlyLabels,
            datasets: [{
                label: '売上',
                data: monthlySales,
                borderColor: '#0ea5e9',
                backgroundColor: 'rgba(14, 165, 233, 0.1)',
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '月別売上推移',
                    font: {
                        size: 18,
                        weight: 'bold'
                    }
                },
                legend: {
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            size: 12
                        },
                        callback: function(value) {
                            return '¥' + value.toLocaleString();
                        }
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

/**
 * 円グラフを描画（支払い者別）
 */
function drawPayerPieChart(data, canvasId = 'pieChart') {
    const payerStats = getPayerStats(data);
    const sortedPayers = Object.entries(payerStats)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10); // 上位10名
    
    const labels = sortedPayers.map(([payer, _]) => payer);
    const values = sortedPayers.map(([_, amount]) => amount);
    
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error(`Canvas ${canvasId} not found`);
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    // 既存チャートを破棄
    if (chartInstances[canvasId]) {
        chartInstances[canvasId].destroy();
    }
    
    // カラーパレット
    const colors = [
        '#0ea5e9', '#06b6d4', '#22d3ee', '#38bdf8',
        '#60a5fa', '#818cf8', '#a78bfa', '#c084fc',
        '#e879f9', '#f472b6'
    ];
    
    chartInstances[canvasId] = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: '支払い者別売上構成（上位10名）'
                },
                legend: {
                    position: 'right'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const percentage = ((value / values.reduce((a, b) => a + b, 0)) * 100).toFixed(1);
                            return `${label}: ¥${value.toLocaleString()} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * 棒グラフを描画（曜日別）
 */
function drawWeekdayBarChart(data, canvasId = 'barChart') {
    const weekdayStats = getWeekdayStats(data);
    const weekdays = ['月', '火', '水', '木', '金', '土', '日'];
    const values = weekdays.map(day => weekdayStats[day] || 0);
    
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error(`Canvas ${canvasId} not found`);
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    // 既存チャートを破棄
    if (chartInstances[canvasId]) {
        chartInstances[canvasId].destroy();
    }
    
    chartInstances[canvasId] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: weekdays,
            datasets: [{
                label: '売上',
                data: values,
                backgroundColor: [
                    '#ef4444', '#f97316', '#eab308', '#22c55e',
                    '#06b6d4', '#3b82f6', '#8b5cf6'
                ],
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: '曜日別売上'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '¥' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

/**
 * 複合チャートを描画（売上と客数）
 */
function drawComboChart(data, canvasId = 'comboChart') {
    const monthStats = {};
    data.forEach(row => {
        if (!row || !row['日付']) return;
        const month = row['日付'].slice(0, 7); // YYYY/MM
        const sales = Number(row['売り上げ']) || 0;
        const customers = Number(row['客数']); // 0も正しく扱う（NaNの場合のみ0）
        
        if (!monthStats[month]) {
            monthStats[month] = { sales: 0, customers: 0 };
        }
        monthStats[month].sales += sales;
        // 客数はNaNでなければそのまま加算（0も含む）
        monthStats[month].customers += (isNaN(customers) ? 0 : customers);
    });
    
    const labels = Object.keys(monthStats).sort();
    const salesData = labels.map(month => monthStats[month].sales);
    const customersData = labels.map(month => monthStats[month].customers);
    
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error(`Canvas ${canvasId} not found`);
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    // 既存チャートを破棄
    if (chartInstances[canvasId]) {
        chartInstances[canvasId].destroy();
    }
    
    chartInstances[canvasId] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels.map(month => month.slice(5)), // MM format
            datasets: [
                {
                    label: '売上',
                    type: 'bar',
                    data: salesData,
                    backgroundColor: 'rgba(14, 165, 233, 0.7)',
                    borderColor: '#0ea5e9',
                    borderWidth: 1,
                    yAxisID: 'y'
                },
                {
                    label: '客数',
                    type: 'line',
                    data: customersData,
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    fill: false,
                    tension: 0.3,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: '月別売上と客数',
                    font: {
                        size: 18,
                        weight: 'bold'
                    }
                },
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '売上（¥）',
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        color: '#0ea5e9'
                    },
                    ticks: {
                        font: {
                            size: 12
                        },
                        color: '#0ea5e9',
                        callback: function(value) {
                            return '¥' + value.toLocaleString();
                        }
                    },
                    grid: {
                        color: 'rgba(14, 165, 233, 0.1)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '客数（人）',
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        color: '#f59e0b'
                    },
                    ticks: {
                        font: {
                            size: 12
                        },
                        color: '#f59e0b',
                        callback: function(value) {
                            return value + '人';
                        }
                    },
                    grid: {
                        drawOnChartArea: false // 右軸のグリッド線は非表示
                    }
                }
            }
        }
    });
}

/**
 * すべてのチャートを破棄
 */
function destroyAllCharts() {
    Object.values(chartInstances).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
            chart.destroy();
        }
    });
    chartInstances = {};
}

/**
 * 特定のチャートを破棄
 */
function destroyChart(canvasId) {
    if (chartInstances[canvasId]) {
        chartInstances[canvasId].destroy();
        delete chartInstances[canvasId];
    }
}

/**
 * チャートの共通設定
 */
const chartDefaults = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true,
            position: 'top'
        }
    }
};