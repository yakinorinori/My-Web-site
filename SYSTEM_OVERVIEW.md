# 📊 売上管理システム - システム概要

## 🎯 全体構成

```
【Part 1: 分析アプリ】        【Part 2: モバイルアプリ】
  デスクトップ版               モバイル版（PWA）
     ↓                          ↓
  index.html              mobile.html
     ↓                          ↓
 [分析・グラフ表示]         [伝票撮影・報告]
     ↓                          ↓
 sales.csv ←→ Google Sheets API ←→ Netlify Functions
```

---

## 📁 Part 1: 売上分析アプリ（デスクトップ）

### プログラミング言語
- **JavaScript (ES6+)** - ロジック・UI制御
- **HTML5** - ページ構造
- **CSS3** - スタイリング

### 主要モジュール

| ファイル | 行数 | 役割 |
|---------|------|------|
| `js/auth.js` | 368行 | ログイン・認証管理 |
| `js/ui.js` | 1,117行 | UI制御・画面レイアウト |
| `js/data.js` | 268行 | CSV解析・データ集計 |
| `js/charts.js` | 769行 | Chart.jsでグラフ描画 |
| `js/spreadsheet.js` | 480行 | Google Sheets API連携 |

### 主要ライブラリ
- **Chart.js v3.x** - グラフ表示（二軸対応）

### データフロー
```
sales.csv 
  ↓
csvToArray()（正規表現パーサ）
  ↓
filterDataByMonth / filterDataByYear()（フィルタリング）
  ↓
getMonthlyStats / getPayerStats() 等（集計）
  ↓
drawYearChart / drawMonthlyChart()（グラフ描画）
  ↓
画面表示
```

---

## 📱 Part 2: モバイル売上報告（PWA）

### プログラミング言語
- **JavaScript (ES6+)** - アプリロジック
- **HTML5** - ページ構造
- **CSS3** - スタイリング
- **WebAPI** - MediaStream, Canvas, Blob

### 主要モジュール

| ファイル | 役割 |
|---------|------|
| `js/mobile.js` | カメラ制御・伝票管理・Sheets連携（1,427行） |
| `mobile.html` | アプリ構造・PWA設定 |
| `manifest.json` | PWAマニフェスト |
| `sw.js` | Service Worker（オフライン対応） |

### バックエンド
- **Netlify Functions (Node.js)** - Google Sheets API プロキシ
- **環境変数**: Service Account キー管理

### データフロー
```
【カメラ部分】
MediaStream API（カメラ）
  ↓
Canvas（フレーム取得）
  ↓
toBlob()（PNG変換）
  ↓
iPhone写真アプリに保存

【データ送信部分】
伝票入力フォーム
  ↓
currentReceiptData（一時保存）
  ↓
sendMobileSalesDataToSpreadsheet()（バッチ送信）
  ↓
Netlify Functions
  ↓
Google Sheets API
  ↓
Google Spreadsheet
```

---

## 🔑 主要技術スタック

### フロントエンド
| 技術 | 用途 |
|------|------|
| **JavaScript ES6+** | ロジック（両方） |
| **Chart.js v3+** | グラフ表示（Part1） |
| **MediaStream API** | カメラ制御（Part2） |
| **Canvas API** | 画像処理（Part2） |
| **Service Worker** | オフライン対応（Part2） |

### バックエンド
| 技術 | 用途 |
|------|------|
| **Netlify Functions** | サーバーレス関数 |
| **googleapis v128+** | Google Sheets連携 |
| **Service Account** | 認証（セキュア） |

### ホスティング
| 部分 | ホスト |
|------|--------|
| **Part 1** | GitHub Pages |
| **Part 2** | GitHub Pages + Netlify |

---

## 📊 コード統計

### Part 1（分析）
- **合計行数**: 3,002行
- **UI制御**: 1,117行
- **グラフ**: 769行
- **認証**: 368行
- **API連携**: 480行
- **データ処理**: 268行

### Part 2（モバイル）
- **合計行数**: 1,587行
- **メインロジック**: 1,427行

### **全体**: 4,589行

---

## 🎯 各モジュールの主要関数

### Part 1

**auth.js**
```javascript
showGitHubPagesLogin()        // ログイン画面表示
handleGitHubPagesLogin()      // 認証処理
isAuthenticated()             // セッション確認
logout()                      // ログアウト
```

