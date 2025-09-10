# SSH鍵認証設定手順

## 🔑 SSH鍵生成完了

MacBookで SSH鍵ペアを生成しました：
- **秘密鍵**: `/Users/x21095xx/.ssh/macmini_key`
- **公開鍵**: `/Users/x21095xx/.ssh/macmini_key.pub`

## 📋 Mac mini での設定手順

現在Mac miniにSSH接続中なので、以下のコマンドを実行してください：

### 1. SSH設定ディレクトリ準備
```bash
# Mac miniで実行
mkdir -p ~/.ssh
chmod 700 ~/.ssh
```

### 2. 公開鍵を authorized_keys に追加
```bash
# Mac miniで実行
echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDXI9cfrOWJcZlcZ4J7HdsOPOi/2jR+r6flMtFse9nk6cRsWN3ztEtIZ71eM6scQVjOfwxmKzkGdn//YQ7Wvrap5y9HoYO+W8y6hyEHmoIcywJQ17bqJ4Gy8p/araaRAp/LY8TFM1RwnWNw9cf8zWYoeI6oJ359Phae/PeBU9mzKQTfFu+V5Uzb/lXQRd0LySc+VbodnfbapZrc1+44jJCgLl7EXeH/qnyHsMlgbjOYXm4yE9LE8CBArYDG5Meqepc7P449vUGqj5GNpq7uGgJoTyio9Vyleai9oYpHKVo0c0LEgCKSiUa/enwDBM1rkw2zRLtPCeUry/NJnoW/hONPanD6PQ42OmmM/HfyaRvA67Cqz8Rtdkjuah71EdjJFlQKmMZp8MZyTOX16+ILbXVTkTirPPcUTYLxn87i7zBpexJagKG5k5xgsxnwQ6SAUc9qbf/5wAqbq6Ylpt7E8/5IWwpCOlCnoZ/41EnK/+2aTidOMggjVBRA8VxUhCTD80PfRIMD8+9Dux2yVl7ghTQfC5ok9EiurkgCw2hZUyBcC9EhQdcCNx5chEEnH1NeWqW95J4eNGPjrrjCz5BODwWFCstSe6uZzBOhOSwl159pqY+Li7gqOnmp15xXxm+EajT7fJ9JfXJ7m3tOeZbEVECK9zvVI9rLyISiLqJ+YZU4Zw== macbook-to-macmini" >> ~/.ssh/authorized_keys
```

### 3. 権限設定
```bash
# Mac miniで実行
chmod 600 ~/.ssh/authorized_keys
```

### 4. 設定確認
```bash
# Mac miniで実行
ls -la ~/.ssh/
cat ~/.ssh/authorized_keys
```

## 🔧 MacBook SSH設定

### SSH設定ファイル更新
```bash
# MacBookで実行（別ターミナルで）
mkdir -p ~/.ssh
cat >> ~/.ssh/config << 'EOF'

Host macmini
    HostName 192.168.151.100
    User akinoriyamaguchi
    IdentityFile ~/.ssh/macmini_key
    Port 22
    ServerAliveInterval 60
    ServerAliveCountMax 3
EOF
```

## ✅ 設定完了後のテスト

### SSH鍵認証テスト
```bash
# MacBookで実行
ssh -i ~/.ssh/macmini_key akinoriyamaguchi@192.168.151.100

# または簡単に
ssh macmini
```

### 同期スクリプト再実行
```bash
# MacBookで実行
./sync-to-macmini.sh
```

## 🎯 期待する結果

設定完了後：
1. パスワード入力なしでSSH接続可能
2. 同期スクリプトが自動実行可能
3. Mac miniでサーバー自動起動

## 📝 次のステップ

SSH鍵認証設定完了後：
1. プロジェクト同期実行
2. Mac miniでサーバー起動
3. 開発ワークフロー確立
