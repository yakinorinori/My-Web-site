import csv
# 売上管理Webサイトのバックエンド
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/')
def index():
    return "売上管理Webサイト バックエンドAPI"

# sales.jsonから売上データを取得
# sales.jsonから売上データを取得
@app.route('/sales', methods=['GET'])
def get_sales():
    if os.path.exists('sales.json'):
        with open('sales.json', 'r', encoding='utf-8') as f:
            sales = json.load(f)
        return jsonify(sales)
    else:
        return jsonify([])

# data/sales.csvから売上データを取得
@app.route('/sales_csv', methods=['GET'])
def get_sales_csv():
    csv_path = os.path.join('data', 'sales.csv')
    sales = []
    if os.path.exists(csv_path):
        with open(csv_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                sales.append(row)
    return jsonify(sales)

# Googleスプレッドシートからデータ取得してsales.jsonに保存（仮実装）
@app.route('/fetch_sales', methods=['POST'])
def fetch_sales():
    # ここにGoogle Sheets APIでデータ取得する処理を追加
    # 仮のデータ
    sales = [
        {"日付": "2025-08-01", "金額": 10000, "商品": "A"},
        {"日付": "2025-08-02", "金額": 15000, "商品": "B"}
    ]
    with open('sales.json', 'w', encoding='utf-8') as f:
        json.dump(sales, f, ensure_ascii=False, indent=2)
    return jsonify({"status": "success", "count": len(sales)})

if __name__ == '__main__':
    app.run(debug=True)

