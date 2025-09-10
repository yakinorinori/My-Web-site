## 🌐 **GitHubリポジトリ作成手順**

### 1. GitHub.comでの設定
1. https://github.com にアクセス
2. 「New repository」をクリック
3. リポジトリ名: `My-Web-site` （または好きな名前）
4. Description: `売上管理Webシステム - Mac miniサーバー対応`
5. Public/Private を選択
6. 「Create repository」をクリック

### 2. ローカルからのプッシュ
```bash
# GitHubリポジトリのURLを設定
git remote add origin https://github.com/yakinorinori/My-Web-site.git

# メインブランチにプッシュ
git branch -M main
git push -u origin main
```

### 3. GitHub Pages設定（無料ホスティング）
1. リポジトリページで「Settings」タブ
2. 左メニューから「Pages」
3. Source: Deploy from a branch
4. Branch: main / (root)
5. 「Save」をクリック

### 4. GitHub Actions設定
- `.github/workflows/deploy.yml` が自動でCI/CD設定
- Mac miniの情報を GitHub Secrets に設定：
  - `MAC_MINI_HOST`: 192.168.151.100
  - `MAC_MINI_USER`: akinoriyamaguchi
  - `SSH_PRIVATE_KEY`: SSH秘密鍵

### 5. どこからでもアクセス可能なURL
- **GitHub Pages**: https://yakinorinori.github.io/My-Web-site
- **Mac miniサーバー**: http://192.168.151.100:8083
- **開発環境**: ローカルでの開発・テスト
