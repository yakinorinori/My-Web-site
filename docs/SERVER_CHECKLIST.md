# Mac mini サーバー運用チェックリスト

## 🚀 Mac mini サーバー設定完了

### 📋 実装済み機能
- ✅ サーバー自動起動スクリプト (`start-production-server.sh`)
- ✅ サーバー停止スクリプト (`stop-server.sh`)
- ✅ プロダクション環境設定
- ✅ ログ管理システム
- ✅ プロセス監視機能

---

## 🔧 即座に実行可能な設定

### 1. 基本サーバー起動
```bash
# 開発環境（現在使用中）
./start-secure.sh

# プロダクション環境
./start-production-server.sh
```

### 2. ネットワーク設定
```bash
# 現在のIPアドレス確認
ifconfig | grep "inet " | grep -v 127.0.0.1

# ファイアウォール設定確認
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate
```

### 3. 自動起動設定（推奨）
```bash
# LaunchAgent作成
sudo nano /Library/LaunchDaemons/com.salesanalysis.plist
```

---

## 📊 現在のシステム状態

### 稼働確認
- **フロントエンド**: http://localhost:8080 ✅
- **バックエンド**: http://localhost:3001 ✅
- **認証システム**: 有効 ✅
- **データAPI**: 正常動作 ✅

### セキュリティ状態
- ユーザー認証: 3ユーザー登録済み
- セッション管理: 有効
- データ保護: バックエンド集約完了
- CORS設定: 適切に設定

---

## 🎯 次のステップ（優先順）

### 1. 最重要（即実行）
- [ ] **固定IPアドレス設定**
  ```
  1. システム環境設定 → ネットワーク を開く
  2. 使用中のネットワーク（Wi-FiまたはEthernet）を選択
  3. 「詳細...」ボタンをクリック
  4. 「TCP/IP」タブを選択
  5. 「IPv4の設定」を「手動」に変更
  6. 以下を設定:
     - IPアドレス: 192.168.1.100 (ルーターに合わせて調整)
     - サブネットマスク: 255.255.255.0
     - ルーター: 192.168.1.1 (ルーターのIPアドレス)
  7. 「DNS」タブでDNSサーバーを設定:
     - 8.8.8.8 (Google DNS)
     - 8.8.4.4 (Google DNS代替)
  8. 「OK」→「適用」をクリック
  ```

- [ ] **SSH有効化**
  ```bash
  sudo systemsetup -setremotelogin on
  ```

### 2. 重要（1週間以内）
- [ ] **SSL証明書設定**
- [ ] **ドメイン名設定**
- [ ] **自動バックアップ設定**
- [ ] **監視システム構築**

### 3. 推奨（1ヶ月以内）
- [ ] **Nginx/Apache導入**
- [ ] **データベース移行（CSV→SQLite）**
- [ ] **ログローテーション設定**
- [ ] **パフォーマンス最適化**

---

## 💡 運用のコツ

### 日常管理
1. **毎日**: システム稼働確認（5分）
2. **週1回**: ログ確認とクリーンアップ（15分）
3. **月1回**: セキュリティアップデート（30分）

### トラブル対応
```bash
# サービス状態確認
ps aux | grep python

# ログ確認
tail -f logs/backend.log
tail -f logs/frontend.log

# 緊急停止・再起動
./stop-server.sh
./start-production-server.sh
```

### バックアップ戦略
```bash
# 毎日自動バックアップ（cron設定）
0 2 * * * /Users/x21095xx/個人事業/My-Web-site/backup.sh
```

---

## 🏆 完了チェック

現在の状態で既に以下が実現されています：

✅ **Webサーバー**: Python http.server（本格運用時はNginx推奨）  
✅ **アプリケーションサーバー**: Flask（認証付き）  
✅ **データ管理**: バックエンド集約済み  
✅ **セキュリティ**: 3ユーザー認証システム  
✅ **自動化**: 起動・停止スクリプト完備  

**あなたのMac miniは今すぐサーバーとして稼働可能です！** 🎉
