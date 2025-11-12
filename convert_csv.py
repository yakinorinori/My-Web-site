#!/usr/bin/env python3
"""
CSV変換スクリプト
売上入力表を 日付,支払い者,客数,売上 のシンプルなフォーマットに変換
"""

import csv
import sys

# 入力ファイル
input_file = '売上分析_2024年(売上入力表).csv'
output_file = 'sales.csv'

try:
    # 読み込み（複数のエンコーディングを試す）
    encodings = ['utf-8', 'utf-16', 'utf-8-sig', 'cp932']
    
    data_read = False
    total_rows_in_file = 0
    
    for encoding in encodings:
        try:
            with open(input_file, 'r', encoding=encoding) as f:
                # 最初の行をスキップ（タイトル行）
                lines = f.readlines()
                total_rows_in_file = len(lines)
                
                # ヘッダー行を探す
                header_index = -1
                for i, line in enumerate(lines):
                    if '日付' in line and '顧客名01' in line:
                        header_index = i
                        break
                
                if header_index == -1:
                    continue
                
                # CSVReaderで解析
                reader = csv.DictReader(lines[header_index:])
                
                print(f"✅ ファイルを読み込み: {input_file} ({encoding})")
                print(f"✅ 総行数: {total_rows_in_file}")
                print(f"✅ ヘッダー行: {header_index + 1}")
                
                # データを処理
                data = []
                row_count = 0
                error_count = 0
                
                for row in reader:
                    try:
                        date = row.get('日付', '').strip()
                        payer = row.get('顧客名01(支払者)', '').strip()
                        customer_count_str = row.get('客数', '0').strip()
                        sales_str = row.get('売上', '0').strip()
                        
                        # 必須フィールドをチェック
                        if not date or not payer or date == '日付':
                            continue
                        
                        # 不明な支払い者はスキップ
                        if '不明' in payer or '#N/A' in payer or payer == '':
                            error_count += 1
                            continue
                        
                        try:
                            customer_count = int(customer_count_str) if customer_count_str else 0
                            sales = int(sales_str) if sales_str else 0
                        except ValueError:
                            error_count += 1
                            continue
                        
                        # 日付をフォーマット（YYYY/MM/DD形式を確認）
                        if len(date) >= 10 and date[4] == '/' and date[7] == '/':
                            data.append([date[:10], payer, customer_count, sales])
                            row_count += 1
                            
                            if row_count <= 5:
                                print(f"  サンプル {row_count}: {date[:10]}, {payer}, {customer_count}, {sales}")
                        else:
                            error_count += 1
                        
                    except (ValueError, TypeError, KeyError) as e:
                        # エラー行をスキップ
                        error_count += 1
                        continue
                
                print(f"\n✅ 処理行数: {row_count} 行")
                print(f"⚠️  エラー/スキップ行: {error_count} 行")
                
                if data:
                    data_read = True
                    break
                    
        except Exception as e:
            print(f"⚠️  {encoding} での読み込み失敗: {e}")
            continue
    
    if not data_read:
        print("❌ ファイルを読み込めません")
        sys.exit(1)
    
    # 出力
    if data:
        with open(output_file, 'w', encoding='utf-8', newline='') as f:
            writer = csv.writer(f)
            # ヘッダー
            writer.writerow(['日付', '支払い者', '客数', '売上'])
            # データ
            writer.writerows(data)
        
        print(f"✅ 出力ファイル: {output_file}")
        print(f"✅ 総データ行数: {len(data)} 行")
        print("\n📊 変換完了！")
    else:
        print("❌ 変換できるデータがありません")
        sys.exit(1)
        
except FileNotFoundError:
    print(f"❌ ファイルが見つかりません: {input_file}")
    sys.exit(1)
except Exception as e:
    print(f"❌ エラーが発生しました: {e}")
    sys.exit(1)
