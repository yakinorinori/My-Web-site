/**
 * Netlify Functions: Google Sheets API Proxy
 * 
 * サービスアカウント認証を使用して、
 * クライアント側からの Google Sheets API 呼び出しをプロキシします
 */

const { google } = require('googleapis');

// Google Sheets APIクライアントを初期化
async function getAuthClient() {
    // 環境変数からサービスアカウントのJSON文字列を取得
    const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    
    if (!serviceAccountJson) {
        throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON environment variable is not set');
    }

    let credentials;
    try {
        credentials = JSON.parse(serviceAccountJson);
    } catch (error) {
        throw new Error('Invalid GOOGLE_SERVICE_ACCOUNT_JSON format: ' + error.message);
    }

    // OAuth2クライアントを作成
    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    return auth;
}

// Google Sheets APIクライアントを取得
async function getSheetsClient() {
    const auth = await getAuthClient();
    return google.sheets({ version: 'v4', auth });
}

exports.handler = async (event, context) => {
    // CORSヘッダー設定
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Content-Type': 'application/json'
    };

    // OPTIONSリクエスト（プリフライト）対応
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'CORS preflight' })
        };
    }

    // POSTメソッドのみ受け付け
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        // リクエストボディをパース
        const body = JSON.parse(event.body || '{}');
        const { action, sheetName, range, values } = body;

        // 🔒 sheetIdは環境変数から取得（安全）
        const sheetId = process.env.GOOGLE_SHEET_ID;

        console.log('📥 Request received:', { action, sheetName });

        if (!sheetId) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    success: false,
                    error: 'GOOGLE_SHEET_ID environment variable is not set' 
                })
            };
        }

        console.log(`📊 Sheets API: ${action} - Sheet: ${sheetId}`);

        // Google Sheets APIクライアントを取得
        const sheets = await getSheetsClient();

        // アクションに応じて処理を分岐
        switch (action) {
            case 'test':
                return await testConnection(sheets, sheetId, headers);
            
            case 'read':
                return await readData(sheets, sheetId, sheetName || '売上データ', range || 'A:E', headers);
            
            case 'append':
                return await appendData(sheets, sheetId, sheetName || '売上データ', values, headers);
            
            default:
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ 
                        success: false,
                        error: `Unknown action: ${action}` 
                    })
                };
        }

    } catch (error) {
        console.error('❌ Function error:', error);
        
        // 環境変数設定エラーの場合は詳細メッセージを返す
        if (error.message.includes('GOOGLE_SERVICE_ACCOUNT_JSON')) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    success: false,
                    error: 'サーバー設定エラー: Google認証情報が設定されていません。',
                    details: error.message
                })
            };
        }
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                success: false,
                error: error.message || 'Internal server error',
                details: error.stack
            })
        };
    }
};

/**
 * 接続テスト: スプレッドシートの基本情報を取得
 */
async function testConnection(sheets, sheetId, headers) {
    try {
        console.log('🔍 Testing connection to spreadsheet:', sheetId);
        
        const response = await sheets.spreadsheets.get({
            spreadsheetId: sheetId
        });

        const title = response.data.properties?.title || '不明';
        const sheetCount = response.data.sheets?.length || 0;

        console.log(`✅ Connection test passed: ${title} (${sheetCount} sheets)`);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                title,
                sheetCount
            })
        };

    } catch (error) {
        console.error('❌ Test connection error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: error.message,
                details: error.stack
            })
        };
    }
}

/**
 * データ読み込み
 */
async function readData(sheets, sheetId, sheetName, range, headers) {
    try {
        const fullRange = `${sheetName}!${range}`;
        
        console.log('📖 Reading data from:', fullRange);
        
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: fullRange
        });

        const values = response.data.values || [];

        console.log(`✅ Read ${values.length} rows from ${sheetName}`);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                values,
                range: response.data.range
            })
        };

    } catch (error) {
        console.error('❌ Read data error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: error.message,
                details: error.stack
            })
        };
    }
}

/**
 * データ追加
 */
async function appendData(sheets, sheetId, sheetName, values, headers) {
    try {
        console.log('📊 Append data request:', { sheetId, sheetName, values });
        
        if (!values || !Array.isArray(values)) {
            throw new Error('Invalid values: must be an array');
        }

        const range = `${sheetName}!A:E`;

        console.log('📡 Calling Google Sheets API to append data...');

        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: range,
            valueInputOption: 'RAW',
            requestBody: {
                values: values
            }
        });

        console.log('✅ Successfully appended data:', response.data.updates);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                updates: response.data.updates
            })
        };

    } catch (error) {
        console.error('❌ Append data error:', error);
        console.error('Error details:', error.stack);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: error.message,
                details: error.stack
            })
        };
    }
}