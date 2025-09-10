import cv2
import os

# 保存先ディレクトリ
save_dir = "annotated_dataset"
os.makedirs(save_dir, exist_ok=True)

# 元画像ディレクトリ
image_dir = "素材/2024-2~9"
image_files = [f for f in os.listdir(image_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]

rect_size = 28
rect_x, rect_y = 0, 0

def mouse_callback(event, x, y, flags, param):
    global rect_x, rect_y
    # マウスの矢印の先に四角の右下が来る
    rect_x, rect_y = x - rect_size, y - rect_size
    if event == cv2.EVENT_LBUTTONDOWN:
        crop = param[max(rect_y,0):max(rect_y+rect_size,0), max(rect_x,0):max(rect_x+rect_size,0)]
        save_path = os.path.join(save_dir, f"{os.path.splitext(param['fname'])[0]}_crop.png")
        cv2.imwrite(save_path, crop)
        print(f"Saved: {save_path}")

for fname in image_files:
    img = cv2.imread(os.path.join(image_dir, fname))
    if img is None:
        continue
    h, w = img.shape[:2]
    rect_x, rect_y = w // 2 - rect_size // 2, h // 2 - rect_size // 2

    cv2.namedWindow('Annotate')
    # paramに画像とファイル名を渡す
    param = {'img': img, 'fname': fname}
    def mouse_callback(event, x, y, flags, param=param):
        global rect_x, rect_y
        rect_x, rect_y = x - rect_size, y - rect_size
        if event == cv2.EVENT_LBUTTONDOWN:
            crop = img[max(rect_y,0):max(rect_y+rect_size,0), max(rect_x,0):max(rect_x+rect_size,0)]
            save_path = os.path.join(save_dir, f"{os.path.splitext(fname)[0]}_crop.png")
            cv2.imwrite(save_path, crop)
            print(f"Saved: {save_path}")

    cv2.setMouseCallback('Annotate', mouse_callback)

    while True:
        disp = img.copy()
        cv2.rectangle(disp, (rect_x, rect_y), (rect_x+rect_size, rect_y+rect_size), (0,255,0), 2)
        cv2.imshow('Annotate', disp)
        key = cv2.waitKey(30)
        if key == 27:  # ESCで次の画像へ
            break

    cv2.destroyAllWindows()