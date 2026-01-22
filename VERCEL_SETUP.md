# Vercel環境変数の設定ガイド

Netlifyからの移行用。Vercelは無料枠が充実しており、サーバーレス関数も無料で使えます。

---

## 📋 必要な環境変数

### 🔒 認証情報（必須）
- `AUTH_USERNAME`: ログイン用ユーザー名
- `AUTH_PASSWORD`: ログイン用パスワード

### 📊 Google Sheets連携（オプション - 使う場合のみ）
- `GOOGLE_SHEET_ID`: スプレッドシートのID
- `GOOGLE_SERVICE_ACCOUNT_JSON`: サービスアカウントのJSON認証情報

---

## 🚀 ステップ1: Vercelアカウントの作成

### 1-1. Vercelにアクセス
1. ブラウザで https://vercel.com/ を開く
2. 右上の「Sign Up」ボタンをクリック

### 1-2. GitHubアカウントで登録
1. 「Continue with GitHub」を選択
2. GitHubにログイン（既にログイン済みの場合はスキップ）
3. Vercelへのアクセス許可を承認

---

## 🔗 ステップ2: GitHubリポジトリをインポート

### 2-1. 新しいプロジェクトを作成
1. Vercelダッシュボードにログイン
2. 「Add New...」→「Project」をクリック

### 2-2. GitHubリポジトリを選択
1. 「Import Git Repository」セクションで
2. `yakinorinori/My-Web-site` を検索
3. 「Import」ボタンをクリック

### 2-3. プロジェクト設定
1. **Project Name**: そのまま `My-Web-site` でOK
2. **Framework Preset**: `Other` を選択
3. **Root Directory**: `.` (そのまま)
4. **Build Command**: 空欄のまま（静的サイト）
5. **Output Directory**: `.` (そのまま)
6. 「Deploy」ボタンをクリック

### 2-4. デプロイ完了を待つ
- 初回デプロイには1-2分かかります
- デプロイが完了すると、自動生成されたURLが表示されます
  - 例: `https://my-web-site-xxxx.vercel.app`

---

## ⚙️ ステップ3: 環境変数の設定

### 3-1. プロジェクト設定画面に移動
1. Vercelダッシュボードで、作成したプロジェクトをクリック
2. 上部メニューから「Settings」をクリック
3. 左サイドバーから「Environment Variables」をクリック

### 3-2. 認証用の環境変数を追加

#### AUTH_USERNAME を追加
1. 「Key」に `AUTH_USERNAME` と入力
2. 「Value」にあなたが決めたユーザー名を入力（例: `myusername`）
3. 「Environment」は以下を**すべて**選択：
   - ✅ Production
   - ✅ Preview
   - ✅ Development
4. 「Save」ボタンをクリック

#### AUTH_PASSWORD を追加
1. 「Key」に `AUTH_PASSWORD` と入力
2. 「Value」に強固なパスワードを入力
   - 推奨: 12文字以上、大文字・小文字・数字・記号を含む
   - 例: `MySecure2026Pass!`
3. 「Environment」は以下を**すべて**選択：
   - ✅ Production
   - ✅ Preview
   - ✅ Development
4. 「Save」ボタンをクリック

### 3-3. Google Sheets連携の環境変数を追加（オプション）

#### Google Sheetsを使わない場合
この手順はスキップしてください。

#### Google Sheetsを使う場合

##### GOOGLE_SHEET_ID を追加
1. **Key**: `GOOGLE_SHEET_ID`
2. **Value**: スプレッドシートのID（例: `15m6uUYUOn8UU4hwOMVHPDqEcQl5-jW-EfgCgsg43ubw`）
3. **Environment**: すべて選択
4. 「Save」をクリック

##### GOOGLE_SERVICE_ACCOUNT_JSON を追加
1. **Key**: `GOOGLE_SERVICE_ACCOUNT_JSON`
2. **Value**: サービスアカウントのJSON全体を貼り付け
3. **Environment**: すべて選択
4. 「Save」をクリック

