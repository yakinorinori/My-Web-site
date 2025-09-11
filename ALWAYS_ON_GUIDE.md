# 🌐 常時稼働システム構築ガイド

## 🎯 **システム構成**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   GitHub Pages  │    │   Mac mini      │    │   ユーザー      │
│   (フロントエンド) │◄──►│   (バックエンド)  │◄──►│   (アクセス)     │
│   24/7 稼働     │    │   自宅サーバー    │    │   どこからでも   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📋 **セットアップ手順**

### **1. GitHub Pages設定**
```bash
# 1. GitHubリポジトリのSettings > Pages
# 2. Source: "Deploy from a branch"
# 3. Branch: main / root
# 4. Save

# フロントエンドが以下のURLで公開される:
# https://yakinorinori.github.io/My-Web-site
```

### **2. Mac mini自動起動設定**
```bash
# Mac mini上で実行
cd /Users/x21095xx/workspace

# 1. リポジトリをクローン
git clone https://github.com/yakinorinori/My-Web-site.git
cd My-Web-site

# 2. シンボリックリンクを作成
ln -sf "$(pwd)" ~/workspace

# 3. 起動スクリプトをテスト
./scripts/mac-mini-startup.sh

# 4. システム起動時の自動実行を設定
sudo cp scripts/com.yakinorinori.webserver.plist /Library/LaunchDaemons/
sudo launchctl load /Library/LaunchDaemons/com.yakinorinori.webserver.plist
```

### **3. 動作確認**
```bash
# フロントエンド確認
curl https://yakinorinori.github.io/My-Web-site

# バックエンド確認（Mac mini）
curl http://192.168.151.100:3001/health

# ローカルネットワークでの確認
curl http://$(ipconfig getifaddr en0):3001/health
```

## 🔧 **管理コマンド**

### **Mac mini サーバー管理**
```bash
# サーバー起動
./scripts/mac-mini-startup.sh

# サーバー停止
./scripts/mac-mini-stop.sh

# ログ確認
tail -f logs/backend.log

# プロセス確認
ps -p $(cat logs/backend.pid)
```

### **GitHub Actions確認**
```bash
# Pages デプロイ状況確認
# https://github.com/yakinorinori/My-Web-site/actions

# 最新のコードをMac miniに反映
git pull origin main
./scripts/mac-mini-startup.sh
```

## 🌟 **メリット**

### **MacBook依存からの解放**
- ✅ MacBookを閉じてもサイトが稼働し続ける
- ✅ Mac miniが24時間365日稼働
- ✅ 外出先からでもアクセス可能

### **コスト効率**
- ✅ GitHub Pages: 無料
- ✅ Mac mini: 電気代のみ（月数百円）
- ✅ クラウドサーバー不要

### **管理の簡素化**
- ✅ Git pushだけでフロントエンド更新
- ✅ Mac mini自動起動・監視
- ✅ ログとプロセス管理

## 🔒 **セキュリティ**

### **アクセス制御**
- フロントエンド: GitHub Pages（HTTPS）
- バックエンド: ローカルネットワーク限定
- 認証システム: pbkdf2:sha256

### **データ保護**
- CSVファイル: GitHub非公開
- 機密情報: ローカル保存のみ
- ログ: Mac mini内のみ

## 🚀 **今後の拡張**

1. **外部アクセス設定**
   - ルーター設定でポート開放
   - Dynamic DNS設定

2. **監視システム**
   - Uptimeチェック
   - アラート通知

3. **バックアップ**
   - データ自動バックアップ
   - 設定ファイル同期
