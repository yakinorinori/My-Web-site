import cv2
import numpy as np
import tensorflow as tf
import os


model_path = 'mnist_model.h5'
if not os.path.exists(model_path):
    raise FileNotFoundError(f'モデルファイル {model_path} が見つかりません。')
model = tf.keras.models.load_model(model_path)

image_dir = 'sample_images'
image_files = [f for f in os.listdir(image_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]

def point_in_rect(x, y, rect):
    rx1, ry1, rx2, ry2 = rect
    return rx1 <= x <= rx2 and ry1 <= y <= ry2

for fname in image_files:
    path = os.path.join(image_dir, fname)
    img = cv2.imread(path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        print(f'画像読み込み失敗: {fname}')
        continue

    img_blur = cv2.GaussianBlur(img, (5,5), 0)
    edges = cv2.Canny(img_blur, 50, 150)
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    rects = []
    for cnt in contours:
        x, y, w, h = cv2.boundingRect(cnt)
        area = w * h
        if area < 200 or area > 2000:
            continue
        rects.append((x, y, w, h))

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
                    if abs(g[1]-r[1]) < Y_TOLERANCE and abs(g[3]-r[3]) < HEIGHT_TOLERANCE and abs(g[0]+g[2]-r[0]) < X_NEIGHBOR_DIST:
                        group.append(r)
                        added = True
                        break
                if added:
                    break
            if not added:
                groups.append([r])

    img_group = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
    red_rects = []
    for group in groups:
        xs = [x for x, y, w, h in group] + [x+w for x, y, w, h in group]
        ys = [y for x, y, w, h in group] + [y+h for x, y, w, h in group]
        x_min, x_max = min(xs), max(xs)
        y_min, y_max = min(ys), max(ys)
        cv2.rectangle(img_group, (x_min, y_min), (x_max, y_max), (0,0,255), 2)  # 赤枠
        red_rects.append((x_min, y_min, x_max, y_max, group))

    clicked_rect = [None]

    def mouse_callback(event, x, y, flags, param):
        if event == cv2.EVENT_LBUTTONDOWN:
            for rect in red_rects:
                if point_in_rect(x, y, rect[:4]):
                    clicked_rect[0] = rect
                    break

    cv2.namedWindow('Grouped digits with blue rectangles')
    cv2.setMouseCallback('Grouped digits with blue rectangles', mouse_callback)

    while True:
        img_disp = img_group.copy()
        if clicked_rect[0]:
            x_min, y_min, x_max, y_max, group = clicked_rect[0]
            roi = img[y_min:y_max, x_min:x_max]
            roi_blur = cv2.GaussianBlur(roi, (3,3), 0)
            roi_edges = cv2.Canny(roi_blur, 50, 150)
            roi_contours, _ = cv2.findContours(roi_edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

            digit_rects = []
            if roi_contours is not None:
                for cnt in roi_contours:
                    x, y, w, h = cv2.boundingRect(cnt)
                    area = w * h
                    if area < 50 or area > 2000:
                        continue
                    digit_rects.append((x, y, w, h))

            digit_groups = []
            def is_overlap(r1, r2):
                x1, y1, w1, h1 = r1
                x2, y2, w2, h2 = r2
                return not (x1+w1 < x2 or x2+w2 < x1 or y1+h1 < y2 or y2+h2 < y1)
            used = [False]*len(digit_rects)
            for i, r in enumerate(digit_rects):
                if used[i]: continue
                group = [r]
                used[i] = True
                for j, r2 in enumerate(digit_rects):
                    if used[j] or i == j: continue
                    if any(is_overlap(r2, g) for g in group):
                        group.append(r2)
                        used[j] = True
                digit_groups.append(group)

            for dg in digit_groups:
                dxs = [x for x, y, w, h in dg] + [x+w for x, y, w, h in dg]
                dys = [y for x, y, w, h in dg] + [y+h for x, y, w, h in dg]
                xg_min, xg_max = min(dxs), max(dxs)
                yg_min, yg_max = min(dys), max(dys)
                cv2.rectangle(img_disp, (x_min+xg_min, y_min+yg_min), (x_min+xg_max, y_min+yg_max), (255,0,0), 2)  # 青枠

                # --- 範囲を広げる ---
                pad = 4  # 拡張ピクセル数（必要に応じて調整）
                xg_min_pad = max(xg_min - pad, 0)
                xg_max_pad = min(xg_max + pad, roi.shape[1])
                yg_min_pad = max(yg_min - pad, 0)
                yg_max_pad = min(yg_max + pad, roi.shape[0])

                digit_img = roi[yg_min_pad:yg_max_pad, xg_min_pad:xg_max_pad]

                # --- 外側を白色で埋める ---
                h, w = digit_img.shape
                digit_img_padded = np.ones((h, w), dtype=np.uint8) * 255  # 白画像
                # 中央に元画像を貼り付け（今回はpad分だけ広げているのでそのまま）
                digit_img_padded[:,:] = digit_img

                area = digit_img_padded.shape[0] * digit_img_padded.shape[1]
                # 領域の大きさでカンマ判別（例: 100〜180px²ならカンマ）
                if 100 <= area <= 180:
                    char = ','
                    # カンマは認識結果のみ表示し、文字認識モデルには渡さない
                    cv2.putText(img_disp, char, (x_min+xg_min_pad, y_min+yg_min_pad-5), cv2.FONT_HERSHEY_SIMPLEX, 1, (255,0,0), 2)
                else:
                    # カンマ以外のみ文字認識モデルに渡す
                    # --- 2値化してからモデルに渡す ---
                    _, digit_img_bin = cv2.threshold(digit_img_padded, 128, 255, cv2.THRESH_BINARY)
                    digit_img_bin = digit_img_bin.astype('float32') / 255.0
                    if digit_img_bin.shape[0] > 0 and digit_img_bin.shape[1] > 0:
                        digit_resized = cv2.resize(digit_img_bin, (28, 28))
                        cv2.imshow('Resized Digit', digit_resized)
                        cv2.waitKey(500)
                        digit_input = digit_resized.reshape(1, 28, 28, 1)
                        pred = model.predict(digit_input)
                        digit = np.argmax(pred)
                        if 0 <= digit <= 9:
                            char = str(digit)
                            cv2.putText(img_disp, char, (x_min+xg_min_pad, y_min+yg_min_pad-5), cv2.FONT_HERSHEY_SIMPLEX, 1, (255,0,0), 2)

        cv2.imshow('Grouped digits with blue rectangles', img_disp)
        # 画像として保存（認識結果付き画像）
        save_path = f'result_{fname}'
        cv2.imwrite(save_path, img_disp)
        key = cv2.waitKey(30)
        if key == 27:  # ESCで終了
            break
    cv2.destroyAllWindows()
