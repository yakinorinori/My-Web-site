#!/bin/bash
# セキュアな売上管理システム起動スクリプト

echo "🔒 セキュア売上管理システムを起動しています..."

# 既存のプロセスを停止
echo "🛑 既存のプロセスを停止中..."
pkill -f "python.*app.py" 2>/dev/null || true
pkill -f "python.*http.server.*8080" 2>/dev/null || true
sleep 2

# 仮想環境の作成と有効化
echo "🐍 Python仮想環境を設定中..."
cd backend
if [ ! -d "venv" ]; then
    echo "📦 仮想環境を作成中..."
    python3 -m venv venv
fi

echo "🔄 仮想環境を有効化中..."
source venv/bin/activate

# 必要なPythonパッケージをインストール
echo "📦 依存関係をインストール中..."
pip install flask flask-cors werkzeug

# バックエンドサーバーを起動（セキュアモード）
echo "🚀 バックエンドサーバーを起動中..."
python app.py &
BACKEND_PID=$!

# 少し待ってからフロントエンドサーバーを起動
sleep 3
echo "🌐 フロントエンドサーバーを起動中..."
cd ../frontend

# ポート8080が使用中の場合は8081を使用
PORT=8080
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  ポート8080が使用中です。ポート8081を使用します。"
    PORT=8081
fi

python3 -m http.server $PORT &
FRONTEND_PID=$!

echo ""
echo "✅ システムが正常に起動しました！"
echo ""
echo "🔗 アクセス方法:"
echo "   1. ブラウザで http://localhost:$PORT にアクセス"
echo "   2. ログインページで認証を行ってください"
echo ""
echo "👥 デモユーザー:"
echo "   user1 / password123"
echo "   user2 / password456" 
echo "   user3 / password789"
echo ""
echo "🛡️  セキュリティ機能:"
echo "   ✓ ユーザー認証"
echo "   ✓ セッション管理"
echo "   ✓ データアクセス制御"
echo "   ✓ CSRF対策"
echo ""
echo "🛑 システムを停止するには Ctrl+C を押してください"

# シグナルハンドラー設定
trap 'echo "🛑 システムを停止中..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; deactivate 2>/dev/null; exit' INT

# バックグラウンドプロセスの終了を待機
wait
