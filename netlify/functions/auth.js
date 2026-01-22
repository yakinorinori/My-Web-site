/**
 * 認証用Netlify Function
 * ユーザー名とパスワードを環境変数で安全に管理
 */

exports.handler = async (event, context) => {
    // CORSヘッダー
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // OPTIONSリクエスト（プリフライト）の処理
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // POSTリクエストのみ許可
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        const { username, password } = JSON.parse(event.body);

        // 環境変数から認証情報を取得
        const validUsername = process.env.AUTH_USERNAME;
        const validPassword = process.env.AUTH_PASSWORD;

        // 環境変数が設定されていない場合のエラー
        if (!validUsername || !validPassword) {
            console.error('❌ 認証情報が環境変数に設定されていません');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    success: false, 
                    error: 'Server configuration error' 
                })
            };
        }

        // 認証チェック
        if (username === validUsername && password === validPassword) {
            console.log('✅ 認証成功:', username);
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    user: username,
                    message: 'Authentication successful'
                })
            };
        } else {
            console.log('❌ 認証失敗:', username);
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Invalid username or password'
                })
            };
        }

    } catch (error) {
        console.error('❌ 認証処理エラー:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Internal server error'
            })
        };
    }
};
