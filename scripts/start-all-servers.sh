#!/bin/bash

# Mac mini用統合サーバー起動スクリプト
echo "🖥️  Mac mini統合サーバー起動中..."

# 既存プロセス停止
echo "🔄 既存プロセスを停止中..."
pkill -f "python3.*app.py" 2>/dev/null
pkill -f "http.server" 2>/dev/null
sleep 2

# プロジェクトディレクトリに移動
cd "$(dirname "$0")"

echo "📂 現在のディレクトリ: $(pwd)"

# バックエンドサーバー起動
echo "🚀 バックエンドサーバー起動中..."
python3 backend/app.py &
BACKEND_PID=$!

# フロントエンドサーバー起動
echo "🌐 フロントエンドサーバー起動中..."
cd frontend
python3 -m http.server 8083 --bind 0.0.0.0 &
FRONTEND_PID=$!

cd ..

echo "✅ サーバー起動完了!"
echo "📍 フロントエンド: http://192.168.151.100:8083"
echo "📍 バックエンドAPI: http://192.168.151.100:3001"
echo "🔧 バックエンドPID: $BACKEND_PID"
echo "🔧 フロントエンドPID: $FRONTEND_PID"

# PIDファイルに保存
echo $BACKEND_PID > backend.pid
echo $FRONTEND_PID > frontend.pid

echo "⏳ サーバーが起動するまで少々お待ちください..."
sleep 3

echo "🎉 Mac miniサーバー準備完了！"
