#!/bin/bash

# Mac mini プロダクション環境セットアップスクリプト

set -e

REPO_URL="https://github.com/yakinorinori/My-Web-site.git"
PROJECT_DIR="$HOME/個人事業/My-Web-site"
FRONTEND_PORT=8083
BACKEND_PORT=3001

echo "🏭 Mac mini プロダクション環境セットアップ開始"
echo ""

# 1. 必要なツールの確認・インストール
echo "📦 必要なツールを確認中..."

# Python3 確認
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 が見つかりません。インストールしてください。"
    exit 1
fi

# Git 確認
if ! command -v git &> /dev/null; then
    echo "❌ Git が見つかりません。Xcode Command Line Tools をインストールしてください。"
    echo "実行: xcode-select --install"
    exit 1
fi

echo "✅ 必要なツール確認完了"

# 2. プロジェクトディレクトリのセットアップ
echo ""
echo "📁 プロジェクトディレクトリセットアップ中..."

if [ -d "$PROJECT_DIR" ]; then
    echo "🔄 既存プロジェクトを更新中..."
    cd "$PROJECT_DIR"
    git pull origin main
else
    echo "📥 プロジェクトをクローン中..."
    mkdir -p $(dirname "$PROJECT_DIR")
    cd $(dirname "$PROJECT_DIR")
    git clone "$REPO_URL" "My-Web-site"
    cd "$PROJECT_DIR"
fi

# 3. Python依存関係のインストール
echo ""
echo "🐍 Python依存関係をインストール中..."
pip3 install -r backend/requirements.txt

# 4. 実行権限の設定
echo ""
echo "🔐 実行権限を設定中..."
chmod +x scripts/*.sh

# 5. システムサービスとしての登録（オプション）
echo ""
echo "⚙️ システム設定を確認中..."

# ファイアウォール確認
FIREWALL_STATE=$(sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate)
if [[ "$FIREWALL_STATE" == *"enabled"* ]]; then
    echo "⚠️ ファイアウォールが有効です。必要に応じて無効化してください。"
fi

# SSH確認
SSH_STATE=$(sudo systemsetup -getremotelogin)
if [[ "$SSH_STATE" == *"Off"* ]]; then
    echo "⚠️ SSH が無効です。リモートアクセスには有効化が必要です。"
fi

# 6. 環境設定ファイルの作成
echo ""
echo "📄 環境設定ファイルを作成中..."

cat > .env << EOF
# Mac mini プロダクション環境設定
MAC_MINI_HOST=192.168.151.100
MAC_MINI_USER=akinoriyamaguchi
FRONTEND_PORT=$FRONTEND_PORT
BACKEND_PORT=$BACKEND_PORT
FLASK_ENV=production
FLASK_SECRET_KEY=$(openssl rand -hex 32)
EOF

echo "✅ 環境設定ファイル作成完了"

# 7. ログディレクトリの作成
echo ""
echo "📝 ログディレクトリを作成中..."
mkdir -p logs

# 8. サーバー起動テスト
echo ""
echo "🚀 サーバー起動テスト中..."

# 既存プロセスの停止
pkill -f 'python3.*app.py' || true
pkill -f 'http.server' || true
sleep 2

# サーバー起動
echo "フロントエンドサーバー起動中..."
cd frontend
python3 -m http.server $FRONTEND_PORT --bind 0.0.0.0 > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > ../logs/frontend.pid

cd ../backend
echo "バックエンドサーバー起動中..."
python3 app.py > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > ../logs/backend.pid

cd ..

echo "サーバー起動完了！"
echo ""

# 9. 動作確認
echo "🧪 動作確認中..."
sleep 3

# フロントエンド確認
if curl -s "http://localhost:$FRONTEND_PORT" > /dev/null; then
    echo "✅ フロントエンドサーバー: http://192.168.151.100:$FRONTEND_PORT"
else
    echo "❌ フロントエンドサーバーが応答しません"
fi

# バックエンド確認
if curl -s "http://localhost:$BACKEND_PORT/health" > /dev/null; then
    echo "✅ バックエンドサーバー: http://192.168.151.100:$BACKEND_PORT"
else
    echo "❌ バックエンドサーバーが応答しません"
fi

echo ""
echo "🎉 Mac mini プロダクション環境セットアップ完了！"
echo ""
echo "📋 次のステップ:"
echo "1. ブラウザで http://192.168.151.100:$FRONTEND_PORT にアクセス"
echo "2. 監視: ./scripts/monitor-servers.sh"
echo "3. テスト: ./scripts/test-all-systems.sh"
echo ""
echo "📂 ログファイル:"
echo "- フロントエンド: $PROJECT_DIR/logs/frontend.log"
echo "- バックエンド: $PROJECT_DIR/logs/backend.log"
