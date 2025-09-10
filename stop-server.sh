#!/bin/bash

# Mac mini サーバー停止スクリプト
echo "🛑 Mac mini サーバーを停止中..."

# PIDファイルから停止
if [ -f "logs/backend.pid" ]; then
    BACKEND_PID=$(cat logs/backend.pid)
    if ps -p $BACKEND_PID > /dev/null; then
        kill $BACKEND_PID
        echo "✅ バックエンドサーバー停止 (PID: $BACKEND_PID)"
    fi
    rm logs/backend.pid
fi

if [ -f "logs/frontend.pid" ]; then
    FRONTEND_PID=$(cat logs/frontend.pid)
    if ps -p $FRONTEND_PID > /dev/null; then
        kill $FRONTEND_PID
        echo "✅ フロントエンドサーバー停止 (PID: $FRONTEND_PID)"
    fi
    rm logs/frontend.pid
fi

# 念のため関連プロセスを強制停止
pkill -f "python.*app.py" 2>/dev/null && echo "🔧 残存バックエンドプロセス停止"
pkill -f "http.server" 2>/dev/null && echo "🔧 残存フロントエンドプロセス停止"

echo "🏁 サーバー停止完了"
