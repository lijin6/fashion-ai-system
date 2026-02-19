from fastapi import FastAPI
from app.api import predict

app = FastAPI(title="服装属性识别系统")

app.include_router(predict.router)
