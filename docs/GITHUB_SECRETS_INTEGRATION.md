# GitHub Secretsを使ったセキュアなスプレッドシート連携

## 🔐 GitHub Secretsでの安全なAPIキー管理

### 概要
GitHub側でAPIキーを管理し、サーバーレス関数（GitHub Pages + Netlify Functions または Vercel API Routes）を使用してクライアントからAPIキーを完全に隠蔽します。

## 📋 実装手順

### 1. GitHub Secretsの設定

1. GitHubリポジトリの「Settings」タブ
2. 左サイドバーの「Secrets and variables」→「Actions」
3. 「New repository secret」で以下を追加：

```
GOOGLE_SHEETS_API_KEY=your_api_key_here
ALLOWED_SHEET_IDS=your_sheet_id_1,your_sheet_id_2
```

### 2. GitHub Actionsワークフローでの環境変数設定

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Create config file
        run: |
          echo "export const CONFIG = {
            SHEETS_API_ENDPOINT: 'https://api.your-domain.com/sheets',
            ALLOWED_ORIGINS: ['https://yourusername.github.io']
          };" > js/config.js
        env:
          SHEETS_API_KEY: ${{ secrets.GOOGLE_SHEETS_API_KEY }}
          
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

### 3. サーバーレスAPI関数の実装

#### Vercel API Routes の場合

```javascript
// api/sheets.js (Vercel)
export default async function handler(req, res) {
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', 'https://yourusername.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { sheetId, sheetName, data } = req.body;
    
    // 許可されたシートIDかチェック
    const allowedSheetIds = process.env.ALLOWED_SHEET_IDS?.split(',') || [];
    if (!allowedSheetIds.includes(sheetId)) {
      return res.status(403).json({ error: 'Unauthorized sheet ID' });
    }
    
    // Google Sheets APIに送信
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!A:E:append?valueInputOption=RAW&key=${process.env.GOOGLE_SHEETS_API_KEY}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [[data.date, data.sales, data.customers, data.groups, data.transactions]]
      })
    });
    
    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.status}`);
    }
    
    const result = await response.json();
    res.status(200).json({ success: true, result });
    
  } catch (error) {
    console.error('Sheets API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

#### Netlify Functions の場合

```javascript
// netlify/functions/sheets.js
exports.handler = async (event, context) => {
  // CORS設定
  const headers = {
    'Access-Control-Allow-Origin': 'https://yourusername.github.io',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };
  
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }
  
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }
  
  try {
    const { sheetId, sheetName, data } = JSON.parse(event.body);
    
    // 環境変数からAPIキーを取得
    const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
    const allowedSheetIds = process.env.ALLOWED_SHEET_IDS?.split(',') || [];
    
    if (!allowedSheetIds.includes(sheetId)) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ error: 'Unauthorized sheet ID' })
      };
    }
    
    // Google Sheets APIに送信
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!A:E:append?valueInputOption=RAW&key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        values: [[data.date, data.sales, data.customers, data.groups, data.transactions]]
      })
    });
    
    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.status}`);
    }
    
    const result = await response.json();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, result })
    };
    
  } catch (error) {
    console.error('Sheets API Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
```

### 4. フロントエンド側の修正

```javascript
// js/spreadsheet-secure.js
const API_ENDPOINT = 'https://api.your-domain.com/sheets'; // または Netlify Functions URL

/**
 * セキュアなスプレッドシートへのデータ送信
 */
async function sendTodayDataSecure() {
    const config = getSpreadsheetConfigSecure();
    if (!config) return;
    
    showSpreadsheetStatus('📤 今日のデータを送信中...', 'info');
    
    try {
        const todayData = await getTodaysSalesData();
        
        // サーバーレス関数に送信（APIキーは隠蔽）
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sheetId: config.sheetId,
                sheetName: config.sheetName,
                data: {
                    date: todayData.date,
                    sales: todayData.totalSales,
                    customers: todayData.totalCustomers,
                    groups: todayData.uniqueCustomers,
                    transactions: todayData.recordCount
                }
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        showSpreadsheetStatus(`✅ データ送信完了！`, 'success');
        
    } catch (error) {
        console.error('❌ データ送信エラー:', error);
        showSpreadsheetStatus(`❌ データ送信失敗: ${error.message}`, 'error');
    }
}

/**
 * セキュア版のスプレッドシート設定取得（APIキー不要）
 */
function getSpreadsheetConfigSecure() {
    const url = document.getElementById('spreadsheet-url')?.value;
    const sheetName = document.getElementById('sheet-name')?.value || '売上データ';
    
    if (!url) {
        showSpreadsheetStatus('⚠️ スプレッドシートURLを入力してください', 'warning');
        return null;
    }
    
    const sheetId = extractSheetId(url);
    if (!sheetId) {
        showSpreadsheetStatus('❌ 無効なスプレッドシートURLです', 'error');
        return null;
    }
    
    return { url, sheetId, sheetName };
}
```

## 🛡️ セキュリティメリット

### ✅ **完全なAPIキー隠蔽**
- APIキーはGitHub Secretsに保存
- クライアントサイドには一切露出しない
- ブラウザの開発者ツールでも見えない

### ✅ **アクセス制御**
- 許可されたドメインからのみアクセス可能
- 許可されたスプレッドシートIDのみ書き込み可能
- CORS設定で外部からの不正アクセスを防止

### ✅ **監査とログ記録**
- サーバーレス関数でアクセスログを記録可能
- 異常なアクセスパターンの検知
- GitHub Actions のログで設定変更を追跡

## 🚀 デプロイ手順

### Vercel を使用する場合

1. Vercelアカウント作成・GitHub連携
2. 環境変数設定:
   ```
   GOOGLE_SHEETS_API_KEY=your_api_key
   ALLOWED_SHEET_IDS=sheet_id_1,sheet_id_2
   ```
3. `api/sheets.js` ファイルを作成
4. 自動デプロイでAPI URLが生成される

### Netlify を使用する場合

1. Netlifyアカウント作成・GitHub連携
2. 環境変数設定
3. `netlify/functions/sheets.js` ファイルを作成
4. 自動デプロイでFunctions URLが生成される

## 📊 コスト比較

| サービス | 月間リクエスト数 | コスト |
|---------|-----------------|--------|
| Vercel | 100,000リクエスト | 無料枠内 |
| Netlify | 125,000リクエスト | 無料枠内 |
| 現在の実装 | 無制限 | 無料（リスクあり） |

個人・小規模事業での使用であれば、無料枠内で十分利用可能です。

---

この方法により、APIキーを完全に保護しながら、スプレッドシート連携機能を維持できます。