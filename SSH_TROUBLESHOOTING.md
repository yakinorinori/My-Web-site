# SSH接続設定 トラブルシューティングガイド

## 🚨 現在の状況
- MacBook → Mac mini 接続: ✅ 可能 (ping成功)
- SSH接続: ❌ 失敗
- 必要な作業: Mac miniでのSSH有効化

## 🔧 解決手順

### Phase 1: Mac mini側での設定（直接操作が必要）

#### 1. Mac miniに直接アクセスして以下を実行:

```bash
# SSH有効化
sudo systemsetup -setremotelogin on

# SSH状態確認
sudo systemsetup -getremotelogin

# SSHサービス状態確認
sudo launchctl list | grep ssh

# ファイアウォール確認
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate
```

#### 2. ユーザーアカウント確認
```bash
# 現在のユーザー名確認
whoami

# ユーザー一覧確認
dscl . list /Users | grep -v '^_'
```

### Phase 2: MacBookからの接続テスト

#### 1. 基本SSH接続テスト
```bash
# Mac miniのユーザー名を正しく指定して接続
ssh actual_username@192.168.151.100

# SSH詳細ログで接続確認
ssh -v actual_username@192.168.151.100
```

#### 2. SSH鍵認証設定
```bash
# SSH鍵ペア作成（まだ作成していない場合）
ssh-keygen -t rsa -b 4096 -C "macbook-to-macmini"

# 公開鍵をMac miniにコピー
ssh-copy-id actual_username@192.168.151.100
```

## 🛠️ 代替解決方法

### 方法1: 画面共有を使用
1. Mac mini: システム環境設定 → 共有 → 画面共有 ✅
2. MacBook: Finder → ネットワーク → Mac mini選択
3. Mac miniを遠隔操作してSSH設定

### 方法2: ファイル共有経由
1. Mac mini: システム環境設定 → 共有 → ファイル共有 ✅
2. MacBook: プロジェクトをファイル共有でコピー
3. Mac mini: 直接操作でサーバー起動

### 方法3: 一時的なHTTPサーバー
```bash
# MacBookで（現在の場所）
# 簡易HTTPサーバーでプロジェクト配信
python3 -m http.server 9000

# Mac miniで
# プロジェクトをダウンロード
curl -O http://192.168.151.13:9000/project.zip
```

## 📋 即座に実行可能な作業

### MacBook側（今すぐ実行可能）
```bash
# 1. SSH鍵作成
ssh-keygen -t rsa -b 4096 -C "macbook-to-macmini" -f ~/.ssh/macmini_key

# 2. 公開鍵表示（Mac miniで手動追加用）
cat ~/.ssh/macmini_key.pub

# 3. SSH設定ファイル作成
cat >> ~/.ssh/config << EOF
Host macmini
    HostName 192.168.151.100
    User REPLACE_WITH_ACTUAL_USERNAME
    IdentityFile ~/.ssh/macmini_key
    Port 22
EOF
```

### Mac mini側（直接操作が必要）
```bash
# 1. SSH有効化
sudo systemsetup -setremotelogin on

# 2. 公開鍵認証設定
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# 3. MacBookの公開鍵を追加
nano ~/.ssh/authorized_keys
# MacBookで表示された公開鍵をコピー&ペースト

# 4. 権限設定
chmod 600 ~/.ssh/authorized_keys

# 5. SSH再起動
sudo launchctl unload /System/Library/LaunchDaemons/ssh.plist
sudo launchctl load /System/Library/LaunchDaemons/ssh.plist
```

## 🔍 デバッグ情報収集

### Mac mini接続確認
```bash
# MacBookから実行
ping -c 3 192.168.151.100
telnet 192.168.151.100 22
nmap -p 22 192.168.151.100
```

### SSH詳細ログ
```bash
# 詳細な接続ログを表示
ssh -vvv username@192.168.151.100
```

## ⚡ 緊急時の代替案

### 今すぐプロジェクトをテストしたい場合
```bash
# MacBookで現在のプロジェクトを起動
cd /Users/x21095xx/個人事業/My-Web-site
./start-secure.sh

# ブラウザで確認
open http://localhost:8080
```

### GitHubを経由した同期
```bash
# MacBookから
git add .
git commit -m "Mac mini deployment preparation"
git push origin main

# Mac miniで（直接操作時）
git clone https://github.com/your-repo/My-Web-site.git
cd My-Web-site
./setup.sh
./start-production-server.sh
```

## 📞 次のアクション

1. **最優先**: Mac miniに直接アクセスしてSSH有効化
2. **短期**: SSH鍵認証設定
3. **中期**: 画面共有やファイル共有の代替手段設定

Mac miniへの物理アクセスまたは画面共有が設定済みであれば、すぐに解決できます！
