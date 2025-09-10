# セキュリティ設定ファイル
import os
from werkzeug.security import generate_password_hash

# 本番環境用設定
class Config:
    # セッション用秘密鍵（本番環境では環境変数から取得）
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key-change-this-in-production-2025'
    
    # セッション設定
    SESSION_COOKIE_SECURE = True  # HTTPS環境でのみCookieを送信
    SESSION_COOKIE_HTTPONLY = True  # JavaScriptからCookieにアクセス不可
    SESSION_COOKIE_SAMESITE = 'Strict'  # CSRF攻撃対策
    
    # セキュリティヘッダー
    SECURITY_HEADERS = {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
    }

# ユーザー認証情報
# 本番環境では外部ファイルまたはデータベースに保存
USERS = {
    'manager': generate_password_hash('SecurePass123!'),
    'analyst': generate_password_hash('DataView456!'),
    'viewer': generate_password_hash('ReadOnly789!')
}

# 許可IPアドレス（オプション）
ALLOWED_IPS = [
    '127.0.0.1',    # localhost
    '192.168.1.0/24',  # ローカルネットワーク例
    # 必要に応じて追加
]

# レート制限設定
RATE_LIMIT = {
    'login_attempts': 5,  # 5回までログイン試行可能
    'time_window': 3600   # 1時間のウィンドウ
}