---

## 🔄 ステップ4: デプロイを再実行

環境変数を追加した後、サイトを再デプロイする必要があります。

### 方法1: 自動再デプロイ（推奨）
1. GitHubリポジトリに何か変更をプッシュ
2. Vercelが自動的に再デプロイを開始

### 方法2: 手動再デプロイ
1. Vercelダッシュボードで「Deployments」タブをクリック
2. 最新のデプロイの右側にある「...」メニューをクリック
3. 「Redeploy」を選択
4. デプロイ完了を待つ（1-2分）

---

## ✅ ステップ5: 動作確認

### 5-1. サイトにアクセス
1. Vercelダッシュボードで、「Visit」ボタンをクリック
   - または、表示されているURL（例: `https://my-web-site-xxxx.vercel.app`）をクリック

### 5-2. ログインテスト
1. ログイン画面が表示されることを確認
2. 設定したユーザー名とパスワードでログイン
3. ログイン成功を確認

### 5-3. カスタムドメイン設定（オプション）
1. Vercelダッシュボードで「Settings」→「Domains」をクリック
2. 「Add」ボタンをクリック
3. 独自ドメインを設定（既に持っている場合）

---

## 🔍 トラブルシューティング

### ログインできない場合

1. **環境変数を確認**
   - Vercel → Settings → Environment Variables
   - `AUTH_USERNAME` と `AUTH_PASSWORD` が正しく設定されているか確認
   - すべての環境（Production, Preview, Development）にチェックが入っているか確認

2. **デプロイログを確認**
   - Vercel → Deployments → 最新のデプロイをクリック
   - 「Building」タブでエラーメッセージを確認

3. **Functionsログを確認**
   - Vercel → Deployments → 最新のデプロイ → 「Functions」タブ
   - `/api/auth` の実行ログを確認

4. **再デプロイを実行**
   - 環境変数を変更した後は必ず再デプロイが必要

### Google Sheets連携がうまくいかない場合

1. **サービスアカウントの共有を確認**
   - Google Sheetsの「共有」設定を開く
   - サービスアカウントのメールアドレスが「編集者」として追加されているか確認

2. **スプレッドシートIDを確認**
   - URLから正しいIDをコピーしたか確認
   - `/d/` と `/edit` の間の部分

3. **JSONの形式を確認**
   - JSONファイル全体をコピーしたか確認
   - 改行や特殊文字が正しく含まれているか確認

---

## 📝 環境変数一覧（まとめ）

| 変数名 | 必須 | 説明 | 例 |
|--------|------|------|-----|
| `AUTH_USERNAME` | ✅ 必須 | ログイン用ユーザー名 | `yourname` |
| `AUTH_PASSWORD` | ✅ 必須 | ログイン用パスワード | `MySecure2026Pass!` |
| `GOOGLE_SHEET_ID` | ⚪ オプション | スプレッドシートID | `15m6uUYUOn8UU...` |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | ⚪ オプション | サービスアカウントJSON | `{"type":"service_account",...}` |

---

## 🎉 Netlifyとの違い

### Vercelのメリット
- ✅ **無料枠が充実**: 100GB帯域幅/月（Netlify: 100GB）
- ✅ **サーバーレス関数**: 100時間/月まで無料
- ✅ **自動プレビュー**: プルリクエストごとに自動デプロイ
- ✅ **グローバルCDN**: 高速配信
- ✅ **簡単なデプロイ**: GitHubと完全統合

### パスの変更点
| 機能 | Netlify | Vercel |
|------|---------|--------|
| 認証API | `/.netlify/functions/auth` | `/api/auth` |
| 関数の場所 | `netlify/functions/` | `api/` |

---

## 🎯 完了！

これでVercelへの移行が完了しました。

- ログイン機能が使えるようになります
- Google Sheets連携を設定した場合、データの同期が可能になります
- 無料枠で十分使えます

何か問題がある場合は、トラブルシューティングセクションを参照してください。
