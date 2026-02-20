from fastapi import APIRouter, UploadFile, File, HTTPException
import cv2
import numpy as np
import os
from app.core.model_loader import FashionModelLoader

router = APIRouter()

# 定义模型权重路径
BASE_DIR = os.getcwd()
MODEL_PATH = os.path.join(BASE_DIR, "models", "fashion-ai.ckpt")

# 单例模式初始化加载器
loader = FashionModelLoader(MODEL_PATH)
try:
    loader.load()
    print("🚀 FashionAI 属性识别引擎已就绪")
except Exception as e:
    print(f"❌ 模型加载失败: {e}")

@router.post("/predict")
async def predict_api(file: UploadFile = File(...)):
    try:
        # 读取上传的文件
        data = await file.read()
        nparr = np.frombuffer(data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise HTTPException(status_code=400, detail="无效的图片文件")

        # Poemix 模型对应的 InceptionV4 预处理标准 (331x331)
        img = cv2.resize(img, (331, 331))
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        # 归一化到 [-1, 1] 区间
        img_input = (img.astype(np.float32) / 127.5) - 1.0
        img_input = np.expand_dims(img_input, axis=0)

        # 执行模型推理
        results = loader.predict(img_input)
        
        return {"results": results}
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))