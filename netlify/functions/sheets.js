/**
 * Netlify Functions - セキュアなGoogleスプレッドシート連携
 * APIキーはNetlify環境変数で管理
 */

exports.handler = async (event, context) => {
  // CORS設定
  const headers = {
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || 'https://yakinorinori.github.io',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400'
  };
  
  // プリフライトリクエスト対応
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }
  
  // POSTメソッドのみ許可
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }
  
  try {
    console.log('📊 Spreadsheet API request received');
    
    // リクエストボディを解析
    const { sheetId, sheetName, data } = JSON.parse(event.body);
    
    // 必須パラメータのチェック
    if (!sheetId || !data) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Missing required parameters',
          required: ['sheetId', 'data']
        })
      };
    }
    
    // 環境変数からAPIキーを取得
    const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
    if (!apiKey) {
      console.error('❌ GOOGLE_SHEETS_API_KEY not configured');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Server configuration error' })
      };
    }
    
    // 許可されたシートIDの確認
    const allowedSheetIds = process.env.ALLOWED_SHEET_IDS?.split(',') || [];
    if (allowedSheetIds.length > 0 && !allowedSheetIds.includes(sheetId)) {
      console.warn('⚠️ Unauthorized sheet ID attempt:', sheetId);
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ error: 'Unauthorized sheet ID' })
      };
    }
    
    // Google Sheets APIエンドポイント構築
    const range = `${sheetName || '売上データ'}!A:E`;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}:append?valueInputOption=RAW&key=${apiKey}`;
    
    // データを配列形式に変換
    const values = [[
      data.date || '',
      data.sales || 0,
      data.customers || 0,
      data.groups || 0,
      data.transactions || 0
    ]];
    
    console.log('📤 Sending data to Google Sheets:', {
      sheetId: sheetId.substring(0, 10) + '...',
      range,
      dataCount: values[0].length
    });
    
    // Google Sheets APIに送信
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Google Sheets API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ 
          error: 'Google Sheets API error',
          details: errorData.error?.message || response.statusText
        })
      };
    }
    
    const result = await response.json();
    console.log('✅ Data successfully sent to Google Sheets');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Data successfully appended to spreadsheet',
        updatedRange: result.updates?.updatedRange,
        updatedRows: result.updates?.updatedRows
      })
    };
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: 'An unexpected error occurred while processing your request'
      })
    };
  }
};