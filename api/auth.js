/**
 * 認証用Vercel Serverless Function
 * ユーザー名とパスワードを環境変数で安全に管理
 */

module.exports = async (req, res) => {
    // CORSヘッダー
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

    // OPTIONSリクエスト（プリフライト）の処理
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // POSTリクエストのみ許可
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { username, password } = req.body;

        // 環境変数から認証情報を取得
        const validUsername = process.env.AUTH_USERNAME;
        const validPassword = process.env.AUTH_PASSWORD;

        // 環境変数が設定されていない場合のエラー
        if (!validUsername || !validPassword) {
            console.error('❌ 認証情報が環境変数に設定されていません');
            return res.status(500).json({ 
                success: false, 
                error: 'Server configuration error' 
            });
        }

        // 認証チェック
        if (username === validUsername && password === validPassword) {
            console.log('✅ 認証成功:', username);
            return res.status(200).json({
                success: true,
                user: username,
                message: 'Authentication successful'
            });
        } else {
            console.log('❌ 認証失敗:', username);
            return res.status(401).json({
                success: false,
                error: 'Invalid username or password'
            });
        }

    } catch (error) {
        console.error('❌ 認証処理エラー:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
