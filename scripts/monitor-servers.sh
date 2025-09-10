#!/bin/bash

# サーバー監視とメンテナンススクリプト

MAC_MINI_IP="192.168.151.100"
FRONTEND_PORT="8083"
BACKEND_PORT="3001"

echo "🔍 Mac miniサーバー監視開始..."
echo "時刻: $(date)"
echo ""

# ネットワーク接続確認
echo "📡 ネットワーク状況:"
if ping -c 3 $MAC_MINI_IP > /dev/null 2>&1; then
    echo "✅ Mac mini応答正常 ($MAC_MINI_IP)"
else
    echo "❌ Mac mini応答なし ($MAC_MINI_IP)"
    exit 1
fi

# サーバーポート確認
echo ""
echo "🚀 サーバー状況:"

# フロントエンドサーバー確認
echo -n "フロントエンド (ポート$FRONTEND_PORT): "
if curl -s -o /dev/null -w "%{http_code}" "http://$MAC_MINI_IP:$FRONTEND_PORT" | grep -q "200"; then
    echo "✅ 正常"
else
    echo "❌ 応答なし"
fi

# バックエンドサーバー確認
echo -n "バックエンド (ポート$BACKEND_PORT): "
if curl -s -o /dev/null -w "%{http_code}" "http://$MAC_MINI_IP:$BACKEND_PORT/health" | grep -q "200"; then
    echo "✅ 正常"
else
    echo "❌ 応答なし"
fi

# SSH経由でサーバープロセス確認
echo ""
echo "💾 プロセス状況:"
ssh macmini "
    echo 'フロントエンドプロセス:'
    ps aux | grep 'http.server' | grep -v grep || echo '  プロセスなし'
    echo ''
    echo 'バックエンドプロセス:'
    ps aux | grep 'app.py' | grep -v grep || echo '  プロセスなし'
    echo ''
    echo 'システムリソース:'
    echo '  CPU使用率: ' \$(top -l 1 | grep 'CPU usage' | awk '{print \$3}')
    echo '  メモリ使用率: ' \$(top -l 1 | grep 'PhysMem' | awk '{print \$2}')
    echo '  ディスク使用量: ' \$(df -h ~ | tail -1 | awk '{print \$5}')
"

# ログ確認
echo ""
echo "📝 最新ログ (直近10行):"
ssh macmini "
    if [ -f ~/個人事業/My-Web-site/logs/access.log ]; then
        echo 'アクセスログ:'
        tail -10 ~/個人事業/My-Web-site/logs/access.log
    else
        echo 'アクセスログファイルが見つかりません'
    fi
    echo ''
    if [ -f ~/個人事業/My-Web-site/logs/error.log ]; then
        echo 'エラーログ:'
        tail -10 ~/個人事業/My-Web-site/logs/error.log
    else
        echo 'エラーログファイルが見つかりません'
    fi
"

echo ""
echo "🎯 監視完了"
echo "次回監視: $(date -v +1H)"
