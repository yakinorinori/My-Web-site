import csv
import json
import os
from functools import wraps
import hashlib
from datetime import datetime
# 売上管理Webサイトのバックエンド
from flask import Flask, request, jsonify, session, render_template_string
from flask_cors import CORS
from werkzeug.security import check_password_hash, generate_password_hash

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=[
    'http://localhost:8080', 
    'http://localhost:8081', 
    'http://127.0.0.1:8080',
    'http://192.168.151.100:8082', 
    'http://192.168.151.100:8083',
    'http://192.168.151.190:8080',
    'https://yakinorinori.github.io'  # GitHub Pages HTTPS対応
])
app.secret_key = 'your-secret-key-change-this-in-production'  # 本番環境では変更必須

# ユーザー認証情報（本番環境では外部ファイルまたはデータベースに保存）
USERS = {
    'user1': generate_password_hash('password123', method='pbkdf2:sha256'),
    'user2': generate_password_hash('password456', method='pbkdf2:sha256'), 
    'user3': generate_password_hash('password789', method='pbkdf2:sha256'),
    'kiradan': generate_password_hash('kiradan2024!', method='pbkdf2:sha256')  # 本番用ユーザー
}

# 認証デコレータ
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'logged_in' not in session or not session['logged_in']:
            return jsonify({'error': 'Authentication required'}), 401
        return f(*args, **kwargs)
    return decorated_function

# ヘルスチェックエンドポイント
@app.route('/health', methods=['GET'])
def health_check():
    """サーバーの動作状況を確認するエンドポイント"""
    return jsonify({
        'status': 'healthy',
        'message': 'サーバーは正常に動作しています',
        'timestamp': datetime.now().isoformat()
    }), 200

# ログインページ
LOGIN_HTML = '''
<!DOCTYPE html>
<html>
<head>
    <title>売上管理システム - ログイン</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .login-container { max-width: 400px; margin: 100px auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        h2 { text-align: center; color: #333; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; color: #555; }
        input[type="text"], input[type="password"] { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; box-sizing: border-box; }
        button { width: 100%; padding: 12px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; }
        button:hover { background: #5a6fd8; }
        .error { color: red; margin-top: 10px; text-align: center; }
        .info { background: #e7f3ff; padding: 15px; margin-bottom: 20px; border-radius: 5px; border-left: 4px solid #2196F3; }
    </style>
</head>
<body>
    <div class="login-container">
        <h2>売上管理システム</h2>
        <div class="info">
            <strong>デモユーザー:</strong><br>
            user1 / password123<br>
            user2 / password456<br>
            user3 / password789
        </div>
        <form method="POST">
            <div class="form-group">
                <label for="username">ユーザー名:</label>
                <input type="text" id="username" name="username" required>
            </div>
            <div class="form-group">
                <label for="password">パスワード:</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit">ログイン</button>
            {% if error %}
            <div class="error">{{ error }}</div>
            {% endif %}
        </form>
    </div>
</body>
</html>
'''


