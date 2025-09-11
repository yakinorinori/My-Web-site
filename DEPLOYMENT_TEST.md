# 🚀 デプロイメントテスト

## テスト実行日時
- **日時**: 2025年9月12日
- **目的**: Mac mini SSH自動デプロイテスト

## Secrets設定完了
✅ SSH_PRIVATE_KEY  
✅ MAC_MINI_HOST: 192.168.151.100  
✅ MAC_MINI_USER: akinoriyamaguchi  

## 期待される動作
1. GitHub Actions が自動実行
2. GitHub Pages デプロイ成功
3. Mac mini SSH接続テスト成功
4. Mac mini デプロイ実行

## Mac mini 側で実行すべきコマンド
```bash
# SSH権限設定
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh

# プロジェクトディレクトリ確認
cd ~/個人事業/My-Web-site
pwd
ls -la
```

---
**テスト開始**: $(date)
