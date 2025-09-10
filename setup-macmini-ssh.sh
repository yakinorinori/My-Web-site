#!/bin/bash

# Mac mini SSH設定 クイックセットアップスクリプト
# Mac miniで直接実行してください

echo "🔧 Mac mini SSH設定開始..."

# 現在のユーザー確認
CURRENT_USER=$(whoami)
echo "📋 現在のユーザー: $CURRENT_USER"

# SSH有効化
echo "🔐 SSH を有効化中..."
sudo systemsetup -setremotelogin on

# SSH状態確認
SSH_STATUS=$(sudo systemsetup -getremotelogin)
echo "📊 SSH状態: $SSH_STATUS"

# SSHディレクトリ作成
echo "📁 SSH設定ディレクトリ作成..."
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# authorized_keys ファイル準備
if [ ! -f ~/.ssh/authorized_keys ]; then
    touch ~/.ssh/authorized_keys
    chmod 600 ~/.ssh/authorized_keys
    echo "✅ authorized_keys ファイル作成完了"
else
    echo "📄 authorized_keys ファイル既存"
fi

# SSH設定確認
echo "🔍 SSH設定確認..."
echo "   - SSHサービス: $(launchctl list | grep -q ssh && echo '有効' || echo '無効')"
echo "   - ポート22: $(lsof -i :22 > /dev/null 2>&1 && echo '開放' || echo '未開放')"

# ファイアウォール状態確認
FIREWALL_STATUS=$(sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate)
echo "🛡️  ファイアウォール状態: $FIREWALL_STATUS"

# ネットワーク情報表示
IP_ADDRESS=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
echo ""
echo "🌐 ネットワーク情報:"
echo "   - IPアドレス: $IP_ADDRESS"
echo "   - ユーザー名: $CURRENT_USER"
echo ""

# MacBookでの接続コマンド表示
echo "💻 MacBookから接続する場合のコマンド:"
echo "   ssh $CURRENT_USER@$IP_ADDRESS"
echo ""

# 公開鍵追加の説明
echo "🔑 SSH鍵認証設定:"
echo "   1. MacBookで公開鍵を生成:"
echo "      ssh-keygen -t rsa -b 4096 -C 'macbook-to-macmini'"
echo ""
echo "   2. MacBookで公開鍵を表示:"
echo "      cat ~/.ssh/id_rsa.pub"
echo ""
echo "   3. Mac miniで公開鍵を追加:"
echo "      echo 'MacBookの公開鍵をここにペースト' >> ~/.ssh/authorized_keys"
echo ""

# SSHサービス再起動
echo "🔄 SSHサービス再起動..."
sudo launchctl stop com.openssh.sshd
sudo launchctl start com.openssh.sshd

echo "✅ Mac mini SSH設定完了！"
echo ""
echo "📋 確認事項:"
echo "   - [ ] SSH有効化完了"
echo "   - [ ] authorized_keys設定完了"
echo "   - [ ] MacBookからの接続テスト"
echo ""
echo "🎯 次のステップ:"
echo "   MacBookで: ssh $CURRENT_USER@$IP_ADDRESS"
