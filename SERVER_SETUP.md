# Mac mini サーバー設定ガイド

## 1. 基本システム設定

### 1.1 macOS設定
```bash
# エネルギーセーバー設定（24時間稼働）
sudo pmset -a sleep 0
sudo pmset -a displaysleep 10
sudo pmset -a disksleep 0

# 自動再起動設定
sudo pmset -a autorestart 1
```

### 1.2 ネットワーク設定
- **固定IPアドレス設定**
  - システム環境設定 → ネットワーク → 詳細 → TCP/IP
  - 手動でIPアドレスを設定（例: 192.168.1.100）

### 1.3 SSH有効化
```bash
# SSH を有効にする
sudo systemsetup -setremotelogin on

# セキュリティ強化
sudo nano /etc/ssh/sshd_config
# PermitRootLogin no
# PasswordAuthentication no （公開鍵認証のみ）
```

## 2. Webサーバー設定

### 2.1 Apache設定（推奨）
```bash
# Apache インストール（Homebrew）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install httpd

# 設定ファイル編集
sudo nano /usr/local/etc/httpd/httpd.conf
```

### 2.2 Nginx設定（代替案）
```bash
# Nginx インストール
brew install nginx

# 設定例
sudo nano /usr/local/etc/nginx/nginx.conf
```

### 2.3 現在システムの本格運用設定
```bash
# プロダクション環境設定
cd /Users/x21095xx/個人事業/My-Web-site
cp backend/config.py backend/config_production.py
```

## 3. セキュリティ設定

### 3.1 ファイアウォール設定
```bash
# ファイアウォール有効化
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate on

# 必要ポートのみ開放
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/bin/python3
```

### 3.2 SSL証明書設定
```bash
# Let's Encrypt証明書取得
brew install certbot
sudo certbot certonly --standalone -d yourdomain.com
```

## 4. 自動起動設定

### 4.1 システム起動時自動実行
```bash
# launchd設定ファイル作成
sudo nano /Library/LaunchDaemons/com.salesanalysis.app.plist
```

### 4.2 監視・再起動スクリプト
```bash
# プロセス監視スクリプト
nano ~/monitor_sales_app.sh
chmod +x ~/monitor_sales_app.sh
```

## 5. バックアップ設定

### 5.1 データバックアップ
```bash
# Time Machine設定
# システム環境設定 → Time Machine

# 売上データ専用バックアップ
rsync -av /Users/x21095xx/個人事業/My-Web-site/backend/data/ /backup/sales_data/
```

### 5.2 定期バックアップ
```bash
# crontab設定
crontab -e
# 0 2 * * * /path/to/backup_script.sh
```

## 6. 監視・ログ設定

### 6.1 ログローテーション
```bash
# システムログ設定
sudo nano /etc/newsyslog.conf
```

### 6.2 アクセス監視
```bash
# ログ監視スクリプト
tail -f /var/log/access.log | grep "売上分析"
```

## 7. パフォーマンス最適化

### 7.1 メモリ・CPU監視
```bash
# リソース監視
top -o cpu
iostat 5
```

### 7.2 データベース最適化
- CSV → SQLite移行を検討
- インデックス設定

## 8. 外部アクセス設定

### 8.1 ドメイン設定
- DNS設定（A レコード）
- Dynamic DNS（固定IPがない場合）

### 8.2 ポート転送設定
- ルーター設定：80, 443ポート転送
- セキュリティ強化

## 9. トラブルシューティング

### 9.1 ログ確認場所
```bash
# システムログ
tail -f /var/log/system.log

# アプリケーションログ
tail -f ~/sales_app.log
```

### 9.2 緊急時対応
- 自動復旧スクリプト
- 通知設定（メール・Slack）

## 10. 運用チェックリスト

### 日次
- [ ] サービス稼働確認
- [ ] ログエラー確認
- [ ] バックアップ確認

### 週次
- [ ] セキュリティアップデート
- [ ] パフォーマンス確認
- [ ] ディスク容量確認

### 月次
- [ ] システム全体点検
- [ ] データ整合性確認
- [ ] 証明書期限確認
