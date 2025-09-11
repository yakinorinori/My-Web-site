#!/bin/bash

# Mac mini 自動起動・常時稼働スクリプト
# システム起動時に自動実行される

set -e

echo "🖥️  Mac mini 常時稼働システム起動中..."

# 基本設定
PROJECT_DIR="/Users/x21095xx/workspace"
BACKEND_DIR="$PROJECT_DIR/backend"
LOG_DIR="$PROJECT_DIR/logs"
PID_FILE="$LOG_DIR/backend.pid"

# ログディレクトリを作成
mkdir -p "$LOG_DIR"

# 既存のプロセスをチェック
if [ -f "$PID_FILE" ]; then
    OLD_PID=$(cat "$PID_FILE")
    if ps -p "$OLD_PID" > /dev/null 2>&1; then
        echo "既存のサーバー (PID: $OLD_PID) を停止中..."
        kill "$OLD_PID"
        sleep 2
    fi
    rm -f "$PID_FILE"
fi

# GitHub から最新のコードを取得
echo "📥 最新のコードを取得中..."
cd "$PROJECT_DIR"
git fetch origin
git reset --hard origin/main

# 仮想環境をチェック・作成
echo "🐍 Python環境をセットアップ中..."
if [ ! -d "$BACKEND_DIR/new_venv" ]; then
    cd "$BACKEND_DIR"
    python3 -m venv new_venv
fi

# パッケージをインストール
source "$BACKEND_DIR/new_venv/bin/activate"
pip install -q Flask Flask-CORS Werkzeug

# データファイルを確認
if [ ! -f "$BACKEND_DIR/data/sales.csv" ]; then
    echo "📊 サンプルデータを配置中..."
    cp "$PROJECT_DIR/frontend/sales.sample.csv" "$BACKEND_DIR/data/sales.csv"
fi

# バックエンドサーバーを起動
echo "🚀 バックエンドサーバーを起動中..."
cd "$BACKEND_DIR"
nohup python app.py > "$LOG_DIR/backend.log" 2>&1 &
BACKEND_PID=$!
echo "$BACKEND_PID" > "$PID_FILE"

# 起動確認
sleep 5
if ps -p "$BACKEND_PID" > /dev/null 2>&1; then
    echo "✅ バックエンドサーバー起動成功 (PID: $BACKEND_PID)"
    echo "📍 アクセス可能: http://$(ipconfig getifaddr en0):3001"
else
    echo "❌ バックエンドサーバー起動失敗"
    exit 1
fi

# システム情報表示
echo ""
echo "🎉 Mac mini 常時稼働システム起動完了！"
echo ""
echo "📋 アクセス情報:"
echo "   🌐 フロントエンド: https://yakinorinori.github.io/My-Web-site"
echo "   🔧 バックエンド: http://$(ipconfig getifaddr en0):3001"
echo "   📊 ヘルスチェック: http://$(ipconfig getifaddr en0):3001/health"
echo ""
echo "📄 ログファイル:"
echo "   Backend: $LOG_DIR/backend.log"
echo "   PID: $PID_FILE"
echo ""
echo "🔄 監視コマンド:"
echo "   tail -f $LOG_DIR/backend.log"
echo "   ps -p \$(cat $PID_FILE)"
