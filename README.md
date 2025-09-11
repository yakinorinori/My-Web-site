# 売上管理Webシステム

🚀 **[システムを使用する →](https://yakinorinori.github.io/My-Web-site/)**

## 📋 概要

24時間稼働のMac miniサーバーとGitHub Pagesを組み合わせた売上管理Webアプリケーション。
Chart.jsによるデータ視覚化と認証機能を備え、世界中どこからでもアクセス可能です。

## 🏗️ アーキテクチャ

```
├── frontend/          # フロントエンド (HTML, CSS, JavaScript)
│   ├── index.html     # メインページ
│   ├── style.css      # スタイルシート
│   ├── main.js        # メインロジック
│   └── sales.csv      # サンプルデータ
│
├── backend/           # バックエンド (Flask API)
│   ├── app.py         # Flask アプリケーション
│   └── requirements.txt # Python依存関係
│
├── scripts/           # 管理スクリプト
│   ├── start-all-servers.sh    # サーバー起動
│   ├── sync-to-macmini.sh      # デプロイ
│   ├── monitor-servers.sh      # 監視
│   └── test-all-systems.sh     # テスト
│
└── docs/              # ドキュメント
    ├── NETWORK_SETUP.md        # ネットワーク設定
    ├── SERVER_CHECKLIST.md     # サーバー設定
    └── DEPLOYMENT.md           # デプロイ手順
```

## 🚀 クイックスタート

### 開発環境 (MacBook)

```bash
# プロジェクトクローン
git clone [repository-url]
cd My-Web-site

# 依存関係インストール
pip install -r backend/requirements.txt

# 開発サーバー起動
cd frontend && python3 -m http.server 8080 &
cd ../backend && python3 app.py &
```

### 本番環境 (Mac mini)

```bash
# 自動デプロイ実行
./scripts/deploy-to-production.sh

# サーバー監視
./scripts/monitor-servers.sh
```

## � 使用方法

1. **すぐに試す**: [システムページ](https://yakinorinori.github.io/My-Web-site/) にアクセス
2. **デモデータ**: GitHub Pages版ではサンプルデータで機能を確認
3. **ローカル利用**: 同一ネットワーク内でMac miniに直接接続で完全機能

## �🔐 認証情報 (ローカル用)

- **user1**: password123
- **user2**: password456  
- **user3**: password789

## 🌐 アクセス方法

### 🌍 インターネットからアクセス
**👉 [https://yakinorinori.github.io/My-Web-site/](https://yakinorinori.github.io/My-Web-site/)**
- 世界中どこからでもアクセス可能
- HTTPS安全接続
- デモデータで機能確認

### 🏠 ローカルネットワークからアクセス
- **Mac mini サーバー**: http://192.168.151.100:3001
- 実際のデータベース機能
- 完全な機能利用

## 📊 機能

- ✅ GitHub Pages 公開サイト
- ✅ Mac mini 24時間サーバー
- ✅ Mixed Content エラー対応
- ✅ 自動デプロイシステム
- ✅ デモモード実装
- ✅ ユーザー認証・セッション管理
- ✅ CSV データインポート
- ✅ Chart.js による多様なグラフ表示
- ✅ レスポンシブデザイン
- ✅ RESTful API

## 🛠️ システム構成

### 🔄 ハイブリッド構成
- **GitHub Pages**: 公開ウェブサイト (HTTPS)
- **Mac mini サーバー**: 24時間バックエンド稼働
- **自動デプロイ**: GitHub Actions

### 💻 技術スタック
- **フロントエンド**: HTML5, CSS3, JavaScript, Chart.js
- **バックエンド**: Python, Flask, Flask-CORS
- **ホスティング**: GitHub Pages + Mac mini
- **CI/CD**: GitHub Actions
- **認証**: セッション管理

## 🎯 今後の予定

- [ ] データベース導入 (PostgreSQL)
- [ ] ログ分析ダッシュボード
- [ ] モバイルアプリ対応
