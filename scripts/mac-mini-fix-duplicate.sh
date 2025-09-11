#!/bin/bash

# Mac mini 重複実行問題修正スクリプト

set -e

echo "🔧 Mac mini 重複実行問題修正中..."

CURRENT_USER=$(whoami)
USER_AGENT_NAME="com.yakinorinori.webserver.user"
USER_AGENT_PATH="/Users/$CURRENT_USER/Library/LaunchAgents/${USER_AGENT_NAME}.plist"
WORKSPACE_DIR="/Users/$CURRENT_USER/workspace"
LOG_DIR="$WORKSPACE_DIR/logs"
PID_FILE="$LOG_DIR/backend.pid"

echo "👤 現在のユーザー: $CURRENT_USER"

# 1. LaunchAgentを停止
echo "🛑 LaunchAgentを停止中..."
if [ -f "$USER_AGENT_PATH" ]; then
    launchctl unload "$USER_AGENT_PATH" 2>/dev/null || true
    echo "✅ LaunchAgent停止完了"
else
    echo "LaunchAgentファイルが存在しません"
fi

# 2. 重複プロセスを全て停止
echo "🧹 重複プロセスをクリーンアップ中..."
pkill -f "mac-mini-startup.sh" 2>/dev/null || true
pkill -f "python.*app.py" 2>/dev/null || true
sleep 3

# 3. PIDファイルをクリア
echo "🗑️  PIDファイルをクリア..."
rm -f "$PID_FILE"

# 4. ログファイルをバックアップ
echo "📄 ログファイルをバックアップ..."
if [ -f "$LOG_DIR/startup.log" ]; then
    mv "$LOG_DIR/startup.log" "$LOG_DIR/startup.log.$(date +%Y%m%d_%H%M%S)"
fi
if [ -f "$LOG_DIR/startup.error.log" ]; then
    mv "$LOG_DIR/startup.error.log" "$LOG_DIR/startup.error.log.$(date +%Y%m%d_%H%M%S)"
fi

# 5. 手動で一度だけサーバーを起動
echo "🚀 サーバーを手動で起動..."
cd "$WORKSPACE_DIR"
./scripts/mac-mini-startup.sh

# 6. 起動確認
sleep 5
if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p "$PID" > /dev/null 2>&1; then
        echo "✅ サーバー起動成功 (PID: $PID)"
    else
        echo "❌ サーバー起動失敗"
        exit 1
    fi
else
    echo "❌ PIDファイルが作成されませんでした"
    exit 1
fi

# 7. HTTPテスト
echo "🧪 HTTP接続テスト..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/health | grep -q "200"; then
    echo "✅ HTTP接続成功"
else
    echo "❌ HTTP接続失敗"
    exit 1
fi

# 8. 修正されたLaunchAgentを再読み込み
echo "🔄 修正されたLaunchAgentを読み込み..."
launchctl load "$USER_AGENT_PATH"
echo "✅ LaunchAgent再読み込み完了"

echo ""
echo "🎉 修正完了！"
echo ""
echo "📊 現在の状況:"
echo "   サーバーPID: $(cat $PID_FILE)"
echo "   HTTP状態: http://localhost:3001/health"
echo "   LaunchAgent: $(launchctl list | grep yakinorinori | awk '{print $3}' || echo 'Not found')"
echo ""
echo "📋 管理コマンド:"
echo "   ステータス: launchctl list | grep yakinorinori"
echo "   ログ確認: tail -f $LOG_DIR/startup.log"
echo "   プロセス確認: ps -p \$(cat $PID_FILE)"
