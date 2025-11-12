#!/usr/bin/env python3
"""
CSV変換スクリプト（改善版）
売上入力表を 日付,支払い者,客数,売上 のシンプルなフォーマットに変換
すべてのデータを抽出（破損行を自動スキップ）
"""

import csv
import sys
import re

# 入力ファイル
input_file = '売上分析_2024年(売上入力表).csv'
output_file = 'sales.csv'

try:
    # 読み込み
    data = []
    row_count = 0
    error_count = 0
    
    with open(input_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        print(f"✅ ファイルを読み込み: {input_file}")
        print(f"✅ 総行数: {len(lines)}")
    
    # 日付パターンで行をフィルタリング（YYYY/M/D形式）
    date_pattern = re.compile(r'^(\d{4})/(\d{1,2})/(\d{1,2}),')
    
    for line_idx, line in enumerate(lines, 1):
        line = line.strip()
        
        # 日付で始まる行のみ処理
        if not date_pattern.match(line):
            continue
        
        try:
            # CSV形式で分割
            parts = next(csv.reader([line]))
            
            if len(parts) < 19:  # 最小フィールド数を確認
                error_count += 1
                continue
            
            # フィールドを抽出
            date = parts[0].strip()
            # 顧客名01(支払者)はインデックス8
            payer = parts[8].strip()
            # 売上はインデックス18
            sales_str = parts[18].strip()
            # 客数はインデックス19
            customer_count_str = parts[19].strip() if len(parts) > 19 else '0'
            
            # フィールド検証
            if not date or not payer or not sales_str:
                error_count += 1
                continue
            
            # 不明な支払い者をスキップ
            if '不明' in payer or '#N/A' in payer or payer == '':
                error_count += 1
                continue
            
            # 数値変換
            try:
                sales = int(float(sales_str)) if sales_str else 0
                customer_count = int(customer_count_str) if customer_count_str else 0
            except ValueError:
                error_count += 1
                continue
            
            # 売上が0の行はスキップ
            if sales <= 0:
                error_count += 1
                continue
            
            # 日付フォーマット検証
            date_match = re.match(r'(\d{4})/(\d{1,2})/(\d{1,2})', date)
            if date_match:
                year, month, day = date_match.groups()
                # YYYY/MM/DD形式に統一
                formatted_date = f"{year}/{month.zfill(2)}/{day.zfill(2)}"
                
                data.append([formatted_date, payer, customer_count, sales])
                row_count += 1
                
                if row_count <= 10:
                    print(f"  サンプル {row_count}: {formatted_date}, {payer}, {customer_count}, {sales}")
            else:
                error_count += 1
                
        except Exception as e:
            error_count += 1
            continue
    
    print(f"\n✅ 処理行数: {row_count} 行")
    print(f"⚠️  エラー/スキップ行: {error_count} 行")
    
    if data:
        # 日付でソート
        data.sort(key=lambda x: x[0])
        
        # 出力
        with open(output_file, 'w', encoding='utf-8', newline='') as f:
            writer = csv.writer(f)
            # ヘッダー
            writer.writerow(['日付', '支払い者', '客数', '売上'])
            # データ
            writer.writerows(data)
        
        print(f"✅ 出力ファイル: {output_file}")
        print(f"✅ 総データ行数: {len(data)} 行")
        print(f"\n📊 データ範囲: {data[0][0]} ～ {data[-1][0]}")
        print("✅ 変換完了！")
    else:
        print("❌ 変換できるデータがありません")
        sys.exit(1)
        
except FileNotFoundError:
    print(f"❌ ファイルが見つかりません: {input_file}")
    sys.exit(1)
except Exception as e:
    print(f"❌ エラーが発生しました: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
