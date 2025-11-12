#!/usr/bin/env python3
"""
手書き数字認識テストスクリプト（簡略版）
サンプル画像を処理して結果を表示
"""

import sys
import os

# パッケージ確認
try:
    import cv2
    import numpy as np
    import tensorflow as tf
    print("✅ 全ての必要なライブラリが揃っています")
except ImportError as e:
    print(f"❌ ライブラリのインストール：{e}")
    print("\n以下を実行してください:")
    print("pip install tensorflow opencv-python numpy")
    sys.exit(1)

# モデルの確認
model_path = 'mnist_model.h5'
if not os.path.exists(model_path):
    print(f"❌ モデルファイルが見つかりません: {model_path}")
    sys.exit(1)

print(f"✅ モデルを読み込み: {model_path}")
model = tf.keras.models.load_model(model_path)

# サンプル画像の確認
image_dir = 'sample_images'
image_files = [f for f in os.listdir(image_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]

if not image_files:
    print(f"❌ サンプル画像が見つかりません: {image_dir}")
    sys.exit(1)

print(f"✅ 見つかった画像: {len(image_files)} 枚")
for img_file in image_files:
    print(f"   - {img_file}")

print("\n" + "="*50)
print("📊 画像処理開始")
print("="*50)

for fname in image_files:
    path = os.path.join(image_dir, fname)
    print(f"\n処理中: {fname}")
    
    # 画像読み込み
    img = cv2.imread(path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        print(f"  ❌ 画像読み込み失敗")
        continue
    
    print(f"  ✅ 画像サイズ: {img.shape}")
    
    # エッジ検出
    img_blur = cv2.GaussianBlur(img, (5, 5), 0)
    edges = cv2.Canny(img_blur, 50, 150)
    
    # 輪郭検出
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    print(f"  ✅ 見つかった輪郭: {len(contours)} 個")
    
    # 矩形抽出
    rects = []
    for cnt in contours:
        x, y, w, h = cv2.boundingRect(cnt)
        area = w * h
        if 200 <= area <= 2000:
            rects.append((x, y, w, h))
    
    print(f"  ✅ フィルタ後の矩形: {len(rects)} 個")
    
    # グループ化
    Y_TOLERANCE = 50
    HEIGHT_TOLERANCE = 50
    X_NEIGHBOR_DIST = 100
    groups = []
    
    if rects:
        rects_sorted = sorted(rects, key=lambda r: r[0])
        for r in rects_sorted:
            added = False
            for group in groups:
                for g in group:
                    if (abs(g[1]-r[1]) < Y_TOLERANCE and 
                        abs(g[3]-r[3]) < HEIGHT_TOLERANCE and 
                        abs(g[0]+g[2]-r[0]) < X_NEIGHBOR_DIST):
                        group.append(r)
                        added = True
                        break
                if added:
                    break
            if not added:
                groups.append([r])
    
    print(f"  ✅ グループ化: {len(groups)} グループ")
    
    # 結果画像の作成
    img_result = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
    
    digit_results = []
    
    for group_idx, group in enumerate(groups):
        xs = [x for x, y, w, h in group] + [x+w for x, y, w, h in group]
        ys = [y for x, y, w, h in group] + [y+h for x, y, w, h in group]
        x_min, x_max = min(xs), max(xs)
        y_min, y_max = min(ys), max(ys)
        
        # グループの矩形描画
        cv2.rectangle(img_result, (x_min, y_min), (x_max, y_max), (0, 0, 255), 2)
        
        # ROI 抽出
        roi = img[y_min:y_max, x_min:x_max]
        
        # ROI 内のエッジ検出
        roi_blur = cv2.GaussianBlur(roi, (3, 3), 0)
        roi_edges = cv2.Canny(roi_blur, 50, 150)
        roi_contours, _ = cv2.findContours(roi_edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        digit_rects = []
        if roi_contours is not None:
            for cnt in roi_contours:
                x, y, w, h = cv2.boundingRect(cnt)
                area = w * h
                if 50 <= area <= 2000:
                    digit_rects.append((x, y, w, h))
        
        # 数字ごとの認識
        for digit_idx, (dx, dy, dw, dh) in enumerate(digit_rects):
            digit_img = roi[dy:dy+dh, dx:dx+dw]
            
            # 領域の大きさでカンマ判別
            area = digit_img.shape[0] * digit_img.shape[1]
            
            # グローバル座標に変換
            global_x1 = x_min + dx
            global_y1 = y_min + dy
            global_x2 = x_min + dx + dw
            global_y2 = y_min + dy + dh
            
            if 100 <= area <= 180:
                char = ','
                confidence = 1.0
                digit_results.append({
                    'group': group_idx,
                    'digit': char,
                    'confidence': confidence,
                    'area': area,
                    'bbox': (global_x1, global_y1, global_x2, global_y2)
                })
                print(f"    グループ {group_idx}, 数字 {digit_idx}: {char} (カンマ, 面積={area})")
                
                # ボックスと結果を描画
                cv2.rectangle(img_result, (global_x1, global_y1), (global_x2, global_y2), (255, 0, 0), 1)
                cv2.putText(img_result, char, (global_x1, global_y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 0, 0), 2)
            else:
                # TensorFlow で推論
                _, digit_img_bin = cv2.threshold(digit_img, 128, 255, cv2.THRESH_BINARY)
                digit_img_bin = digit_img_bin.astype('float32') / 255.0
                
                if digit_img_bin.shape[0] > 0 and digit_img_bin.shape[1] > 0:
                    digit_resized = cv2.resize(digit_img_bin, (28, 28))
                    digit_input = digit_resized.reshape(1, 28, 28, 1)
                    
                    pred = model.predict(digit_input, verbose=0)
                    digit = np.argmax(pred)
                    confidence = float(np.max(pred))
                    
                    if 0 <= digit <= 9:
                        char = str(digit)
                        digit_results.append({
                            'group': group_idx,
                            'digit': char,
                            'confidence': confidence,
                            'area': area,
                            'bbox': (global_x1, global_y1, global_x2, global_y2)
                        })
                        print(f"    グループ {group_idx}, 数字 {digit_idx}: {char} (信頼度={confidence:.2%})")
                        
                        # ボックスと結果を描画
                        # 信頼度に応じて色を変更（90%以上は緑、50-90%は黄、50%未満は赤）
                        if confidence >= 0.9:
                            color = (0, 255, 0)  # 緑
                        elif confidence >= 0.5:
                            color = (0, 255, 255)  # 黄
                        else:
                            color = (0, 0, 255)  # 赤
                        
                        cv2.rectangle(img_result, (global_x1, global_y1), (global_x2, global_y2), color, 1)
                        
                        # 数字だけを表示（信頼度は非表示）
                        cv2.putText(img_result, char, (global_x1 + 2, global_y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)
    
    # 認識結果をまとめる
    recognized_text = ''
    confidence_values = []
    
    if digit_results:
        recognized_text = ''.join([d['digit'] for d in digit_results])
        confidence_values = [d['confidence'] for d in digit_results if d['digit'] != ',']
    
    # 結果テキストを結果画像に描画
    if recognized_text:
        # テキスト情報を画像に追加
        font = cv2.FONT_HERSHEY_SIMPLEX
        font_scale = 1.5
        thickness = 3
        text_color = (0, 255, 0)  # 緑色
        
        # 背景を追加（テキスト領域）
        text_lines = [
            f"Recognized: {recognized_text}",
            f"Confidence: {np.mean(confidence_values):.2%}" if confidence_values else "Confidence: N/A"
        ]
        
        # テキストを描画
        y_offset = 50
        for idx, text_line in enumerate(text_lines):
            y_pos = y_offset + (idx * 50)
            # 背景矩形
            text_size = cv2.getTextSize(text_line, font, font_scale, thickness)[0]
            cv2.rectangle(img_result, (10, y_pos - 35), (20 + text_size[0], y_pos + 10), (0, 0, 0), -1)
            # テキスト描画
            cv2.putText(img_result, text_line, (20, y_pos), font, font_scale, text_color, thickness)
    
    # 結果を保存
    output_path = f'result_{fname}'
    cv2.imwrite(output_path, img_result)
    print(f"  ✅ 結果画像を保存: {output_path}")
    
    # 認識結果を表示
    if digit_results:
        print(f"\n📊 認識結果:")
        print(f"   認識テキスト: {recognized_text}")
        print(f"   平均信頼度: {np.mean(confidence_values):.2%}" if confidence_values else "   平均信頼度: N/A")
    else:
        print(f"   ⚠️  数字が検出されませんでした")

print("\n" + "="*50)
print("✅ 処理完了")
print("="*50)
