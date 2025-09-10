import os, struct, numpy as np
from PIL import Image

def read_idx_images(path):
    with open(path, 'rb') as f:
        magic, num, rows, cols = struct.unpack(">IIII", f.read(16))
        assert magic == 2051
        data = np.frombuffer(f.read(), dtype=np.uint8).reshape(num, rows, cols)
    return data

def read_idx_labels(path):
    with open(path, 'rb') as f:
        magic, num = struct.unpack(">II", f.read(8))
        assert magic == 2049
        labels = np.frombuffer(f.read(), dtype=np.uint8)
    return labels

imgs = read_idx_images("train-images-idx3-ubyte")
labs = read_idx_labels("train-labels-idx1-ubyte")

out_dir = "mnist_png/train"
for i, (im, lb) in enumerate(zip(imgs, labs)):
    d = os.path.join(out_dir, str(int(lb)))
    os.makedirs(d, exist_ok=True)
    Image.fromarray(im, mode='L').save(os.path.join(d, f"{i:06d}.png"))
