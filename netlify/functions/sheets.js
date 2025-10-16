/**
 * Netlify Functions: Google Sheets API Proxy
 * 
 * API Keyをサーバー側で安全に管理し、
 * クライアント側からの Google Sheets API 呼び出しをプロキシします
 */

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
        const { action, sheetId, sheetName, range, values } = body;

        // 環境変数からAPI Keyを取得
        const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
        
        if (!apiKey) {
            console.error('❌ GOOGLE_SHEETS_API_KEY environment variable is not set');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    success: false,
                    error: 'Server configuration error: API Key not configured' 
                })
            };
        }

        if (!sheetId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    success: false,
                    error: 'sheetId is required' 
                })
            };
        }

        console.log(`📊 Sheets API: ${action} - Sheet: ${sheetId}`);

        // アクションに応じて処理を分岐
        switch (action) {
            case 'test':
                return await testConnection(sheetId, apiKey, headers);
            
            case 'read':
                return await readData(sheetId, sheetName || '売上データ', range || 'A:E', apiKey, headers);
            
            case 'append':
                return await appendData(sheetId, sheetName || '売上データ', values, apiKey, headers);
            
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
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                success: false,
                error: error.message || 'Internal server error' 
            })
        };
    }
};

/**
 * 接続テスト: スプレッドシートの基本情報を取得
 */
async function testConnection(sheetId, apiKey, headers) {
    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?key=${apiKey}`;
        const response = await fetch(url);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        const title = data.properties?.title || '不明';

        console.log(`✅ Connection test passed: ${title}`);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                title,
                sheetCount: data.sheets?.length || 0
            })
        };

    } catch (error) {
        console.error('❌ Test connection error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: error.message
            })
        };
    }
}

/**
 * データ読み込み
 */
async function readData(sheetId, sheetName, range, apiKey, headers) {
    try {
        const fullRange = `${sheetName}!${range}`;
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(fullRange)}?key=${apiKey}`;
        
        const response = await fetch(url);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `HTTP ${response.status}`);
        }

        const data = await response.json();

        console.log(`✅ Read ${data.values?.length || 0} rows from ${sheetName}`);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                values: data.values || [],
                range: data.range
            })
        };

    } catch (error) {
        console.error('❌ Read data error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: error.message
            })
        };
    }
}

/**
 * データ追加
 */
async function appendData(sheetId, sheetName, values, apiKey, headers) {
    try {
        if (!values || !Array.isArray(values)) {
            throw new Error('Invalid values: must be an array');
        }

        const range = `${sheetName}!A:E`;
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=RAW&key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ values })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `HTTP ${response.status}`);
        }

        const result = await response.json();

        console.log(`✅ Appended ${values.length} rows to ${sheetName}`);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                updates: result.updates
            })
        };

    } catch (error) {
        console.error('❌ Append data error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: error.message
            })
        };
    }
}