# 📊 売上管理システム

## 🌐 デモサイト
- **GitHub Pages**: https://yakinorinori.github.io/My-Web-site/
- **📱 モバイル売上報告**: https://yakinorinori.github.io/My-Web-site/mobile.html

## 🎯 機能

### 📊 **デスクトップ版（メイン機能）**
- 売上データの可視化（グラフ表示）
- 月別・年別分析
- 曜日別統計
- 顧客別売上分析
- セキュアなログイン認証
- **Google Sheets連携（NEW!）**
  - データの自動同期（読み込み・書き込み）
  - 既存データのインポート
  - リアルタイム更新

### 📱 **モバイル版（NEW!）**
- PWA対応のモバイル売上報告システム
- カメラ撮影で伝票の直接取込み
- iPhone写真アプリへの自動保存
- リアルタイム画像処理とレイアウト生成
- オフライン対応
- **Google Sheetsへ自動送信**

## 🚀 利用方法

### 🏪 **テンプレートとして導入する（5分セットアップ）**

このシステムはテンプレートとして**すぐに使えます**！

1. **� セットアップガイドを確認**
   - [5分セットアップガイド](docs/TEMPLATE_SETUP_GUIDE.md) をご覧ください

2. **�📊 Google Sheetsを準備**
   - 新しいシートを作成し「売上データ」と命名
   - 共有設定を「編集者」に変更

3. **⚙️ システムに設定**
   - スプレッドシートIDを入力
   - API Keyを入力（提供済み）
   - 設定保存ボタンをクリック

4. **✅ 完了！**
   - データの読み込み・書き込みが可能に
   - モバイルアプリからも自動送信

詳細は [TEMPLATE_SETUP_GUIDE.md](docs/TEMPLATE_SETUP_GUIDE.md) をご覧ください。

---

### 📊 **デスクトップ版 - GitHub Pages（デモ版）**
1. https://yakinorinori.github.io/My-Web-site/ にアクセス
2. デモ用アカウントでログイン：
   - `kiradan` / `kiradan2024!`
   - `user1` / `password123`
3. デモデータ（sales.csv）でグラフや統計を確認

### 📱 **モバイル版 - 売上報告システム（NEW!）**
1. https://yakinorinori.github.io/My-Web-site/mobile.html にアクセス
2. スマートフォンのホーム画面に追加（PWAとしてインストール）
3. 伝票をカメラで撮影
4. 支払い方法と金額を入力
5. 報告書を自動生成してiPhone写真アプリに保存
6. **Google Sheetsへ自動送信**（設定済みの場合）

## 📁 プロジェクト構造
```
My-Web-site/
├── index.html          # メインページ（デスクトップ版）
├── mobile.html         # モバイル売上報告ページ（NEW!）
├── main.js             # フロントエンドロジック
├── style.css           # スタイル
├── sales.csv           # 📊 デモデータ（サンプル売上データ）
├── manifest.json       # PWA設定
├── sw.js              # サービスワーカー
├── js/                # JavaScriptモジュール
│   ├── mobile.js      # モバイル売上報告システム
│   ├── auth.js        # 認証機能
│   ├── data.js        # データ処理
│   ├── charts.js      # グラフ表示
│   ├── reports.js     # レポート機能
│   └── ui.js          # UI制御
├── backend/           # Flask API サーバー
│   └── data/
│       └── sales.csv  # 📊 デモデータ（バックエンド用）
├── frontend/          # 開発用フロントエンド
│   └── sales.csv      # 📊 デモデータ（フロントエンド用）
├── scripts/           # 運用スクリプト
└── .github/workflows/ # CI/CD 設定
```

## 🔧 開発環境
```bash
# リポジトリクローン
git clone https://github.com/yakinorinori/My-Web-site.git
cd My-Web-site

# バックエンド起動
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app_http.py

# フロントエンド起動
cd frontend
python3 -m http.server 8080
```

## 🚀 デプロイメント
- **GitHub Pages**: プッシュ時に自動デプロイ ✅ 常時稼働
- **Netlify Functions**: サーバーレス関数で認証とGoogle Sheets API を使用

### Netlify Functions の設定（重要）

このシステムでは**3つの環境変数**が必要です：

#### 🔒 認証情報

