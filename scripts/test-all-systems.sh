#!/bin/bash

# Mac miniサーバー統合テストスクリプト

MAC_MINI_IP="192.168.151.190"
FRONTEND_PORT="8083"
BACKEND_PORT="3001"
BASE_URL="http://$MAC_MINI_IP"

echo "🧪 Mac miniサーバー統合テスト開始..."
echo "対象: $BASE_URL"
echo "時刻: $(date)"
echo ""

# テスト結果カウンター
PASSED=0
FAILED=0

# テスト関数
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_code="$3"
    
    echo -n "🔍 $test_name ... "
    
    if [ -n "$expected_code" ]; then
        response_code=$(eval "$test_command" 2>/dev/null)
        if [ "$response_code" = "$expected_code" ]; then
            echo "✅ PASS"
            PASSED=$((PASSED + 1))
        else
            echo "❌ FAIL (期待値: $expected_code, 実際: $response_code)"
            FAILED=$((FAILED + 1))
        fi
    else
        if eval "$test_command" >/dev/null 2>&1; then
            echo "✅ PASS"
            PASSED=$((PASSED + 1))
        else
            echo "❌ FAIL"
            FAILED=$((FAILED + 1))
        fi
    fi
}

echo "📡 基本接続テスト"
echo "=================="
run_test "ネットワーク接続" "ping -c 1 $MAC_MINI_IP" ""
run_test "SSH接続" "ssh -o ConnectTimeout=5 -o BatchMode=yes macmini exit" ""

echo ""
echo "🌐 HTTPサービステスト"
echo "==================="
run_test "フロントエンド応答" "curl -s -o /dev/null -w '%{http_code}' $BASE_URL:$FRONTEND_PORT" "200"
run_test "バックエンドヘルスチェック" "curl -s -o /dev/null -w '%{http_code}' $BASE_URL:$BACKEND_PORT/health" "200"

echo ""
echo "🔐 認証システムテスト"
echo "==================="

# 認証APIテスト
echo "認証APIテスト実行中..."
login_response=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d '{"username":"user1","password":"password123"}' \
    -c /tmp/cookies.txt \
    -w "%{http_code}" \
    "$BASE_URL:$BACKEND_PORT/login")

echo -n "🔍 ログイン (user1) ... "
if echo "$login_response" | grep -q "200"; then
    echo "✅ PASS"
    PASSED=$((PASSED + 1))
    
    # 認証が必要なエンドポイントのテスト
    echo -n "🔍 データ取得 (認証済み) ... "
    data_response=$(curl -s -b /tmp/cookies.txt -w "%{http_code}" "$BASE_URL:$BACKEND_PORT/api/data")
    if echo "$data_response" | grep -q "200"; then
        echo "✅ PASS"
        PASSED=$((PASSED + 1))
    else
        echo "❌ FAIL"
        FAILED=$((FAILED + 1))
    fi
    
    # ログアウトテスト
    echo -n "🔍 ログアウト ... "
    logout_response=$(curl -s -X POST -b /tmp/cookies.txt -w "%{http_code}" "$BASE_URL:$BACKEND_PORT/logout")
    if echo "$logout_response" | grep -q "200"; then
        echo "✅ PASS"
        PASSED=$((PASSED + 1))
    else
        echo "❌ FAIL"
        FAILED=$((FAILED + 1))
    fi
else
    echo "❌ FAIL"
    FAILED=$((FAILED + 1))
fi

echo ""
echo "📊 パフォーマンステスト"
echo "===================="

# レスポンス時間テスト
echo -n "🔍 フロントエンド応答時間 ... "
frontend_time=$(curl -s -o /dev/null -w "%{time_total}" "$BASE_URL:$FRONTEND_PORT")
if [ $(echo "$frontend_time < 2.0" | bc) -eq 1 ]; then
    echo "✅ PASS (${frontend_time}s)"
    PASSED=$((PASSED + 1))
else
    echo "❌ FAIL (${frontend_time}s > 2.0s)"
    FAILED=$((FAILED + 1))
fi

echo -n "🔍 バックエンド応答時間 ... "
backend_time=$(curl -s -o /dev/null -w "%{time_total}" "$BASE_URL:$BACKEND_PORT/health")
if [ $(echo "$backend_time < 1.0" | bc) -eq 1 ]; then
    echo "✅ PASS (${backend_time}s)"
    PASSED=$((PASSED + 1))
else
    echo "❌ FAIL (${backend_time}s > 1.0s)"
    FAILED=$((FAILED + 1))
fi

echo ""
echo "🔧 システムリソーステスト"
echo "======================"

# Mac miniのシステム状況確認
ssh macmini "
    # CPU使用率
    cpu_usage=\$(top -l 1 | grep 'CPU usage' | awk '{print \$3}' | sed 's/%//')
    echo -n '🔍 CPU使用率 ... '
    if [ \$(echo \"\$cpu_usage < 80\" | bc) -eq 1 ]; then
        echo \"✅ PASS (\${cpu_usage}%)\"
    else
        echo \"❌ FAIL (\${cpu_usage}% > 80%)\"
    fi
    
    # メモリ使用率
    mem_used=\$(top -l 1 | grep 'PhysMem' | awk '{print \$2}' | sed 's/[^0-9.]//g')
    mem_total=\$(sysctl hw.memsize | awk '{print \$2/1024/1024/1024}')
    mem_percent=\$(echo \"scale=2; \$mem_used/\$mem_total*100\" | bc)
    echo -n '🔍 メモリ使用率 ... '
    if [ \$(echo \"\$mem_percent < 80\" | bc) -eq 1 ]; then
        echo \"✅ PASS (\${mem_percent}%)\"
    else
        echo \"❌ FAIL (\${mem_percent}% > 80%)\"
    fi
    
    # ディスク使用率
    disk_usage=\$(df -h ~ | tail -1 | awk '{print \$5}' | sed 's/%//')
    echo -n '🔍 ディスク使用率 ... '
    if [ \$disk_usage -lt 90 ]; then
        echo \"✅ PASS (\${disk_usage}%)\"
    else
        echo \"❌ FAIL (\${disk_usage}% > 90%)\"
    fi
"

# 一時ファイル削除
rm -f /tmp/cookies.txt

echo ""
echo "📋 テスト結果サマリー"
echo "=================="
echo "✅ 成功: $PASSED"
echo "❌ 失敗: $FAILED"
echo "📊 成功率: $(echo "scale=1; $PASSED*100/($PASSED+$FAILED)" | bc)%"

if [ $FAILED -eq 0 ]; then
    echo ""
    echo "🎉 すべてのテストが成功しました！"
    echo "Mac miniサーバーは正常に動作しています。"
else
    echo ""
    echo "⚠️  $FAILED 個のテストが失敗しました。"
    echo "システムの設定を確認してください。"
fi

echo ""
echo "🔗 アクセスリンク:"
echo "   📱 Webアプリ: $BASE_URL:$FRONTEND_PORT"
echo "   🔧 API: $BASE_URL:$BACKEND_PORT"
