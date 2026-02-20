from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext

# SQLite 数据库文件路径
SQLALCHEMY_DATABASE_URL = "sqlite:///./fashion_ai.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 密码加密工具
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

# 初始化数据库表
def init_db():
    Base.metadata.create_all(bind=engine)

# 获取数据库连接的依赖项
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()