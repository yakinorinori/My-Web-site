#!/bin/bash

# Mac mini セットアップスクリプト
# Mac miniで最初に実行するためのスクリプト

set -e

echo "🍎 Mac mini初期セットアップ開始..."

# 現在のユーザー情報を取得
CURRENT_USER=$(whoami)
HOME_DIR="/Users/$CURRENT_USER"
WORKSPACE_DIR="$HOME_DIR/workspace"

echo "👤 現在のユーザー: $CURRENT_USER"
echo "🏠 ホームディレクトリ: $HOME_DIR"
echo "📁 ワークスペース: $WORKSPACE_DIR"

# 1. workspaceディレクトリが存在しない場合は作成
if [ ! -d "$WORKSPACE_DIR" ]; then
    echo "📁 ワークスペースディレクトリを作成中..."
    mkdir -p "$WORKSPACE_DIR"
else
    echo "✅ ワークスペースディレクトリは既に存在します"
fi

# 2. 現在のプロジェクトディレクトリからworkspaceへのシンボリックリンクを作成
CURRENT_DIR=$(pwd)
echo "🔗 シンボリックリンクを作成中..."
echo "   From: $CURRENT_DIR"
echo "   To: $WORKSPACE_DIR"

# 既存のworkspaceディレクトリを削除してシンボリックリンクを作成
if [ -L "$WORKSPACE_DIR" ]; then
    echo "🗑️  既存のシンボリックリンクを削除"
    rm "$WORKSPACE_DIR"
elif [ -d "$WORKSPACE_DIR" ] && [ ! -L "$WORKSPACE_DIR" ]; then
    echo "🗑️  既存のディレクトリを削除"
    rm -rf "$WORKSPACE_DIR"
fi

ln -sf "$CURRENT_DIR" "$WORKSPACE_DIR"
echo "✅ シンボリックリンク作成完了"

# 3. ログディレクトリを作成
LOG_DIR="$WORKSPACE_DIR/logs"
mkdir -p "$LOG_DIR"
echo "📄 ログディレクトリ作成: $LOG_DIR"

# 4. スクリプトに実行権限を付与
echo "🔧 スクリプトに実行権限を付与中..."
chmod +x "$WORKSPACE_DIR/scripts/mac-mini-startup.sh"
chmod +x "$WORKSPACE_DIR/scripts/mac-mini-stop.sh"

# 5. Python環境をチェック
echo "🐍 Python環境をチェック中..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo "✅ Python発見: $PYTHON_VERSION"
else
    echo "❌ Python3が見つかりません。Homebrewでインストールしてください："
    echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    echo "   brew install python"
    exit 1
fi

# 6. 最初の起動テスト
echo "🚀 最初の起動テストを実行中..."
"$WORKSPACE_DIR/scripts/mac-mini-startup.sh"

echo ""
echo "🎉 Mac mini初期セットアップ完了！"
echo ""
echo "📋 次のステップ:"
echo "   1. システム起動時の自動実行を設定:"
echo "      sudo cp scripts/com.yakinorinori.webserver.plist /Library/LaunchDaemons/"
echo "      sudo launchctl load /Library/LaunchDaemons/com.yakinorinori.webserver.plist"
echo ""
echo "   2. 動作確認:"
echo "      curl http://localhost:3001/health"
echo ""
echo "   3. ログ確認:"
echo "      tail -f $LOG_DIR/backend.log"
