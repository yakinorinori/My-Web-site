# Google Sheets API サービスアカウント設定ガイド

## 問題の背景

Google Sheets API v4では、**APIキーでは読み取り専用**の操作しかできません。
データの書き込み（append）には、**OAuth2認証**または**サービスアカウント**が必要です。

このシステムでは、セキュリティと使いやすさから**サービスアカウント**を使用します。

---

## 🔧 設定手順

### 1️⃣ Google Cloud Consoleでサービスアカウントを作成

1. **Google Cloud Console**にアクセス
   - https://console.cloud.google.com/

2. **プロジェクトを選択**（または新規作成）
   - 左上のプロジェクト名をクリック
   - 既存のプロジェクトを選択、または「新しいプロジェクト」を作成

3. **Google Sheets APIを有効化**
   - 左側メニュー → 「APIとサービス」 → 「ライブラリ」
   - "Google Sheets API" を検索
   - 「有効にする」をクリック

4. **サービスアカウントを作成**
   - 左側メニュー → 「APIとサービス」 → 「認証情報」
   - 「認証情報を作成」 → 「サービスアカウント」
   - サービスアカウント名を入力（例: `sheets-api-service`）
   - 「作成して続行」をクリック
   - ロール: 「基本」→「編集者」を選択
   - 「完了」をクリック

5. **JSONキーを作成**
   - 作成したサービスアカウントをクリック
   - 「キー」タブ → 「鍵を追加」 → 「新しい鍵を作成」
   - キーのタイプ: **JSON**
   - 「作成」をクリック
   - **JSONファイルが自動的にダウンロードされます**（重要！安全に保管）

### 2️⃣ スプレッドシートに権限を付与

1. **ダウンロードしたJSONファイル**を開く
2. `client_email` の値をコピー
   ```json
   {
     "type": "service_account",
     "project_id": "...",
     "private_key_id": "...",
     "private_key": "...",
     "client_email": "sheets-api-service@your-project.iam.gserviceaccount.com",  ← これをコピー
     ...
   }
   ```

3. **対象のGoogle スプレッドシート**を開く
4. 右上の「共有」ボタンをクリック
5. コピーした `client_email` を貼り付け
6. 権限: **編集者**を選択
7. 「送信」をクリック

### 3️⃣ Netlifyに環境変数を設定

#### 重要な環境変数

このシステムでは**2つの環境変数**が必要です：

1. **`GOOGLE_SERVICE_ACCOUNT_JSON`** - サービスアカウントの認証情報
2. **`GOOGLE_SHEET_ID`** - 対象スプレッドシートのID

---

#### 🔒 GOOGLE_SERVICE_ACCOUNT_JSON の設定

1. **Netlify Dashboard**にアクセス
   - https://app.netlify.com/

2. **サイトを選択**
   - "yakinorisalesanalysis" サイトをクリック

3. **環境変数を設定**
   - 「Site configuration」 → 「Environment variables」
   - 「Add a variable」 → 「Add a single variable」

4. **変数を入力**
   - **Key**: `GOOGLE_SERVICE_ACCOUNT_JSON`
   - **Value**: JSONファイルの**全内容**をコピー＆ペースト
     ```json
     {
       "type": "service_account",
       "project_id": "your-project-id",
       "private_key_id": "...",
       "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
       "client_email": "sheets-api-service@your-project.iam.gserviceaccount.com",
       ...
     }
     ```
   - **Scopes**: `All scopes`（全環境で使用）
   - 「Create variable」をクリック

---

#### 🔒 GOOGLE_SHEET_ID の設定

**セキュリティ上の理由により、スプレッドシートIDはクライアント側（ブラウザ）に保存しません。**
代わりに、Netlify環境変数として安全に管理します。

1. **スプレッドシートのIDを取得**
   - Google スプレッドシートのURLから抽出します
   - 例: `https://docs.google.com/spreadsheets/d/1abc...xyz/edit`
   - ID部分: `1abc...xyz`

2. **環境変数を追加**
   - Netlify Dashboard → 「Environment variables」
   - 「Add a variable」 → 「Add a single variable」
   - **Key**: `GOOGLE_SHEET_ID`
   - **Value**: 上記で取得したスプレッドシートID
   - **Scopes**: `All scopes`
   - 「Create variable」をクリック

---

#### ✅ デプロイを実行

5. **デプロイをトリガー**
   - 「Deploys」タブに移動
   - 「Trigger deploy」 → 「Clear cache and deploy site」
   
   または、GitHubにプッシュすれば自動デプロイされます。

---

## ✅ 確認方法

### デプロイログを確認

1. Netlify Dashboard → 「Deploys」
2. 最新のデプロイをクリック
3. 「Function logs」を確認
4. エラーがなければ成功

### 実際にテスト

1. **モバイル売上報告**を開く
2. データを入力して送信
3. ブラウザのコンソール（F12 → Console）を確認
4. スプレッドシートを開いて、データが追加されているか確認

---

## 🔍 トラブルシューティング

### エラー: "GOOGLE_SERVICE_ACCOUNT_JSON environment variable is not set"

**原因**: 環境変数が設定されていない、または名前が間違っている

**解決策**:
- Netlify Dashboardで環境変数名を確認
- 正確に `GOOGLE_SERVICE_ACCOUNT_JSON` と入力（大文字小文字を区別）
- 再デプロイする

### エラー: "Invalid GOOGLE_SERVICE_ACCOUNT_JSON format"

**原因**: JSON形式が正しくない

**解決策**:
- JSONファイルの内容を**そのままコピー**（改行も含めて）
- 余分なスペースや改行を追加しない
- JSONバリデーターで確認: https://jsonlint.com/

### エラー: "Permission denied" または "403 Forbidden"

**原因**: スプレッドシートにサービスアカウントの権限がない

**解決策**:
- スプレッドシートの「共有」設定を確認
- サービスアカウントの `client_email` が「編集者」権限で追加されているか確認
- もう一度共有設定を試す

### データが書き込まれない

**原因**: シート名が一致していない、または範囲が間違っている

**解決策**:
- スプレッドシートのシート名を確認（デフォルト: 「売上データ」）
- ブラウザコンソールのログを確認
- Netlifyのログを確認

---

## 📚 参考リンク

- [Google Cloud Console](https://console.cloud.google.com/)
- [Google Sheets API ドキュメント](https://developers.google.com/sheets/api)
- [サービスアカウント認証](https://cloud.google.com/docs/authentication)
- [Netlify環境変数](https://docs.netlify.com/environment-variables/overview/)

---

## 🔒 セキュリティに関する注意

1. **JSONキーは絶対に公開しない**
   - GitHubにコミットしない
   - `.gitignore`に追加する
   - 環境変数のみで管理

2. **最小権限の原則**
   - サービスアカウントには必要最小限の権限のみ付与
   - スプレッドシートも必要なものだけ共有

3. **定期的なキーローテーション**
   - 半年〜1年ごとに新しいキーを作成
   - 古いキーを削除

---

完了したら、モバイルから売上報告を送信してテストしてください！
