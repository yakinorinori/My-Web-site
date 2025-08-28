import tensorflow as tf
import numpy as np

# MNISTデータセットのロード
(x_train, y_train), (x_test, y_test) = tf.keras.datasets.mnist.load_data()

# 前処理
x_train = x_train.astype('float32') / 255.0
x_test = x_test.astype('float32') / 255.0
x_train = x_train.reshape(-1, 28, 28, 1)
x_test = x_test.reshape(-1, 28, 28, 1)

# モデル構築
model = tf.keras.models.Sequential([
    tf.keras.layers.Conv2D(32, (3,3), activation='relu', input_shape=(28,28,1)),
    tf.keras.layers.MaxPooling2D((2,2)),
    tf.keras.layers.Flatten(),
    tf.keras.layers.Dense(100, activation='relu'),
    tf.keras.layers.Dense(10, activation='softmax')
])

model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# 学習
model.fit(x_train, y_train, epochs=5, batch_size=128, validation_data=(x_test, y_test))

# モデル保存
model.save('mnist_model.h5')
print('モデル mnist_model.h5 を保存しました')
