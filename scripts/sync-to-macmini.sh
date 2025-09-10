#!/bin/bash

# MacBook から Mac mini へのプロジェクト同期スクリプト
# 使用方法: ./sync-to-macmini.sh

echo "📡 MacBook → Mac mini プロジェクト同期開始..."

# 設定（実際の値に変更してください）
MAC_MINI_IP="192.168.151.100"
MAC_MINI_USER="akinoriyamaguchi"  # Mac miniの実際のユーザー名
PROJECT_PATH="/Users/x21095xx/個人事業/My-Web-site/"
REMOTE_PROJECT_PATH="/Users/akinoriyamaguchi/個人事業/My-Web-site/"

# 設定確認
echo "🔧 同期設定:"
echo "   Mac mini IP: $MAC_MINI_IP"
echo "   Mac mini ユーザー: $MAC_MINI_USER"
echo "   ローカルパス: $PROJECT_PATH"
echo "   リモートパス: $REMOTE_PROJECT_PATH"
echo ""

# Mac mini接続確認
echo "🔍 Mac mini接続確認中..."
if ping -c 1 $MAC_MINI_IP > /dev/null 2>&1; then
    echo "✅ Mac mini に接続可能"
else
    echo "❌ Mac mini に接続できません"
    echo "   - IPアドレスを確認: $MAC_MINI_IP"
    echo "   - Wi-Fi接続を確認"
    echo "   - Mac miniのネットワーク設定を確認"
    exit 1
fi

# SSH接続確認
echo "🔐 SSH接続確認中..."
if ssh -o ConnectTimeout=5 -o BatchMode=yes macmini exit > /dev/null 2>&1; then
    echo "✅ SSH接続可能"
else
    echo "❌ SSH接続できません"
    echo "   - SSH設定確認: cat ~/.ssh/config"
    echo "   - 手動接続テスト: ssh macmini"
    exit 1
fi

# プロジェクト同期
echo "📂 プロジェクトファイル同期中..."
rsync -avz --delete \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude 'logs' \
    --exclude '__pycache__' \
    --exclude '.DS_Store' \
    "$PROJECT_PATH" \
    "macmini:$REMOTE_PROJECT_PATH"

if [ $? -eq 0 ]; then
    echo "✅ ファイル同期完了"
else
    echo "❌ ファイル同期失敗"
    exit 1
fi

# Mac miniでサーバー再起動
echo "🚀 Mac miniでサーバー再起動中..."
ssh macmini "cd '$REMOTE_PROJECT_PATH' && ./stop-server.sh 2>/dev/null || true && ./start-production-server.sh"

echo ""
echo "🎯 同期完了！"
echo "   - Mac miniサーバー: http://$MAC_MINI_IP:8080"
echo "   - 管理画面: http://$MAC_MINI_IP:3001"
echo ""
echo "📋 確認方法:"
echo "   curl http://$MAC_MINI_IP:8080"
echo "   open http://$MAC_MINI_IP:8080"
