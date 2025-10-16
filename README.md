# 📊 売上管理システム

## 🌐 デモサイト
- **GitHub Pages**: https://yakinorinori.github.io/My-Web-site/
- **Mac mini サーバー**: http://192.168.151.100:8080
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

### 🖥️ **Mac mini サーバー（フル機能版）**
1. VPNまたはローカルネットワークから Mac mini にアクセス
2. 本番用アカウントでログイン
3. リアルタイムデータの表示・編集

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
- **Mac mini**: ローカル手動デプロイ（GitHub Actions無効化済み）

### GitHub Actions デプロイ状況確認
1. リポジトリページで「Actions」タブをクリック
2. 最新の「Deploy to GitHub Pages」ワークフローを確認
3. GitHub Pagesのみ自動デプロイされます

### Mac mini 手動デプロイ（オプション）
Mac miniでローカルに手動デプロイしたい場合：

```bash
# Mac mini上で実行
cd ~/個人事業/My-Web-site
git pull origin main
chmod +x ./scripts/start-all-servers.sh
./scripts/start-all-servers.sh
```

## 📈 データ形式

### 📊 **デモデータ（sales.csv）**
> ⚠️ **注意**: `sales.csv`は**デモ用サンプルデータ**です。実際の売上データではありません。

**フォーマット**:
```csv
日付,支払い者,客数,売り上げ
2025/01/02,Aさん,1,14500
2025/01/02,Bさん,1,8000
2025/01/03,不明,0,69400
```

**デモデータ詳細**:
- **期間**: 2025年1月2日〜3日
- **取引件数**: 11件
- **合計売上**: ¥173,200
- **顧客**: Aさん、Bさん、Cさん、Dさん、Eさん、Fさん、不明

### 📱 **モバイル版の出力形式**
- **画像**: PNG形式でiPhone写真アプリに保存
- **レイアウト**: 2行3列（最大6枚/ページ）
- **情報**: 日付、伝票画像、金額、支払い方法、合計

## 🛡️ セキュリティ
- ユーザー認証システム
- セッション管理
- HTTPS対応（Mac mini）
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
