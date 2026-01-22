## GitHub Pages のグラフ・データ表示について 📊

### 📍 GitHub Pages URL
```
https://yakinorinori.github.io/My-Web-site/
```

### 🔗 データとグラフの参照経路

#### **1. デモモード（認証なし）**

GitHub Pages では API_BASE_URL が空（`''`）に設定されているため、すべて**相対パス**で参照します：

```javascript
// frontend/main.js の設定
const API_BASE_URL = window.location.hostname === 'yakinorinori.github.io' 
    ? '' // ← 空文字列（相対パス使用）
    : `https://${hostname}:3001`;  // Mac mini 環境
```

#### **2. データ参照パス**

| 項目 | URL | 説明 |
|------|-----|------|
| **sales.csv** | `/sales.csv` | リポジトリルートの sales.csv |
| **フロントエンド** | `/My-Web-site/frontend/` | GitHub Pages リポジトリ |
| **相対参照** | `./sales.csv` | frontend フォルダから上の階層の sales.csv |

#### **3. 実際の読み込みフロー**

```javascript
// GitHub Pages での URL 構築
function loadData(dataType = 'demo') {
    const url = `${API_BASE_URL}/sales.csv?type=${dataType}`;
    // API_BASE_URL = '' なので
    // url = '/sales.csv?type=demo'
    // → https://yakinorinori.github.io/sales.csv
}
```

#### **4. ファイル配置**

```
yakinorinori.github.io/
├── My-Web-site/
│   ├── frontend/
│   │   ├── index.html ← ここで sales.csv を参照
│   │   ├── main.js
│   │   └── sales.csv ← 3年分のデータ（2,820行）
│   ├── js/
│   ├── style.css
│   └── sales.csv ← ルートにもコピー
├── sales.csv ← GitHub Pages ルート
```

### 📊 グラフ表示の流れ

#### **Step 1: ローカルストレージ認証**
```javascript
// GitHub Pages で自動実行
const isAuth = localStorage.getItem('githubPagesAuth') === 'true';
```

#### **Step 2: sales.csv 読み込み**
```javascript
// 相対パスで読み込み
const response = await fetch('./sales.csv');
const csv = await response.text();
const data = csvToArray(csv); // CSV を配列に変換
```

#### **Step 3: データを Chart.js で描画**
```javascript
// renderYearComparisonAnalysis(data) が呼ばれる
// 2023/2024/2025 年のデータを月別に集計
// 複数ラインで折れ線グラフを生成
```

### 🎯 グラフの種類

| グラフ | 描画関数 | 使用データ |
|--------|----------|----------|
| **前年度比較** | `renderYearComparisonAnalysis()` | 2023-2025年の月別売上 |
| **売上推移** | `drawMonthlyChart()` | 月別売上・客数・組数 |
| **年別分析** | `renderYearAnalysis()` | 年別の合計・曜日別 |
| **月別分析** | `renderMonthAnalysis()` | 選択月の曜日別・支払者別 |

### 📄 データフォーマット

sales.csv:
```csv
日付,支払い者,客数,売り上げ
2023/06/06,Aさん,1,14500
2024/01/02,Bさん,1,8000
2025/01/02,Cさん,1,12500
```

### 🔄 複数環境での動作モード

```javascript
// 環境判定
if (IS_GITHUB_PAGES) {
    // GitHub Pages: デモモード
    // - 認証なし
    // - ローカルストレージで状態管理
    // - 相対パスでデータ参照
} else {
    // Mac mini 環境
    // - API キーで認証
    // - https://hostname:3001 の API 使用
    // - Google Sheets 連携可能
}
```

### ✅ GitHub Pages での使用方法

1. **ログイン画面**が自動表示
2. **Netlify環境変数で設定した認証情報**を使用
3. **ローカルストレージに認証状態を保存**
4. **sales.csv をブラウザで読み込み**
5. **Chart.js で グラフ描画**

### 🎬 デモモード vs 本番モード

```
【GitHub Pages】
localhost:8000/My-Web-site/frontend/
  ↓ sales.csv（相対パス）
  ↓ 前年度比較グラフ表示✅

【Mac mini】
https://hostname:3001
  ↓ API_BASE_URL/sales.csv
  ↓ バックエンド API 経由
  ↓ Google Sheets 連携✅
```

### 📱 流れ図

```
GitHub Pages アクセス
  ↓
index.html 読み込み
  ↓
main.js 実行
  ↓
IS_GITHUB_PAGES = true 判定
  ↓
デモログイン画面表示
  ↓
localStorage 認証
  ↓
./sales.csv 読み込み（相対パス）
  ↓
CSV → 配列 変換
  ↓
Chart.js で グラフ描画✅
```