**ui.js**
```javascript
createMainApp()               // アプリ初期化
showMonthAnalysis()           // 月別分析表示
showYearAnalysis()            // 年別分析表示
renderMonthPersonAnalysis()   // 支払い者別集計
renderMonthWeekdayAnalysis()  // 曜日別集計
```

**data.js**
```javascript
loadData()                    // CSV読み込み
csvToArray()                  // CSV解析
filterDataByMonth()           // 月フィルタ
getPayerStats()               // 支払い者別集計
getMonthlyStats()             // 月別集計
getWeekdayStats()             // 曜日別集計
```

**charts.js**
```javascript
drawYearChart()               // 年別グラフ
drawYearMonthChart()          // 月次推移グラフ
drawYearWeekdayChart()        // 曜日別グラフ
destroyAllCharts()            // グラフクリア
```

### Part 2

**mobile.js**
```javascript
initMobileSalesReport()              // アプリ初期化
setupCamera()                        // カメラ起動
capturePhoto()                       // 撮影
addReceiptToList()                   // 伝票追加
sendMobileSalesDataToSpreadsheet()   // Sheets送信
```

---

## 🔐 セキュリティ

### Part 1
- ✅ ローカル認証（localStorage）
- ✅ デモアカウント（demo / demo2024）

### Part 2
- ✅ Service Account認証（API Keyをサーバー側で管理）
- ✅ Netlify Functions でプロキシ
- ✅ CORS対応
- ✅ XSS対策

---

## 🚀 デプロイ

| 部分 | 環境 | 方法 |
|------|------|------|
| Part 1 | GitHub Pages | 自動デプロイ |
| Part 2 | GitHub Pages + Netlify | 自動デプロイ |

---

## 🐍 Python の使用状況

### 現在の用途
| ファイル | 用途 | ステータス |
|---------|------|-----------|
| `backend/app.py` | Flask バックエンド（ユーザー認証・ユーティリティ） | ✅ 運用中 |
| `backend/camera_digit_recognition.py` | 数字認識スクリプト（試験用） | 🧪 試験版 |
| `手書き文字認識/train_model.py` | 手書き数字学習（MNIST） | 📚 学習済み |
| `手書き文字認識/annotation_tool.py` | 手書き文字アノテーションツール | 🛠️ 保守版 |

### 使用ライブラリ
- **Flask** - Web フレームワーク
- **TensorFlow / Keras** - 機械学習
- **OpenCV** - 画像処理
- **NumPy** - 数値計算

---

## 🚀 手書き文字認識の実装計画

### Phase 1: 統合アーキテクチャ
```
【モバイルアプリ】
   ↓ 伝票画像
Netlify Functions（Node.js）
   ↓ 画像転送
Python API（Flask）
   ↓ TensorFlow推論
ML モデル（Keras）
   ↓ 認識結果
JSON で返却
   ↓
Google Sheets に自動入力
```

### Phase 2: 実装内容

**ステップ 1: Flask API 拡張**
```python
# backend/app.py に追加
@app.route('/api/recognize', methods=['POST'])
def recognize_digit():
    """
    画像から数字を認識
    - 入力: Base64 画像
    - 出力: 認識結果 (0-9) + 信頼度
    """
    image_data = request.json['image']
    # OpenCV で前処理
    # TensorFlow で推論
    return jsonify({
        'digit': 3,
        'confidence': 0.95
    })
```

**ステップ 2: Netlify Functions から呼び出し**
```javascript
// netlify/functions/sheets.js に追加
async function recognizeDigit(imageBase64) {
    const response = await fetch(
        'https://your-flask-api.com/api/recognize',
        {
            method: 'POST',
            body: JSON.stringify({ image: imageBase64 })
        }
    );
    return response.json();
}
```

**ステップ 3: モバイル アプリ統合**
```javascript
// js/mobile.js に追加
async function extractAndRecognize(imageBlob) {
    // 1. 画像を Base64 に変換
    // 2. Flask API で認識
    // 3. Google Sheets に記録
}
```

### Phase 3: デプロイ方法

| 環境 | デプロイ先 | メリット |
|------|----------|---------|
| **開発** | `localhost:5000` | 高速開発 |
| **本番（推奨）** | AWS Lambda / Railway | スケーラブル |
| **軽量版** | Netlify / Vercel Function | シンプル |

### Phase 4: 必要なモデル拡張

**現在**: MNIST（0-9 数字認識）  
**推奨拡張**:
- 手書き日本語（ひらがな・漢字）
- 金額の自動認識
- 支払い者名の手書き解析

---

**最終更新**: 2025年10月24日
