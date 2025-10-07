# セキュアなGoogleスプレッドシート連携の実装方法

## 🔒 本番環境での推奨アーキテクチャ

### サーバーサイドプロキシの実装例

```javascript
// backend/sheets-proxy.js (Node.js + Express)
const express = require('express');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const app = express();

// 環境変数からAPIキーを取得
const SHEETS_API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || [];

// CORS設定
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (ALLOWED_ORIGINS.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(express.json());

// スプレッドシートにデータを追加
app.post('/api/sheets/append', async (req, res) => {
    try {
        const { sheetId, sheetName, data } = req.body;
        
        // 入力値検証
        if (!sheetId || !data) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Google Sheets APIを呼び出し
        const doc = new GoogleSpreadsheet(sheetId);
        await doc.useApiKey(SHEETS_API_KEY);
        await doc.loadInfo();
        
        const sheet = doc.sheetsByTitle[sheetName] || doc.sheetsByIndex[0];
        await sheet.addRow(data);
        
        res.json({ success: true, message: 'Data added successfully' });
        
    } catch (error) {
        console.error('Sheets API Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(3000, () => {
    console.log('Sheets proxy server running on port 3000');
});
```

### フロントエンド側の修正

```javascript
// js/spreadsheet-secure.js
async function sendTodayDataSecure() {
    const config = getSpreadsheetConfigSecure();
    if (!config) return;
    
    showSpreadsheetStatus('📤 今日のデータを送信中...', 'info');
    
    try {
        const todayData = await getTodaysSalesData();
        
        // サーバーサイドプロキシに送信
        const response = await fetch('/api/sheets/append', {
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
```

## 🔐 OAuth認証の実装例

```javascript
// OAuth 2.0を使用した安全な認証
async function initGoogleAuth() {
    await gapi.load('auth2', async () => {
        const authInstance = await gapi.auth2.init({
            client_id: 'YOUR_OAUTH_CLIENT_ID.googleusercontent.com',
            scope: 'https://www.googleapis.com/auth/spreadsheets'
        });
        
        const user = authInstance.currentUser.get();
        if (user.isSignedIn()) {
            const authToken = user.getAuthResponse().access_token;
            // このトークンを使用してAPI呼び出し
        }
    });
}
```

## 🌐 環境変数の設定

```bash
# .env (本番環境)
GOOGLE_SHEETS_API_KEY=your_production_api_key
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
NODE_ENV=production

# .env.local (開発環境)
GOOGLE_SHEETS_API_KEY=your_development_api_key
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
NODE_ENV=development
```

## 🛡️ セキュリティベストプラクティス

### 1. API キーの管理
- 本番用と開発用のAPIキーを分離
- 定期的なローテーション（月1回以上）
- 使用制限の厳格な設定

### 2. アクセス制御
- IP制限またはリファラー制限
- 認証されたユーザーのみアクセス許可
- レート制限の実装

### 3. データ検証
- 入力値の厳格なバリデーション
- SQLインジェクション対策
- XSS攻撃対策

### 4. ログ記録
- API使用状況の監視
- 異常なアクセスパターンの検知
- セキュリティインシデントの追跡

## 🚀 本番環境移行チェックリスト

- [ ] サーバーサイドプロキシの実装
- [ ] 環境変数でのAPIキー管理
- [ ] OAuth認証の実装（推奨）
- [ ] CORS設定の確認
- [ ] API制限設定の確認
- [ ] ログ記録システムの実装
- [ ] セキュリティテストの実施
- [ ] ドキュメントの更新

---

**⚠️ 重要:** 現在のクライアントサイド実装はテスト目的のみです。本番環境では必ずサーバーサイドプロキシまたはOAuth認証を実装してください。