1. **`AUTH_USERNAME`**
   - ログイン用ユーザー名
   - **セキュリティ上、クライアント側には保存しません**
   - Netlify環境変数として安全に管理

2. **`AUTH_PASSWORD`**
   - ログイン用パスワード
   - **セキュリティ上、クライアント側には保存しません**
   - Netlify環境変数として安全に管理

#### 📊 Google Sheets連携（オプション）

3. **`GOOGLE_SHEET_ID`** 🔒
   - 対象スプレッドシートのID
   - 例: `1abc...xyz`（スプレッドシートURLから抽出）

4. **`GOOGLE_SERVICE_ACCOUNT_JSON`**
   - Google Cloud Consoleで作成したサービスアカウントのJSON認証情報

### 環境変数の設定方法

**Netlify Dashboard** で設定：

1. https://app.netlify.com/ にアクセス
2. サイトを選択
3. 「Site configuration」 → 「Environment variables」
4. 「Add a variable」をクリック
5. 以下の変数を追加：

```
AUTH_USERNAME=your_username
AUTH_PASSWORD=your_secure_password
GOOGLE_SHEET_ID=1abc...xyz
GOOGLE_SERVICE_ACCOUNT_JSON={ "type": "service_account", ... }
```

6. デプロイをトリガー（GitHubへのプッシュで自動）

### GitHub Actions デプロイ状況確認
1. リポジトリページで「Actions」タブをクリック
2. 最新の「Deploy to GitHub Pages」ワークフローを確認
3. GitHub Pagesで自動デプロイされます

### Netlify連携
Netlifyを使用して、サーバーレス関数経由でGoogle Sheets APIにアクセスします：
- **Netlify Functions**: `/.netlify/functions/sheets`
- **環境変数**: Netlify Dashboardで設定
- **詳細**: [GOOGLE_SERVICE_ACCOUNT_SETUP.md](GOOGLE_SERVICE_ACCOUNT_SETUP.md) を参照

## 📈 データ形式

### 📊 **データ形式（sales.csv）**
> ⚠️ **注意**: `sales.csv`は**デモ用サンプルデータ**です。実際の売上データではありません。

**必須フォーマット**:
```csv
日付,支払い者,客数,売り上げ
2025/01/02,Aさん,1,14500
2025/01/02,Bさん,1,8000
2025/01/02,Cさん,1,12500
2025/01/02,Dさん,0,1600
```

**列の説明**:
| 列の位置 | 列名 | データ型 | 説明 |
|---------|------|---------|------|
| 1列目 | 日付 | YYYY/MM/DD | 売上日（例: 2025/01/02） |
| 2列目 | 支払い者 | テキスト | お客様名（例: Aさん） |
| 3列目 | 客数 | 数字 | 来店人数（0以上） |
| 4列目 | 売り上げ | 数字 | 売上金額（円） |

**デモデータ詳細**:
- **期間**: 2025年1月〜11月
- **取引件数**: 293件
- **顧客**: 様々なお客様名でテスト

### 📱 **モバイル版の出力形式**
- **画像**: PNG形式でiPhone写真アプリに保存
- **レイアウト**: 2行3列（最大6枚/ページ）
- **情報**: 日付、伝票画像、金額、支払い方法、合計

## 🛡️ セキュリティ
- ユーザー認証システム（GitHub Pagesではローカルストレージ認証）
- Netlify Functions経由でAPI Keyを安全に管理
- CORS設定

## 📱 モバイル版の特徴

### ✨ **主要機能**
- **PWA対応**: ホーム画面に追加してアプリのように使用可能
- **カメラ撮影**: 伝票を直接撮影して取り込み（縦向き推奨）
- **画像処理**: リアルタイムで撮影画像をプレビュー表示
- **自動レイアウト**: 6枚1組の報告書を自動生成
- **iPhone連携**: 写真アプリに直接保存可能
- **オフライン対応**: ネットワーク接続なしでも動作

### 🎨 **UI/UXの特徴**
- **見やすいボタン**: グラデーション背景で視認性向上
- **直感的操作**: タップするだけで日付編集可能
- **撮影ガイド**: 縦向き撮影をサポートするガイド表示
- **リアルタイム合計**: 入力と同時に売上合計を更新

---
**更新日**: 2025年10月2日  
**新機能**: モバイル売上報告システム追加
