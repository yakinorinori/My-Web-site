#!/usr/bin/env python3
"""
2023年と2024年の架空データを生成するスクリプト
既存の2025年データの前に追加
"""

import csv
import random
from datetime import datetime, timedelta

# 支払い者のリスト
payers = ['Aさん', 'Bさん', 'Cさん', 'Dさん', 'Eさん', 'Fさん', 'Gさん', 'Hさん', 'Iさん', 'Jさん',
          'Kさん', 'Lさん', 'Mさん', 'Nさん', 'Oさん', 'Pさん', 'Qさん', 'Rさん', 'Sさん', 'Tさん',
          'Uさん', 'Vさん', 'Wさん', 'Xさん', 'Yさん', 'Zさん']

def generate_date_range(year, start_month=1, end_month=12):
    """指定年の日付範囲を生成"""
    dates = []
    for month in range(start_month, end_month + 1):
        # 月の日数を計算
        if month == 12:
            next_month = datetime(year + 1, 1, 1)
        else:
            next_month = datetime(year, month + 1, 1)
        last_day = (next_month - timedelta(days=1)).day
        
        for day in range(1, last_day + 1):
            dates.append(f"{year}/{month:02d}/{day:02d}")
    return dates

def generate_sales_data(year, start_month=1, end_month=12):
    """指定年のランダムな売上データを生成"""
    data = []
    dates = generate_date_range(year, start_month, end_month)
    
    # 各日付に複数の取引を追加
    for date in dates:
        # 1日に3-5件の取引を追加
        num_transactions = random.randint(3, 5)
        for _ in range(num_transactions):
            payer = random.choice(payers)
            customers = random.randint(1, 4)
            # 売上は客数に基づいて計算（平均5000-15000円/人）
            base_sales = customers * random.randint(5000, 15000)
            # ばらつきを追加
            sales = base_sales + random.randint(-2000, 2000)
            sales = max(1000, sales)  # 最小1000円
            
            data.append({
                '日付': date,
                '支払い者': payer,
                '客数': customers,
                '売り上げ': sales
            })
    
    return data

# データ生成
print("📊 2023年と2024年の架空データを生成中...")

# 2023年データ（6月から12月）
data_2023 = generate_sales_data(2023, start_month=6, end_month=12)
print(f"✅ 2023年6月-12月: {len(data_2023)}件")

# 2024年データ（1月から12月）
data_2024 = generate_sales_data(2024, start_month=1, end_month=12)
print(f"✅ 2024年1月-12月: {len(data_2024)}件")

# 既存の2025年データを読み込み
existing_data = []
with open('backend/data/sales.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        existing_data.append(row)
print(f"✅ 2025年データ: {len(existing_data)}件")

# 新しいファイルに書き込み（2023 → 2024 → 2025の順）
output_file = 'backend/data/sales.csv'
with open(output_file, 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=['日付', '支払い者', '客数', '売り上げ'])
    writer.writeheader()
    
    # 2023年を追加
    for row in data_2023:
        writer.writerow(row)
    
    # 2024年を追加
    for row in data_2024:
        writer.writerow(row)
    
    # 2025年を追加
    for row in existing_data:
        writer.writerow(row)

total_rows = len(data_2023) + len(data_2024) + len(existing_data)
print(f"\n✅ ファイル生成完了: {output_file}")
print(f"📈 総データ行数: {total_rows}件")
print(f"   - 2023年6-12月: {len(data_2023)}件")
print(f"   - 2024年1-12月: {len(data_2024)}件")
print(f"   - 2025年1-11月: {len(existing_data)}件")
