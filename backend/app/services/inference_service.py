import cv2
import numpy as np
from app.core.model_loader import FashionModelLoader

model = FashionModelLoader("./models/fashion-ai.ckpt")
model.load()

def preprocess_image(file_bytes):
    file_array = np.frombuffer(file_bytes, np.uint8)
    img = cv2.imdecode(file_array, cv2.IMREAD_COLOR)
    img = cv2.resize(img, (331, 331))
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = (img.astype(np.float32) / 127.5) - 1.0
    img = np.expand_dims(img, axis=0)
    return img

def run_inference(file_bytes):
    img_input = preprocess_image(file_bytes)
    results = model.predict(img_input)
    return results
