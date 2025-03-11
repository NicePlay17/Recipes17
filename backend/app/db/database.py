import os
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from config import DATABASE_URL

# Загружаем переменные окружения
load_dotenv()

# Проверяем, что DATABASE_URL указан
if not DATABASE_URL:
    raise ValueError("DATABASE_URL не задан. Проверьте .env файл.")

# Подключение к БД (асинхронно)
engine = create_async_engine(DATABASE_URL, echo=True)

# Создаем фабрику сессий
AsyncSessionLocal = sessionmaker(
    bind=engine, class_=AsyncSession, expire_on_commit=False
)

# Определяем базу
Base = declarative_base()

# Создаем зависимость для сессии
async def get_db():
    async with AsyncSessionLocal() as db:
        yield db

# Функция для создания таблиц в БД
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
