import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Загружаем переменные окружения
load_dotenv()

# Получаем URL базы данных из .env
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:170805Maks@localhost:5432/postgres")

# Создание движка базы данных
engine = create_engine(DATABASE_URL)

# Базовый класс для моделей
Base = declarative_base()

# Создание сессии
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Функция для получения сессии базы данных
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
