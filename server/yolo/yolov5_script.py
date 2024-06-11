import sys
import torch
from PIL import Image
import json
import os

# コマンドライン引数から画像ファイルのパスを取得
image_path = sys.argv[1]

# YOLOv5モデルの読み込み
model = torch.hub.load('ultralytics/yolov5', 'custom', path='/Users/frontier_tai/Desktop/python/yolo_test/yolov5/runs/train/exp5/weights/best.pt')

# 画像を読み込んで推論
img = Image.open(image_path)
results = model(img)

# 結果を保存するディレクトリ
output_dir = '/Users/frontier_tai/Desktop/Nextjs/DoctorRecomend/server/uploads/new'
output_image_path = os.path.join(output_dir, 'latest_result.jpg')

# 既存のファイルを削除
if os.path.exists(output_image_path):
    os.remove(output_image_path)

# レンダリング結果を保存
results.render()
rendered_img = Image.fromarray(results.ims[0])
rendered_img.save(output_image_path)

# 結果をJSON形式で出力
result_data = {
    'result': int(results.pred[0][:, -1].numpy()[0]) + 1,
    'output_path': output_image_path
}
print(json.dumps(result_data))
