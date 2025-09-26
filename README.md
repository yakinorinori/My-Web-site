# 📊 売上管理システム

## 🌐 デモサイト
- **GitHub Pages**: https://yakinorinori.github.io/My-Web-site/
- **Mac mini サーバー**: http://192.168.151.100:8080

## 🎯 機能
- 売上データの可視化（グラフ表示）
- 月別・年別分析
- 曜日別統計
- 顧客別売上分析
- セキュアなログイン認証

## 🚀 利用方法

### GitHub Pages（デモ版）
1. https://yakinorinori.github.io/My-Web-site/ にアクセス
2. デモ用アカウントでログイン：
   - `kiradan` / `kiradan2024!`
   - `user1` / `password123`

### Mac mini サーバー（フル機能版）
1. VPNまたはローカルネットワークから Mac mini にアクセス
2. 本番用アカウントでログイン
3. リアルタイムデータの表示・編集

## 📁 プロジェクト構造
```
My-Web-site/
├── index.html          # メインページ
├── main.js             # フロントエンドロジック
├── style.css           # スタイル
├── sales.csv           # デモデータ
├── backend/            # Flask API サーバー
├── frontend/           # 開発用フロントエンド
├── scripts/            # 運用スクリプト
└── .github/workflows/  # CI/CD 設定
```

## 🔧 開発環境
```bash
# リポジトリクローン
git clone https://github.com/yakinorinori/My-Web-site.git
cd My-Web-site

# バックエンド起動
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app_http.py

# フロントエンド起動
cd frontend
python3 -m http.server 8080
```

## 🚀 デプロイメント
- **GitHub Pages**: プッシュ時に自動デプロイ ✅ 常時稼働
- **Mac mini**: GitHub Actions で自動デプロイ（要SSH設定）⚠️ 要設定

### GitHub Actions デプロイ状況確認
1. リポジトリページで「Actions」タブをクリック
2. 最新の「Deploy to GitHub Pages and Mac mini」ワークフローを確認
3. GitHub Pagesは常に成功、Mac miniは設定に依存

### Mac mini SSH設定（オプション）
**⚠️ 注意**: Mac miniデプロイが失敗してもGitHub Pagesは正常動作します

GitHub リポジトリの `Settings > Secrets and variables > Actions` で以下を設定：

| Secret名 | 値 | 説明 |
|----------|-----|------|
| `MAC_MINI_HOST` | `192.168.151.100` | Mac miniのIPアドレス |
| `MAC_MINI_USER` | `your_username` | Mac miniのユーザー名 |
| `SSH_PRIVATE_KEY` | SSH秘密鍵の内容 | `cat ~/.ssh/id_rsa` の出力 |

```bash
# SSH鍵生成例（Mac mini側で実行）
ssh-keygen -t rsa -b 4096 -C "github-actions"
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/id_rsa  # この内容をSSH_PRIVATE_KEYに設定
```

### Mac mini デプロイトラブルシューティング
Mac miniデプロイが失敗する場合の確認項目：

1. **🖥️ Mac mini起動状況**: Mac mini が起動しているか
2. **🌐 ネットワーク接続**: WiFi/有線接続が正常か  
3. **🔐 SSH鍵設定**: GitHub SecretsにSSH鍵が正しく設定されているか
4. **🛡️ ファイアウォール**: Mac mini のファイアウォール設定確認
5. **🔌 VPN接続**: VPN経由でのアクセスが必要か

## 📈 データ形式
CSVファイル形式：
```csv
日付,商品名,客数,売り上げ,支払い者
2024/09/01,商品A,2,5000,田中太郎
```

## 🛡️ セキュリティ
- ユーザー認証システム
- セッション管理
- HTTPS対応（Mac mini）
- CORS設定

---
**更新日**: 2025年9月12日
