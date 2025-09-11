#!/bin/bash

# Mac mini サーバー停止スクリプト

set -e

echo "🛑 Mac mini サーバーを停止中..."

# 基本設定
PROJECT_DIR="/Users/x21095xx/workspace"
LOG_DIR="$PROJECT_DIR/logs"
PID_FILE="$LOG_DIR/backend.pid"

# PIDファイルが存在するかチェック
if [ ! -f "$PID_FILE" ]; then
    echo "⚠️  PIDファイルが見つかりません: $PID_FILE"
    echo "手動でプロセスを確認してください: ps aux | grep app.py"
    exit 1
fi

# PIDを読み取り
PID=$(cat "$PID_FILE")
echo "🔍 プロセス $PID を停止中..."

# プロセスが実際に存在するかチェック
if ps -p "$PID" > /dev/null 2>&1; then
    # プロセスを停止
    kill "$PID"
    
    # 停止完了まで待機
    for i in {1..10}; do
        if ! ps -p "$PID" > /dev/null 2>&1; then
            echo "✅ サーバーが正常に停止しました"
            break
        fi
        echo "⏳ 停止処理中... ($i/10)"
        sleep 1
    done
    
    # まだ動いている場合は強制停止
    if ps -p "$PID" > /dev/null 2>&1; then
        echo "🔨 強制停止中..."
        kill -9 "$PID"
        sleep 2
    fi
else
    echo "⚠️  プロセス $PID は既に停止しています"
fi

# PIDファイルを削除
rm -f "$PID_FILE"

# 関連するPythonプロセスもチェック
echo "🧹 関連プロセスをクリーンアップ中..."
pkill -f "python.*app.py" 2>/dev/null || true

echo "🎉 Mac mini サーバー停止完了！"
