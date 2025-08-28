import cv2
import numpy as np
import tensorflow as tf
import os


# 外部で作成したモデル（mnist_model.h5など）をロード
model_path = 'mnist_model.h5'  # backendフォルダに配置
if not os.path.exists(model_path):
    raise FileNotFoundError(f'モデルファイル {model_path} が見つかりません。')
model = tf.keras.models.load_model(model_path)

image_dir = 'sample_images'
image_files = [f for f in os.listdir(image_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]

for fname in image_files:
    path = os.path.join(image_dir, fname)
    img = cv2.imread(path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        print(f'画像読み込み失敗: {fname}')
        continue
    # MNIST形式にリサイズ
    img_resized = cv2.resize(img, (28, 28))
    img_resized = img_resized.astype('float32') / 255.0
    img_resized = img_resized.reshape(1, 28, 28, 1)
    # 予測
    pred = model.predict(img_resized)
    digit = np.argmax(pred)
    print(f'{fname}: 認識結果 → {digit}')
    # 結果画像表示（任意）
    cv2.imshow('Input', img)
    cv2.waitKey(1000)  # 1秒表示
cv2.destroyAllWindows()
