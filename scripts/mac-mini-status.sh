#!/bin/bash

# Mac mini サーバー状況確認スクリプト

echo "📊 Mac mini サーバー状況レポート"
echo "======================================"
echo "日時: $(date)"
echo ""

CURRENT_USER=$(whoami)
WORKSPACE_DIR="/Users/$CURRENT_USER/workspace"
LOG_DIR="$WORKSPACE_DIR/logs"
PID_FILE="$LOG_DIR/backend.pid"

# 1. システム情報
echo "🖥️  システム情報:"
echo "   ユーザー: $CURRENT_USER"
echo "   ホスト名: $(hostname)"
echo "   IP アドレス: $(ipconfig getifaddr en0 2>/dev/null || echo "N/A")"
echo ""

# 2. プロセス状況
echo "🔍 プロセス状況:"
if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p "$PID" > /dev/null 2>&1; then
        echo "   ✅ バックエンドサーバー稼働中 (PID: $PID)"
        echo "   📈 メモリ使用量: $(ps -p $PID -o rss= | awk '{print $1/1024 " MB"}' 2>/dev/null || echo "N/A")"
        echo "   ⏰ 起動時間: $(ps -p $PID -o etime= 2>/dev/null || echo "N/A")"
    else
        echo "   ❌ バックエンドサーバー停止中 (PID: $PID は無効)"
    fi
else
    echo "   ⚠️  PIDファイルが存在しません"
fi

# 3. ポート確認
echo ""
echo "🌐 ネットワーク状況:"
if lsof -i :3001 > /dev/null 2>&1; then
    echo "   ✅ ポート3001使用中"
    PROCESS_INFO=$(lsof -i :3001 | tail -n 1 | awk '{print $2, $1}')
    echo "   📡 プロセス情報: $PROCESS_INFO"
else
    echo "   ❌ ポート3001未使用"
fi

# 4. HTTP確認
echo ""
echo "🧪 HTTP接続テスト:"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/health 2>/dev/null || echo "000")
if [ "$HTTP_STATUS" = "200" ]; then
    echo "   ✅ HTTPヘルスチェック成功 (200)"
    RESPONSE=$(curl -s http://localhost:3001/health | grep -o '"timestamp":"[^"]*"' | cut -d'"' -f4)
    echo "   ⏰ 最終応答: $RESPONSE"
else
    echo "   ❌ HTTPヘルスチェック失敗 ($HTTP_STATUS)"
fi

# 5. LaunchAgent状況
echo ""
echo "🚀 LaunchAgent状況:"
LAUNCH_STATUS=$(launchctl list | grep yakinorinori || echo "")
if [ -n "$LAUNCH_STATUS" ]; then
    echo "   ✅ LaunchAgent稼働中: $LAUNCH_STATUS"
else
    echo "   ❌ LaunchAgent未稼働"
fi

# 6. ディスク使用量
echo ""
echo "💾 ディスク使用量:"
echo "   ワークスペース: $(du -sh $WORKSPACE_DIR 2>/dev/null || echo "N/A")"
echo "   ログディレクトリ: $(du -sh $LOG_DIR 2>/dev/null || echo "N/A")"

# 7. 最近のログ
echo ""
echo "📄 最近のログ (最新5行):"
if [ -f "$LOG_DIR/startup.log" ]; then
    echo "--- startup.log ---"
    tail -n 5 "$LOG_DIR/startup.log" 2>/dev/null || echo "ログ読み取りエラー"
else
    echo "startup.logが見つかりません"
fi

if [ -f "$LOG_DIR/backend.log" ]; then
    echo "--- backend.log ---"
    tail -n 5 "$LOG_DIR/backend.log" 2>/dev/null || echo "ログ読み取りエラー"
else
    echo "backend.logが見つかりません"
fi

# 8. 外部アクセス情報
echo ""
echo "🌍 アクセス情報:"
LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || echo "localhost")
echo "   📱 フロントエンド: https://yakinorinori.github.io/My-Web-site"
echo "   🔧 バックエンド: http://$LOCAL_IP:3001"
echo "   📊 ヘルスチェック: http://$LOCAL_IP:3001/health"

echo ""
echo "======================================"
echo "📋 管理コマンド:"
echo "   サーバー再起動: $WORKSPACE_DIR/scripts/mac-mini-startup.sh"
echo "   サーバー停止: $WORKSPACE_DIR/scripts/mac-mini-stop.sh"
echo "   ログ監視: tail -f $LOG_DIR/backend.log"
