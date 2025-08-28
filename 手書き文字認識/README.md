# 手書き文字認識モデル作成手順

## 必要なもの
- Python 3.x
- tensorflow, numpy

## モデル作成手順
1. 必要なパッケージをインストール
   ```sh
   pip install tensorflow numpy
   ```
2. `train_model.py` を実行
   ```sh
   python3 train_model.py
   ```
3. `mnist_model.h5` が作成されます（このファイルを認識プログラムで利用）

## カスタムデータで学習したい場合
- `train_model.py` を編集して独自データセットを読み込むようにしてください
