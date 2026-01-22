# Netlify環境変数の設定ガイド

このガイドでは、Netlifyに環境変数を設定する詳細な手順を説明します。

---

## 📋 必要な環境変数

このシステムでは以下の環境変数が必要です：

### 🔒 認証情報（必須）
- `AUTH_USERNAME`: ログイン用ユーザー名
- `AUTH_PASSWORD`: ログイン用パスワード

### 📊 Google Sheets連携（オプション - 使う場合のみ）
- `GOOGLE_SHEET_ID`: スプレッドシートのID
- `GOOGLE_SERVICE_ACCOUNT_JSON`: サービスアカウントのJSON認証情報

---

## 🚀 ステップ1: Netlifyアカウントの作成

### 1-1. Netlifyにアクセス
1. ブラウザで https://www.netlify.com/ を開く
2. 右上の「Sign up」ボタンをクリック

### 1-2. GitHubアカウントで登録
1. 「Sign up with GitHub」を選択
2. GitHubにログイン（既にログイン済みの場合はスキップ）
3. Netlifyへのアクセス許可を承認

---

## 🔗 ステップ2: GitHubリポジトリを接続

### 2-1. 新しいサイトを作成
1. Netlifyダッシュボードにログイン
2. 「Add new site」ボタンをクリック
3. 「Import an existing project」を選択

### 2-2. GitHubを選択
1. 「Deploy with GitHub」を選択
2. リポジトリへのアクセス許可（初回のみ）
   - 「Configure Netlify on GitHub」をクリック
   - 「All repositories」または「Only select repositories」を選択
   - `My-Web-site` リポジトリを選択
   - 「Install」をクリック

### 2-3. リポジトリを選択
1. リポジトリ一覧から `yakinorinori/My-Web-site` を選択
2. 「Deploy yakinorinori/My-Web-site」をクリック

### 2-4. デプロイ設定
1. **Branch to deploy**: `main` を選択（デフォルト）
2. **Base directory**: 空欄のまま
3. **Build command**: 空欄のまま（静的サイトのため不要）
4. **Publish directory**: 空欄のまま（ルートディレクトリを使用）
5. 「Deploy」ボタンをクリック

### 2-5. デプロイ完了を待つ
- 初回デプロイには1-2分かかります
- デプロイが完了すると、自動生成されたURLが表示されます
  - 例: `https://random-name-123456.netlify.app`

---

## ⚙️ ステップ3: 環境変数の設定

### 3-1. サイト設定画面に移動
1. Netlifyダッシュボードで、作成したサイトをクリック
2. 上部メニューから「Site configuration」をクリック
3. 左サイドバーから「Environment variables」をクリック

### 3-2. 認証用の環境変数を追加

#### AUTH_USERNAME を追加
1. 「Add a variable」ボタンをクリック
2. 「Add a single variable」を選択
3. 以下を入力：
   - **Key**: `AUTH_USERNAME`
   - **Values**: あなたが決めたユーザー名（例: `admin` や `kiradan`）
   - **Scopes**: `All scopes` を選択（デフォルト）
4. 「Create variable」をクリック

#### AUTH_PASSWORD を追加
1. 「Add a variable」ボタンをクリック
2. 「Add a single variable」を選択
3. 以下を入力：
   - **Key**: `AUTH_PASSWORD`
   - **Values**: 強固なパスワードを入力
     - 推奨: 12文字以上、大文字・小文字・数字・記号を含む
     - 例: `MySecure2026Pass!`
   - **Scopes**: `All scopes` を選択
4. 「Create variable」をクリック

### 3-3. Google Sheets連携の環境変数を追加（オプション）

#### Google Sheetsを使わない場合
この手順はスキップしてください。

#### Google Sheetsを使う場合

##### GOOGLE_SHEET_ID を追加
1. **スプレッドシートのIDを取得**
   - Google Sheetsを開く
   - URLをコピー: `https://docs.google.com/spreadsheets/d/1abc...xyz/edit`
   - `/d/` の後の部分（`1abc...xyz`）がスプレッドシートID

