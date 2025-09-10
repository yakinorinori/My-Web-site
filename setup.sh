#!/bin/bash
# 手動セットアップ用スクリプト

echo "🔧 セキュア売上管理システム - 手動セットアップ"
echo ""

# バックエンドの仮想環境セットアップ
echo "📁 バックエンドディレクトリに移動..."
cd backend

echo "🐍 Python仮想環境を作成中..."
python3 -m venv venv

echo "🔄 仮想環境を有効化中..."
source venv/bin/activate

echo "📦 Pythonパッケージをインストール中..."
pip install flask flask-cors werkzeug

echo ""
echo "✅ セットアップが完了しました！"
echo ""
echo "🚀 システムを起動するには:"
echo "   ./start-secure.sh"
echo ""
echo "または手動で:"
echo "   1. cd backend && source venv/bin/activate && python app.py"
echo "   2. 別ターミナルで: cd frontend && python3 -m http.server 8080"
echo ""
echo "🔗 アクセス: http://localhost:8080"
