import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 导入你定义的路由和数据库配置
from app.api.predict import router as predict_router
from app.api.auth import router as auth_router
from app.core.database import init_db

app = FastAPI(
    title="Fashion AI 智能服饰分析系统",
    description="基于 InceptionV4 多任务学习的服装属性识别后端，集成 SQLite 认证系统",
    version="1.0.0"
)

# --- 1. 数据库初始化 ---
# 在应用启动时自动创建 SQLite 表结构（如果不存在的话）
@app.on_event("startup")
def on_startup():
    print("正在初始化 SQLite 数据库...")
    init_db()
    print("数据库初始化完成。")

# --- 2. 跨域配置 (CORS) ---
# 允许前端（React/Tailwind）通过不同端口安全调用
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境建议指定具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 3. 路由注册 ---
# 预测接口：/api/predict
app.include_router(predict_router, prefix="/api", tags=["模型推理"])

# 认证接口：/api/auth/register 和 /api/auth/login
app.include_router(auth_router, prefix="/api/auth", tags=["用户认证"])

# --- 4. 基础接口 ---
@app.get("/", tags=["系统监控"])
async def health_check():
    """
    健康检查接口
    """
    return {
        "status": "running",
        "database": "SQLite",
        "model": "InceptionV4-Multitask",
        "version": "1.0.0"
    }

# --- 5. 启动入口 ---
if __name__ == "__main__":
    # 使用 reload=True 方便开发环境热更新
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)