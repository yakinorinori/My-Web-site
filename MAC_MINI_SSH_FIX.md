# Mac mini SSH設定 - Full Disk Access権限エラー解決

## 🚨 現在の状況
```
setremotelogin: Turning Remote Login on or off requires Full Disk Access privileges.
Remote Login: Off
```

## 🔧 解決手順

### 方法1: システム環境設定でSSH有効化（推奨）

#### GUI操作手順:
1. **Appleメニュー** → **システム環境設定**
2. **共有** をクリック
3. 左側のリストで **リモートログイン** にチェックを入れる
4. 右側で接続許可するユーザーを選択:
   - **すべてのユーザー** または
   - **管理者のみ** または 
   - **特定のユーザーのみ** を選択して `akinoriyamaguchi` を追加

### 方法2: Full Disk Access権限を付与

#### ターミナルにFull Disk Access権限を付与:
1. **Appleメニュー** → **システム環境設定**
2. **セキュリティとプライバシー**
3. **プライバシー** タブ
4. 左側で **フルディスクアクセス** を選択
5. 🔒マークをクリックして管理者パスワード入力
6. **+** ボタンをクリック
7. **アプリケーション** → **ユーティリティ** → **ターミナル** を選択
8. **開く** をクリック

#### 権限付与後にコマンド再実行:
```bash
sudo systemsetup -setremotelogin on
sudo systemsetup -getremotelogin
```

### 方法3: launchctl コマンド使用

#### 直接SSHサービスを起動:
```bash
# SSHサービス開始
sudo launchctl load -w /System/Library/LaunchDaemons/ssh.plist

# または
sudo launchctl enable system/com.openssh.sshd
sudo launchctl bootstrap system /System/Library/LaunchDaemons/ssh.plist
```

## 📋 設定確認手順

### SSH有効化確認:
```bash
# 方法1: システム設定確認
sudo systemsetup -getremotelogin

# 方法2: SSHプロセス確認
sudo launchctl list | grep ssh

# 方法3: ポート確認
sudo lsof -i :22

# 方法4: ネットワーク確認
netstat -an | grep :22
```

### ファイアウォール確認:
```bash
# ファイアウォール状態確認
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate

# 特定アプリケーションの確認
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --listapps
```

## 🎯 完全設定スクリプト

Mac miniで実行する完全なスクリプト:

```bash
#!/bin/bash
echo "🔧 Mac mini SSH完全設定開始..."

# 現在のユーザー確認
CURRENT_USER=$(whoami)
echo "現在のユーザー: $CURRENT_USER"

# IPアドレス確認
IP_ADDRESS=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
echo "現在のIPアドレス: $IP_ADDRESS"

# SSH設定確認
echo "現在のSSH状態:"
sudo systemsetup -getremotelogin 2>/dev/null || echo "権限不足"

# 代替方法でSSH有効化
echo "launchctl でSSH有効化を試行中..."
sudo launchctl enable system/com.openssh.sshd 2>/dev/null
sudo launchctl bootstrap system /System/Library/LaunchDaemons/ssh.plist 2>/dev/null || \
sudo launchctl load -w /System/Library/LaunchDaemons/ssh.plist 2>/dev/null

# SSH状態確認
echo "SSHサービス確認:"
sudo launchctl list | grep ssh || echo "SSHサービス未検出"

# ポート確認
echo "ポート22状態確認:"
sudo lsof -i :22 2>/dev/null || echo "ポート22未開放"

# SSH設定ディレクトリ準備
echo "SSH設定準備..."
mkdir -p ~/.ssh
chmod 700 ~/.ssh
touch ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

echo ""
echo "✅ 設定完了!"
echo "MacBookから接続テスト: ssh $CURRENT_USER@$IP_ADDRESS"
echo ""
echo "📋 GUI設定が必要な場合:"
echo "システム環境設定 → 共有 → リモートログイン ✅"
```

## ⚡ 今すぐ実行

### Mac miniで実行:
```bash
# 1. GUI方法（最も確実）
# システム環境設定 → 共有 → リモートログイン ✅

# 2. コマンド方法
sudo launchctl load -w /System/Library/LaunchDaemons/ssh.plist

# 3. 確認
sudo launchctl list | grep ssh
sudo lsof -i :22
```

### MacBookで接続テスト:
```bash
ssh akinoriyamaguchi@192.168.151.100
```

## 🎯 期待する結果

設定成功後の表示:
```
Remote Login: On
com.openssh.sshd
sshd      1234 root   4u  IPv6 0x... TCP *:ssh (LISTEN)
```

GUI操作（システム環境設定 → 共有）が最も確実な方法です！
