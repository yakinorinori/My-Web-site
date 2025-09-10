# MacBook ⇄ Mac mini リモート開発環境設定ガイド

## 🔄 現在の状況理解

### 開発環境構成
- **VS Code**: MacBook上で動作
- **サーバー**: Mac mini上で動作予定
- **ネットワーク**: 両デバイスが異なるWi-Fiに接続

### 現在確認された情報
- **MacBook IP**: 192.168.151.13 (VS Code実行中)
- **Mac mini**: 設定対象（固定IP: 192.168.151.100予定）

## 🎯 リモート開発環境設定手順

### Phase 1: Mac mini サーバー設定

#### 1. Mac miniで固定IPアドレス設定
```bash
# Mac miniで実行（SSHまたは直接操作）
sudo networksetup -setmanual "Wi-Fi" 192.168.151.100 255.255.254.0 192.168.150.1
sudo networksetup -setdnsservers "Wi-Fi" 8.8.8.8 8.8.4.4 1.1.1.1
```

#### 2. Mac miniでSSH有効化
```bash
# Mac miniで実行
sudo systemsetup -setremotelogin on

# SSH設定確認
sudo systemsetup -getremotelogin
```

#### 3. Mac miniでサーバー起動
```bash
# Mac miniで実行
cd /path/to/your/project
./start-production-server.sh
```

### Phase 2: MacBookからのリモートアクセス設定

#### 1. SSH接続設定
```bash
# MacBookで実行 - SSH接続テスト
ssh username@192.168.151.100

# SSH鍵設定（推奨）
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
ssh-copy-id username@192.168.151.100
```

#### 2. VS Code Remote SSH拡張機能
```bash
# VS Code拡張機能インストール
# Remote - SSH をインストール
# Remote Development Pack をインストール
```

#### 3. SSH設定ファイル作成
```bash
# MacBookで実行
nano ~/.ssh/config
```

設定内容:
```
Host mac-mini-server
    HostName 192.168.151.100
    User your_username
    Port 22
    IdentityFile ~/.ssh/id_rsa
    ForwardAgent yes
    ServerAliveInterval 60
```

### Phase 3: VS Code リモート開発設定

#### 1. VS CodeでSSH接続
1. VS Code起動
2. `Cmd+Shift+P` → "Remote-SSH: Connect to Host"
3. "mac-mini-server" を選択
4. 新しいVS Codeウィンドウでリモート接続

#### 2. リモートでプロジェクトを開く
```bash
# リモートVS Codeで
File → Open Folder → /Users/username/個人事業/My-Web-site
```

## 🌐 ネットワーク設定の最適化

### 同一ネットワーク内での設定
両デバイスが同じWi-Fiネットワークに接続する場合:

```bash
# MacBook
IPアドレス: 192.168.151.10 (固定)

# Mac mini  
IPアドレス: 192.168.151.100 (固定)
```

### 異なるネットワークでの設定
異なるWi-Fiネットワークの場合:

1. **VPN設定**
   - Tailscale または ZeroTier使用
   - プライベートネットワーク構築

2. **ポート転送設定**
   - ルーターでポート転送設定
   - 外部IPアドレス経由でアクセス

## 🔧 実践的な設定手順

### 1. 即座に実行可能な方法
```bash
# MacBookで（現在のVS Code環境）
# Mac miniのIPアドレスを確認して直接アクセス
curl http://192.168.151.100:8080

# SSHでMac miniに接続
ssh username@192.168.151.100
```

### 2. プロジェクト同期方法
```bash
# rsyncでプロジェクトをMac miniに同期
rsync -avz --delete ~/個人事業/My-Web-site/ username@192.168.151.100:~/個人事業/My-Web-site/

# Gitを使用した同期
git push origin main  # MacBookから
ssh username@192.168.151.100 "cd ~/個人事業/My-Web-site && git pull origin main"
```

## 📱 開発ワークフロー例

### 日常的な開発サイクル
1. **MacBook**: VS Codeでコード編集
2. **同期**: Git push/pull または rsync
3. **Mac mini**: サーバー再起動・テスト
4. **MacBook**: ブラウザで http://192.168.151.100:8080 確認

### 推奨ツール
- **Git**: コード同期
- **VS Code Remote SSH**: リモート開発
- **Terminal**: SSH接続
- **Browser**: リモートサーバーテスト

## 🎯 次のステップ

### 最優先（今すぐ実行）
1. Mac miniのIPアドレス確認
2. SSH有効化
3. MacBookからSSH接続テスト

### 短期（今日中）
1. VS Code Remote SSH設定
2. プロジェクト同期設定
3. 開発ワークフローテスト

### 中期（1週間以内）
1. VPN設定（異なるネットワーク対応）
2. 自動同期設定
3. 監視システム構築

これでMacBookとMac miniの効率的なリモート開発環境が構築できます！
