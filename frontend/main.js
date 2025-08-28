
// ページロード時にsales.csvを自動取得して表示
let globalData = [];
window.onload = function() {
    fetch('sales.csv')
        .then(response => response.text())
        .then(text => {
            const data = csvToArray(text);
            globalData = data;
            showMonthAnalysis();
            // ボタンイベント
            document.getElementById('btn-year').onclick = showYearAnalysis;
            document.getElementById('btn-month').onclick = showMonthAnalysis;
        })
        .catch(() => {
            document.getElementById('sales-table').innerHTML = '<p>sales.csvが見つかりません</p>';
        });
};

function showMonthAnalysis() {
    document.getElementById('analysis-year').style.display = 'none';
    document.getElementById('analysis-month').style.display = '';
    document.getElementById('analysis-weekday').style.display = '';
    document.getElementById('sales-table').style.display = 'none';
    renderMonthAnalysis(globalData);
    renderWeekdayAnalysis(globalData);
    renderMonthPersonAnalysis(globalData);
}

function showYearAnalysis() {
    document.getElementById('analysis-year').style.display = '';
    document.getElementById('analysis-month').style.display = 'none';
    document.getElementById('analysis-weekday').style.display = 'none';
    document.getElementById('sales-table').style.display = 'none';
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

    // 月ごとの合計
    html += '<h2>月ごとの合計</h2>';
    Object.keys(yearMonthStats).sort().forEach(year => {
        html += `<h3>${year}</h3><table border="1"><tr><th>月</th><th>売上合計</th><th>客数合計</th></tr>`;
        Object.keys(yearMonthStats[year]).sort().forEach(month => {
            html += `<tr><td>${month}</td><td>${yearMonthStats[year][month].sales.toLocaleString()}</td><td>${yearMonthStats[year][month].customers}</td></tr>`;
        });
        html += '</table>';
    });

    // 年ごとの支払い者別合計金額は表示しない

    // 曜日ごとの合計
    html += '<h2>曜日ごとの合計</h2>';
    Object.keys(yearWeekdayStats).sort().forEach(year => {
        html += `<h3>${year}</h3><table border="1"><tr><th>曜日</th><th>売上合計</th><th>客数合計</th></tr>`;
        weekdays.forEach(wd => {
            if (yearWeekdayStats[year][wd]) {
                html += `<tr><td>${wd}</td><td>${yearWeekdayStats[year][wd].sales.toLocaleString()}</td><td>${yearWeekdayStats[year][wd].customers}</td></tr>`;
            }
        });
        html += '</table>';
    });

    // 年ごとに上位10人を表示
    html += '<h2>年ごとの上位10人（合計金額順）</h2>';
    Object.keys(yearPersonStats).sort().forEach(year => {
        const sortedPersons = Object.entries(yearPersonStats[year])
            .sort((a,b)=>b[1]-a[1])
            .slice(0,10);
        if (sortedPersons.length > 0) {
            html += `<h3>${year}</h3><table border="1"><tr><th>順位</th><th>支払い者</th><th>合計金額</th></tr>`;
            sortedPersons.forEach(([person, total], idx) => {
                html += `<tr><td>${idx+1}</td><td>${person}</td><td>${total.toLocaleString()}円</td></tr>`;
            });
            html += '</table>';
        }
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
        document.body.insertBefore(target, document.getElementById('analysis-month').nextSibling);
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
function renderMonthAnalysis(data) {
    const monthStats = {};
    // 組数集計用: { month: { date: { 支払い者: true } } }
    const monthGroups = {};
    data.forEach(row => {
        const date = row['日付'];
        const month = date.slice(0,7); // YYYY/MM
        const sales = Number(row['売り上げ']) || 0;
        const customers = Number(row['客数']) || 0;
        if (!monthStats[month]) monthStats[month] = { sales: 0, customers: 0 };
        monthStats[month].sales += sales;
        monthStats[month].customers += customers;

        // 組数集計
        if (!monthGroups[month]) monthGroups[month] = {};
        if (!monthGroups[month][date]) monthGroups[month][date] = {};
        monthGroups[month][date][row['支払い者']] = true;
    });
    let html = '<h2>月別売上・客数・組数</h2><table border="1"><tr><th>月</th><th>売上合計</th><th>客数合計</th><th>組数</th></tr>';
    Object.keys(monthStats).sort().forEach(month => {
        // 組数計算
        let groupCount = 0;
        if (monthGroups[month]) {
            Object.values(monthGroups[month]).forEach(dateGroup => {
                groupCount += Object.keys(dateGroup).length;
            });
        }
        html += `<tr><td>${month}</td><td>${monthStats[month].sales.toLocaleString()}</td><td>${monthStats[month].customers}</td><td>${groupCount}</td></tr>`;
    });
    html += '</table>';
    document.getElementById('analysis-month').innerHTML = html;
}

// 曜日別売上・客数分析（年・月ごと）
function renderWeekdayAnalysis(data) {
    const weekdays = ['日','月','火','水','木','金','土'];
    // 年月ごとに集計
    const ymWeekdayStats = {};
    // 組数集計用: { ym: { wd: { date: { 支払い者: true } } } }
    const ymWeekdayGroups = {};
    data.forEach(row => {
        const date = row['日付'];
        const ym = date.slice(0,7); // YYYY/MM
        const d = new Date(date.replace(/\//g,'-'));
        const wd = weekdays[d.getDay()];
        const sales = Number(row['売り上げ']) || 0;
        const customers = Number(row['客数']) || 0;
        if (!ymWeekdayStats[ym]) ymWeekdayStats[ym] = {};
        if (!ymWeekdayStats[ym][wd]) ymWeekdayStats[ym][wd] = { sales: 0, customers: 0 };
        ymWeekdayStats[ym][wd].sales += sales;
        ymWeekdayStats[ym][wd].customers += customers;

        // 組数集計
        if (!ymWeekdayGroups[ym]) ymWeekdayGroups[ym] = {};
        if (!ymWeekdayGroups[ym][wd]) ymWeekdayGroups[ym][wd] = {};
        if (!ymWeekdayGroups[ym][wd][date]) ymWeekdayGroups[ym][wd][date] = {};
        ymWeekdayGroups[ym][wd][date][row['支払い者']] = true;
    });
    let html = '<h2>曜日別売上・客数・組数（年・月ごと）</h2>';
    Object.keys(ymWeekdayStats).sort().forEach(ym => {
        html += `<h3>${ym}</h3><table border="1"><tr><th>曜日</th><th>売上合計</th><th>客数合計</th><th>組数</th></tr>`;
        weekdays.forEach(wd => {
            if (ymWeekdayStats[ym][wd]) {
                // 組数計算
                let groupCount = 0;
                if (ymWeekdayGroups[ym][wd]) {
                    Object.values(ymWeekdayGroups[ym][wd]).forEach(dateGroup => {
                        groupCount += Object.keys(dateGroup).length;
                    });
                }
                html += `<tr><td>${wd}</td><td>${ymWeekdayStats[ym][wd].sales.toLocaleString()}</td><td>${ymWeekdayStats[ym][wd].customers}</td><td>${groupCount}</td></tr>`;
            }
        });
        html += '</table>';
    });
    document.getElementById('analysis-weekday').innerHTML = html;
}
