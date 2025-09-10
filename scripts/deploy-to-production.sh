#!/bin/bash

# GitHub から Mac mini への自動デプロイスクリプト
# 使用方法: ./deploy-to-production.sh [branch-name]

set -e  # エラー時に停止

BRANCH=${1:-main}
PROJECT_NAME="My-Web-site"
MAC_MINI_USER="akinoriyamaguchi"
MAC_MINI_HOST="192.168.151.100"
REPO_URL="https://github.com/yourusername/My-Web-site.git"  # 実際のリポジトリURLに変更
DEPLOY_PATH="/Users/${MAC_MINI_USER}/個人事業/${PROJECT_NAME}"

echo "🚀 Mac mini 自動デプロイ開始"
echo "ブランチ: $BRANCH"
echo "対象サーバー: $MAC_MINI_HOST"
echo "デプロイパス: $DEPLOY_PATH"
echo ""

# Mac mini 接続確認
echo "📡 Mac mini 接続確認..."
if ! ping -c 1 $MAC_MINI_HOST >/dev/null 2>&1; then
    echo "❌ Mac mini に接続できません ($MAC_MINI_HOST)"
    exit 1
fi

if ! ssh -o ConnectTimeout=5 -o BatchMode=yes ${MAC_MINI_USER}@${MAC_MINI_HOST} exit 2>/dev/null; then
    echo "❌ SSH接続に失敗しました"
    exit 1
fi

echo "✅ 接続確認完了"

# Mac mini でのデプロイ実行
echo ""
echo "🔄 Mac mini でデプロイ実行中..."

ssh ${MAC_MINI_USER}@${MAC_MINI_HOST} << EOF
set -e

echo "📂 プロジェクトディレクトリ確認..."
if [ ! -d "$DEPLOY_PATH" ]; then
    echo "📥 リポジトリをクローン中..."
    mkdir -p $(dirname "$DEPLOY_PATH")
    cd $(dirname "$DEPLOY_PATH")
    git clone $REPO_URL $PROJECT_NAME
else
    echo "🔄 既存リポジトリを更新中..."
    cd "$DEPLOY_PATH"
    git fetch origin
    git reset --hard origin/$BRANCH
    git clean -fd
fi

cd "$DEPLOY_PATH"

echo "📦 依存関係インストール中..."
if [ -f "backend/requirements.txt" ]; then
    pip3 install -r backend/requirements.txt
fi

echo "🛑 既存サーバー停止中..."
pkill -f 'python3.*app.py' || true
pkill -f 'http.server' || true
sleep 2

echo "🔧 実行権限設定..."
chmod +x scripts/*.sh

echo "🚀 サーバー起動中..."
cd "$DEPLOY_PATH"
./scripts/start-all-servers.sh

echo "✅ デプロイ完了！"
echo "🌐 フロントエンド: http://$MAC_MINI_HOST:8083"
echo "🔧 バックエンド: http://$MAC_MINI_HOST:3001"
EOF

echo ""
echo "🎉 デプロイ完了！"
echo ""
echo "📋 確認コマンド:"
echo "  ./scripts/monitor-servers.sh"
echo "  ./scripts/test-all-systems.sh"
echo ""
echo "🔗 アクセスURL:"
echo "  http://$MAC_MINI_HOST:8083"