@app.route('/')
def index():
    if 'logged_in' not in session or not session['logged_in']:
        return render_template_string(LOGIN_HTML), 200
    
    # ログイン済みの場合、ローカルフロントエンドにリダイレクト
    username = session.get('username', 'ユーザー')
    return '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>ログイン成功</title>
        <meta http-equiv="refresh" content="2;url=http://localhost:8080/">
        <style>
            body { font-family: Arial; text-align: center; padding: 50px; background: #f0f8ff; }
            .success { background: white; padding: 30px; border-radius: 10px; margin: 50px auto; max-width: 400px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
            .btn { background: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px; display: inline-block; }
        </style>
    </head>
    <body>
        <div class="success">
            <h1>🎉 ログイン成功！</h1>
            <p><strong>ユーザー:</strong> ''' + username + '''</p>
            <p>2秒後にシステムに移動します...</p>
            <a href="http://localhost:8080/" class="btn">🚀 今すぐアクセス</a>
        </div>
    </body>
    </html>
    '''

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # JSONデータとフォームデータの両方に対応
        if request.is_json:
            data = request.get_json()
            username = data.get('username')
            password = data.get('password')
        else:
            username = request.form['username']
            password = request.form['password']
        
        if username in USERS and check_password_hash(USERS[username], password):
            session['logged_in'] = True
            session['username'] = username
            
            # JSONリクエストの場合はJSONレスポンスを返す
            if request.is_json:
                return jsonify({
                    'success': True,
                    'message': 'ログインに成功しました',
                    'username': username
                })
            
            # フォームリクエストの場合はHTMLレスポンスを返す
            return '''
            <script>
            alert('ログインに成功しました！');
            // 3秒後にフロントエンドページに移動
            setTimeout(function() {
                window.close();
                window.opener.location.reload();
            }, 1000);
            
            // ウィンドウが閉じられない場合の代替手段
            setTimeout(function() {
                window.location.href = 'http://localhost:8080';
            }, 2000);
            </script>
            <div style="text-align: center; padding: 50px; font-family: Arial;">
                <h2>✅ ログイン成功</h2>
                <p>フロントエンドページに移動しています...</p>
                <p><a href="http://localhost:8080">こちらをクリック</a>してください（自動で移動しない場合）</p>
            </div>
            '''
        else:
            # エラーレスポンス
            if request.is_json:
                return jsonify({
                    'success': False,
                    'message': 'ユーザー名またはパスワードが間違っています'
                }), 401
            return render_template_string(LOGIN_HTML, error='ユーザー名またはパスワードが間違っています')
    
    return render_template_string(LOGIN_HTML)

@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'status': 'logged_out'})

@app.route('/check_auth', methods=['GET'])
def check_auth():
    if 'logged_in' in session and session['logged_in']:
        return jsonify({'authenticated': True, 'username': session.get('username')})
    return jsonify({'authenticated': False}), 401

# sales.jsonから売上データを取得
@app.route('/sales', methods=['GET'])
@login_required
def get_sales():
    if os.path.exists('sales.json'):
        with open('sales.json', 'r', encoding='utf-8') as f:
            sales = json.load(f)
        return jsonify(sales)
    else:
        return jsonify([])

# data/sales.csvから売上データを取得
@app.route('/sales_csv', methods=['GET'])
@login_required
def get_sales_csv():
    # 本番データかデモデータかをクエリパラメータで選択
    data_type = request.args.get('type', 'demo')  # demo | real
    
    if data_type == 'real':
        csv_path = os.path.join('data', 'sales_real.csv')
    else:
        csv_path = os.path.join('data', 'sales.csv')
    
    sales = []
    if os.path.exists(csv_path):
        with open(csv_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                sales.append(row)
    return jsonify(sales)

# data/sales.csvファイルを直接配信（フロントエンド用）
@app.route('/sales.csv', methods=['GET'])
@login_required
def get_sales_csv_file():
    # 本番データかデモデータかをクエリパラメータで選択
    data_type = request.args.get('type', 'demo')  # demo | real
    
    if data_type == 'real':
        csv_path = os.path.join('data', 'sales_real.csv')
        filename = 'sales_real.csv'
    else:
        csv_path = os.path.join('data', 'sales.csv')
        filename = 'sales.csv'
    
    if os.path.exists(csv_path):
        with open(csv_path, 'r', encoding='utf-8') as f:
            csv_content = f.read()
        response = app.response_class(
            csv_content,
            mimetype='text/csv',
            headers={"Content-disposition": f"inline; filename={filename}"}
        )
        return response
    else:
        return "CSVファイルが見つかりません", 404

# Googleスプレッドシートからデータ取得してsales.jsonに保存（仮実装）
@app.route('/fetch_sales', methods=['POST'])
@login_required
def fetch_sales():
    # ここにGoogle Sheets APIでデータ取得する処理を追加
    # 仮のデータ
    sales = [
        {"日付": "2025-08-01", "金額": 10000, "商品": "A"},
        {"日付": "2025-08-02", "金額": 15000, "商品": "B"}
    ]
    with open('sales.json', 'w', encoding='utf-8') as f:
        json.dump(sales, f, ensure_ascii=False, indent=2)
    return jsonify({"status": "success", "count": len(sales)})

# ユーザー設定の保存ディレクトリを作成
USER_SETTINGS_DIR = 'user_settings'
if not os.path.exists(USER_SETTINGS_DIR):
    os.makedirs(USER_SETTINGS_DIR)

def get_user_settings_file(username):
    """ユーザー設定ファイルのパスを取得"""
    return os.path.join(USER_SETTINGS_DIR, f"{username}_settings.json")

# ユーザー設定を保存
@app.route('/api/user-settings', methods=['POST'])
@login_required
def save_user_settings():
    """ユーザーのCSV設定を保存"""
    username = session.get('username')
    data = request.get_json()
    
    if not username:
        return jsonify({'error': 'ユーザー名が取得できません'}), 400
    
    if not data:
        return jsonify({'error': 'データが必要です'}), 400
    
    try:
        # ユーザー設定ファイルに保存
        settings = {
            'username': username,
            'csvSource': data.get('csvSource', './sales.csv'),
            'filters': data.get('filters', {}),
            'updatedAt': datetime.now().isoformat()
        }
        
        settings_file = get_user_settings_file(username)
        with open(settings_file, 'w', encoding='utf-8') as f:
            json.dump(settings, f, ensure_ascii=False, indent=2)
        
        print(f'✅ 設定を保存しました: {username}')
        return jsonify({
            'success': True,
            'message': 'ユーザー設定を保存しました',
            'settings': settings
        }), 200
    
    except Exception as e:
        print(f'❌ 設定保存エラー: {str(e)}')
        return jsonify({'error': f'設定の保存に失敗しました: {str(e)}'}), 500

# ユーザー設定を取得
@app.route('/api/user-settings', methods=['GET'])
@login_required
def load_user_settings():
    """ユーザーのCSV設定を取得"""
    username = session.get('username')
    
    if not username:
        return jsonify({'error': 'ユーザー名が取得できません'}), 400
    
    try:
        settings_file = get_user_settings_file(username)
        
        if os.path.exists(settings_file):
            with open(settings_file, 'r', encoding='utf-8') as f:
                settings = json.load(f)
            print(f'✅ 設定を読み込みました: {username}')
            return jsonify({
                'success': True,
                'settings': settings
            }), 200
        else:
            # デフォルト設定を返す
            default_settings = {
                'username': username,
                'csvSource': './sales.csv',
                'filters': {},
                'createdAt': datetime.now().isoformat()
            }
            print(f'⚠️  デフォルト設定を返します: {username}')
            return jsonify({
                'success': True,
                'settings': default_settings
            }), 200
    
    except Exception as e:
        print(f'❌ 設定読み込みエラー: {str(e)}')
        return jsonify({'error': f'設定の読み込みに失敗しました: {str(e)}'}), 500

# ユーザー設定を削除
@app.route('/api/user-settings', methods=['DELETE'])
@login_required
def delete_user_settings():
    """ユーザーのCSV設定を削除"""
    username = session.get('username')
    
    if not username:
        return jsonify({'error': 'ユーザー名が取得できません'}), 400
    
    try:
        settings_file = get_user_settings_file(username)
        
        if os.path.exists(settings_file):
            os.remove(settings_file)
            print(f'✅ 設定を削除しました: {username}')
            return jsonify({
                'success': True,
                'message': 'ユーザー設定を削除しました'
            }), 200
        else:
            return jsonify({'error': '設定ファイルが見つかりません'}), 404
    
    except Exception as e:
        print(f'❌ 設定削除エラー: {str(e)}')
        return jsonify({'error': f'設定の削除に失敗しました: {str(e)}'}), 500

if __name__ == '__main__':
    # セキュリティ設定
    app.config['SESSION_COOKIE_SECURE'] = True  # HTTPS必須
    app.config['SESSION_COOKIE_HTTPONLY'] = True
    app.config['SESSION_COOKIE_SAMESITE'] = 'None'  # CORS対応
    
    # SSL証明書のパス
    ssl_cert = 'cert.pem'
    ssl_key = 'key.pem'
    
    # SSL証明書が存在しない場合は生成
    if not os.path.exists(ssl_cert) or not os.path.exists(ssl_key):
        print("🔐 SSL証明書を生成中...")
        os.system('openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365 -subj "/C=JP/ST=Tokyo/L=Tokyo/O=MyCompany/CN=localhost"')
    
    print("🔒 セキュア売上管理システム バックエンド (HTTPS)")
    print("📍 アクセス: https://192.168.151.100:3001")
    print("🛡️  認証が有効になっています")
    print("👤 本番ユーザー: kiradan / kiradan2024!")
    
    # HTTPSサーバーとして起動
    app.run(debug=True, port=3001, host='0.0.0.0', ssl_context=(ssl_cert, ssl_key))

