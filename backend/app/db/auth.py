import hashlib
import jwt
import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import timedelta
from fastapi.security import OAuth2PasswordBearer
from app.db.models.models import User, Recipe
from app.db.database import get_db
from app.db.schemas.schemas import UserCreate, UserLogin
from dotenv import load_dotenv
import os


load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# Функция для хэширования пароля SHA-256
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


# Создание токена
def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# Регистрация пользователя
@router.post("/register")
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.username == user.username))
    existing_user = result.scalars().first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Пользователь уже существует")

    hashed_password = hash_password(user.password)
    new_user = User(username=user.username, hashed_password=hashed_password)  # <-- Исправлено

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return {"message": "Регистрация успешна! Перейдите на страницу входа."}


# Авторизация пользователя
@router.post("/login")
async def login(user: UserLogin, db: AsyncSession = Depends(get_db)):
    db_user = await authenticate_user(db, user.username, user.password)

    if not db_user:
        raise HTTPException(status_code=400, detail="Неверный логин или пароль")

    access_token = create_access_token({"sub": db_user.username}, timedelta(minutes=60))

    return {"token": access_token}


# Аутентификация пользователя
async def authenticate_user(db: AsyncSession, username: str, password: str):
    result = await db.execute(select(User).filter(User.username == username))
    db_user = result.scalars().first()

    if not db_user or hash_password(password) != db_user.hashed_password:  # <-- Исправлено
        return None

    return db_user
