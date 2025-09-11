#!/bin/bash

# Mac mini LaunchDaemon トラブルシューティングスクリプト

set -e

echo "🔧 Mac mini LaunchDaemon トラブルシューティング開始..."

CURRENT_USER=$(whoami)
DAEMON_NAME="com.yakinorinori.webserver"
USER_AGENT_NAME="com.yakinorinori.webserver.user"
DAEMON_PATH="/Library/LaunchDaemons/${DAEMON_NAME}.plist"
USER_AGENT_PATH="/Users/$CURRENT_USER/Library/LaunchAgents/${USER_AGENT_NAME}.plist"

echo "👤 現在のユーザー: $CURRENT_USER"

# 1. 既存のサービスを停止・削除
echo ""
echo "🛑 既存のサービスを停止中..."

# LaunchDaemonの停止・削除
if [ -f "$DAEMON_PATH" ]; then
    echo "LaunchDaemonを停止中..."
    sudo launchctl unload "$DAEMON_PATH" 2>/dev/null || true
    sudo rm -f "$DAEMON_PATH"
    echo "✅ LaunchDaemon削除完了"
else
    echo "LaunchDaemonは存在しません"
fi

# LaunchAgentの停止・削除
if [ -f "$USER_AGENT_PATH" ]; then
    echo "LaunchAgentを停止中..."
    launchctl unload "$USER_AGENT_PATH" 2>/dev/null || true
    rm -f "$USER_AGENT_PATH"
    echo "✅ LaunchAgent削除完了"
else
    echo "LaunchAgentは存在しません"
fi

# 2. 既存のプロセスを停止
echo ""
echo "🔍 既存のプロセスを確認・停止中..."
pkill -f "mac-mini-startup.sh" 2>/dev/null || true
pkill -f "python.*app.py" 2>/dev/null || true
echo "✅ 既存プロセス停止完了"

# 3. ログディレクトリを作成
LOG_DIR="/Users/$CURRENT_USER/workspace/logs"
mkdir -p "$LOG_DIR"
echo "📄 ログディレクトリ作成: $LOG_DIR"

# 4. 手動でサーバーを起動してテスト
echo ""
echo "🧪 手動でサーバー起動テスト..."
WORKSPACE_DIR="/Users/$CURRENT_USER/workspace"

if [ -f "$WORKSPACE_DIR/scripts/mac-mini-startup.sh" ]; then
    echo "起動スクリプトを実行中..."
    cd "$WORKSPACE_DIR"
    timeout 30 ./scripts/mac-mini-startup.sh || true
    echo "✅ 手動起動テスト完了"
else
    echo "❌ 起動スクリプトが見つかりません: $WORKSPACE_DIR/scripts/mac-mini-startup.sh"
    exit 1
fi

# 5. LaunchAgentをセットアップ（より安全）
echo ""
echo "🔧 LaunchAgent（ユーザーレベル）をセットアップ中..."

# LaunchAgentsディレクトリを作成
mkdir -p "/Users/$CURRENT_USER/Library/LaunchAgents"

# ユーザー用のplistファイルをコピー
cp "scripts/${USER_AGENT_NAME}.plist" "$USER_AGENT_PATH"
echo "✅ LaunchAgentファイルをコピー完了"

# LaunchAgentを読み込み
launchctl load "$USER_AGENT_PATH"
echo "✅ LaunchAgent読み込み完了"

# 6. 動作確認
echo ""
echo "🔍 動作確認中..."
sleep 10

# プロセス確認
if pgrep -f "python.*app.py" > /dev/null; then
    echo "✅ Pythonサーバープロセスが実行中"
else
    echo "⚠️  Pythonサーバープロセスが見つかりません"
fi

# ポート確認
if lsof -i :3001 > /dev/null 2>&1; then
    echo "✅ ポート3001が使用中"
else
    echo "⚠️  ポート3001が使用されていません"
fi

# HTTP確認
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/health | grep -q "200"; then
    echo "✅ HTTPヘルスチェック成功"
else
    echo "⚠️  HTTPヘルスチェック失敗"
fi

echo ""
echo "📋 セットアップ完了情報:"
echo "   LaunchAgent: $USER_AGENT_PATH"
echo "   ログファイル: $LOG_DIR/startup.log"
echo "   エラーログ: $LOG_DIR/startup.error.log"
echo ""
echo "📊 管理コマンド:"
echo "   ステータス確認: launchctl list | grep yakinorinori"
echo "   停止: launchctl unload '$USER_AGENT_PATH'"
echo "   開始: launchctl load '$USER_AGENT_PATH'"
echo "   ログ確認: tail -f '$LOG_DIR/startup.log'"