2. **環境変数に追加**
   - 「Add a variable」→「Add a single variable」
   - **Key**: `GOOGLE_SHEET_ID`
   - **Values**: コピーしたスプレッドシートID
   - **Scopes**: `All scopes`
   - 「Create variable」をクリック

##### GOOGLE_SERVICE_ACCOUNT_JSON を追加
1. **サービスアカウントのJSONファイルを準備**
   - Google Cloud Consoleでサービスアカウントを作成
   - JSONキーをダウンロード
   - ファイルをテキストエディタで開く

2. **JSON全体をコピー**
   ```json
   {
     "type": "service_account",
     "project_id": "your-project-id",
     "private_key_id": "...",
     "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
     "client_email": "your-service-account@your-project.iam.gserviceaccount.com",
     ...
   }
   ```

3. **環境変数に追加**
   - 「Add a variable」→「Add a single variable」
   - **Key**: `GOOGLE_SERVICE_ACCOUNT_JSON`
   - **Values**: コピーしたJSON全体を貼り付け
   - **Scopes**: `All scopes`
   - 「Create variable」をクリック

---

## 🔄 ステップ4: デプロイを再実行

環境変数を追加した後、サイトを再デプロイする必要があります。

### 方法1: 自動再デプロイ（推奨）
1. GitHubリポジトリに何か変更をプッシュ
2. Netlifyが自動的に再デプロイを開始

### 方法2: 手動再デプロイ
1. Netlifyダッシュボードで「Deploys」タブをクリック
2. 「Trigger deploy」ボタンをクリック
3. 「Clear cache and deploy site」を選択
4. デプロイ完了を待つ（1-2分）

---

## ✅ ステップ5: 動作確認

### 5-1. サイトにアクセス
1. Netlifyダッシュボードで、サイトのURLをクリック
   - 例: `https://your-site-name.netlify.app`

### 5-2. ログインテスト
1. ログイン画面が表示されることを確認
2. 設定したユーザー名とパスワードでログイン
3. ログイン成功を確認

### 5-3. カスタムドメイン設定（オプション）
1. Netlifyダッシュボードで「Domain settings」をクリック
2. 「Add a domain」をクリック
3. 独自ドメインを設定（既に持っている場合）

---

## 🔍 トラブルシューティング

### ログインできない場合

1. **環境変数を確認**
   - Netlify → Site configuration → Environment variables
   - `AUTH_USERNAME` と `AUTH_PASSWORD` が正しく設定されているか確認
   - スペースや改行が入っていないか確認

2. **デプロイログを確認**
   - Netlify → Deploys → 最新のデプロイをクリック
   - エラーメッセージを確認

3. **Functionsログを確認**
   - Netlify → Functions → auth をクリック
   - ログを確認して、認証処理が動作しているか確認

4. **キャッシュをクリア**
   - Netlify → Deploys → Trigger deploy → Clear cache and deploy site

### Google Sheets連携がうまくいかない場合

1. **サービスアカウントの共有を確認**
   - Google Sheetsの「共有」設定を開く
   - サービスアカウントのメールアドレス（`...@...iam.gserviceaccount.com`）が「編集者」として追加されているか確認

2. **スプレッドシートIDを確認**
   - URLから正しいIDをコピーしたか確認
   - `/d/` と `/edit` の間の部分

3. **JSONの形式を確認**
   - JSONファイル全体をコピーしたか確認
   - 改行や特殊文字が正しくエスケープされているか確認

---

## 📝 環境変数一覧（まとめ）

| 変数名 | 必須 | 説明 | 例 |
|--------|------|------|-----|
| `AUTH_USERNAME` | ✅ 必須 | ログイン用ユーザー名 | `admin` |
| `AUTH_PASSWORD` | ✅ 必須 | ログイン用パスワード | `MySecure2026Pass!` |
| `GOOGLE_SHEET_ID` | ⚪ オプション | スプレッドシートID | `1abc...xyz` |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | ⚪ オプション | サービスアカウントJSON | `{"type":"service_account",...}` |

---

## 🎉 完了！

これで環境変数の設定が完了しました。

- ログイン機能が使えるようになります
- Google Sheets連携を設定した場合、データの同期が可能になります

何か問題がある場合は、トラブルシューティングセクションを参照してください。
