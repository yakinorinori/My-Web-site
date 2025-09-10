# 売上管理Webシステム

## 📋 概要

Mac miniをサーバーとして利用した売上管理Webアプリケーション。
Chart.jsによるデータ視覚化と認証機能を備えています。

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

## 🔐 認証情報

- **user1**: password123
- **user2**: password456  
- **user3**: password789

## 🌐 アクセス

- **フロントエンド**: http://192.168.151.100:8083
- **バックエンドAPI**: http://192.168.151.100:3001

## 📊 機能

- ✅ ユーザー認証・セッション管理
- ✅ CSV データインポート
- ✅ Chart.js による多様なグラフ表示
- ✅ レスポンシブデザイン
- ✅ RESTful API
- ✅ 自動デプロイ・監視

## 🛠️ 技術スタック

- **フロントエンド**: HTML5, CSS3, JavaScript, Chart.js
- **バックエンド**: Python, Flask, Flask-CORS
- **サーバー**: Mac mini (macOS)
- **CI/CD**: GitHub Actions (予定)
- **監視**: カスタムシェルスクリプト

## 📋 TODO

- [ ] HTTPS対応 (Let's Encrypt)
- [ ] データベース導入 (PostgreSQL)
- [ ] GitHub Actions CI/CD
- [ ] Docker対応
- [ ] ログ分析ダッシュボード
