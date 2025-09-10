#!/bin/bash

# Mac mini サーバー用プロダクション起動スクリプト
# 使用方法: ./start-production-server.sh

echo "🖥️  Mac mini サーバー起動中..."

# プロダクション環境確認
if [ ! -f "backend/config_production.py" ]; then
    echo "⚠️  プロダクション設定ファイルを作成中..."
    cp backend/config.py backend/config_production.py
    
    # プロダクション用設定
    echo "" >> backend/config_production.py
    echo "# プロダクション環境設定" >> backend/config_production.py
    echo "DEBUG = False" >> backend/config_production.py
    echo "SECRET_KEY = '$(openssl rand -hex 32)'" >> backend/config_production.py
    echo "SERVER_HOST = '0.0.0.0'" >> backend/config_production.py
    echo "SERVER_PORT = 80" >> backend/config_production.py
fi

# 仮想環境のアクティベート
if [ -d "backend/venv" ]; then
    source backend/venv/bin/activate
    echo "✅ 仮想環境をアクティベート"
else
    echo "❌ 仮想環境が見つかりません。setup.shを実行してください。"
    exit 1
fi

# 依存関係確認
echo "📦 依存関係を確認中..."
pip install -r backend/requirements.txt > /dev/null 2>&1

# プロセス確認・停止
echo "🔄 既存プロセスを確認中..."
pkill -f "python.*app.py" 2>/dev/null || true
pkill -f "http.server" 2>/dev/null || true

# ログディレクトリ作成
mkdir -p logs

# バックエンドサーバー起動
echo "🚀 バックエンドサーバーを起動中..."
cd backend
nohup python3 app.py > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# フロントエンドサーバー起動
echo "🌐 フロントエンドサーバーを起動中..."
cd frontend
nohup python3 -m http.server 8080 > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# PIDファイル作成
echo $BACKEND_PID > logs/backend.pid
echo $FRONTEND_PID > logs/frontend.pid

# 起動確認
sleep 3
if ps -p $BACKEND_PID > /dev/null; then
    echo "✅ バックエンドサーバー起動完了 (PID: $BACKEND_PID)"
else
    echo "❌ バックエンドサーバー起動失敗"
    cat logs/backend.log
    exit 1
fi

if ps -p $FRONTEND_PID > /dev/null; then
    echo "✅ フロントエンドサーバー起動完了 (PID: $FRONTEND_PID)"
else
    echo "❌ フロントエンドサーバー起動失敗"
    cat logs/frontend.log
    exit 1
fi

# システム情報表示
echo ""
echo "🎯 サーバー情報:"
echo "   - フロントエンド: http://$(hostname -I | awk '{print $1}'):8080"
echo "   - バックエンド: http://$(hostname -I | awk '{print $1}'):3001"
echo "   - ローカル: http://localhost:8080"
echo ""
echo "📊 システム状態:"
echo "   - CPU使用率: $(top -l 1 | grep "CPU usage" | awk '{print $3}' | sed 's/%//')"
echo "   - メモリ使用率: $(top -l 1 | grep "PhysMem" | awk '{print $2}' | sed 's/M//')"
echo "   - ディスク使用率: $(df -h / | tail -1 | awk '{print $5}')"
echo ""
echo "🛠️  管理コマンド:"
echo "   - 停止: ./stop-server.sh"
echo "   - ログ確認: tail -f logs/backend.log"
echo "   - プロセス確認: ps aux | grep python"
echo ""
echo "🔧 設定ファイル:"
echo "   - バックエンド設定: backend/config_production.py"
echo "   - ログファイル: logs/"
echo ""
echo "⚡ Mac mini サーバー起動完了!"
