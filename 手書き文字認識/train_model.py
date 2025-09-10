import tensorflow as tf
import numpy as np
import os
from tensorflow.keras.preprocessing.image import img_to_array, load_img
from tensorflow.keras import layers, models
import matplotlib.pyplot as plt

# データセットディレクトリ
dataset_dir = 'dataset'  # 0~9のフォルダ

images = []
labels = []

def preprocess(img):
    # 2値化せず、グレースケール正規化のみ
    img_arr = img_to_array(img).astype('float32') / 255.0
    return img_arr

# 0~9フォルダから画像を収集
for label in range(10):
    label_dir = os.path.join(dataset_dir, str(label))
    if not os.path.exists(label_dir):
        continue
    for fname in os.listdir(label_dir):
        if fname.lower().endswith(('.png', '.jpg', '.jpeg')):
            img_path = os.path.join(label_dir, fname)
            img = load_img(img_path, color_mode='grayscale', target_size=(28, 28))
            img_bin = preprocess(img)
            images.append(img_bin)
            labels.append(label)

# numpy配列に変換
x = np.array(images)
y = np.array(labels)

# シャッフル
idx = np.random.permutation(len(x))
x = x[idx]
y = y[idx]

# 学習・テスト分割
split = int(len(x)*0.8)
x_train, x_test = x[:split], x[split:]
y_train, y_test = y[:split], y[split:]

# モデル構築（CNNのみ）
model = models.Sequential([
    layers.Conv2D(32, (3,3), activation='relu', input_shape=(28,28,1)),
    layers.Conv2D(64, (3,3), activation='relu'),
    layers.MaxPooling2D((2,2)),
    layers.Dropout(0.25),  # 過学習防止
    layers.Flatten(),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.5),   # 過学習防止
    layers.Dense(10, activation='softmax')
])

model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

from tensorflow.keras.callbacks import EarlyStopping
early_stop = EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True)

model.fit(
    x_train, y_train,
    epochs=30,
    batch_size=32,
    validation_data=(x_test, y_test),
    callbacks=[early_stop]
)

model.save('mnist_model.h5')
print('モデル mnist_model.h5 を保存しました')

# ここからテスト用画像（各数字10枚ずつ）で評価
test_images = []
test_labels = []

for label in range(10):
    label_dir = os.path.join('test_dataset', str(label))  # テスト用フォルダ
    if not os.path.exists(label_dir):
        continue
    for fname in os.listdir(label_dir):
        if fname.lower().endswith(('.png', '.jpg', '.jpeg')):
            img_path = os.path.join(label_dir, fname)
            img = load_img(img_path, color_mode='grayscale', target_size=(28, 28))
            img_arr = img_to_array(img).astype('float32') / 255.0
            test_images.append(img_arr)
            test_labels.append(label)

x_test = np.array(test_images)
y_test = np.array(test_labels)

# モデルの評価
score = model.evaluate(x_test, y_test, verbose=1)
print(f"Test loss: {score[0]:.4f}, Test accuracy: {score[1]:.4f}")
