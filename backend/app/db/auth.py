import hashlib
import jwt
import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.utils import hash_password, verify_password
from app.db.schemas import UserCreate, UserLogin
from app.db.database import get_db, SessionLocal
from app.db.models import User
from .schemas import UserCreate
from fastapi.security import OAuth2PasswordBearer
from datetime import timedelta



SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# Функция для хэширования пароля SHA-256
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


# Регистрация пользователя
@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Пользователь уже существует")

    hashed_password = hash_password(user.password)
    new_user = User(username=user.username, password=hashed_password)
    db.add(new_user)
    db.commit()
    return {"message": "Регистрация успешна! Перейдите на страницу входа."}


# Авторизация пользователя
@router.post("/login")
def login(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or db_user.password != hash_password(user.password):
        raise HTTPException(status_code=400, detail="Неверный логин или пароль")

    expiration = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    token = jwt.encode({"sub": user.username, "exp": expiration}, SECRET_KEY, algorithm=ALGORITHM)
    return {"token": token}

def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# def create_user(user: UserCreate):
#     db = SessionLocal()
#     hashed_password = hash_password(user.password)
#     new_user = User(username=user.username, password=hashed_password)
#     db.add(new_user)
#     db.commit()
#     db.refresh(new_user)
#     db.close()
#     return {"message": "User created"}

async def create_user(user: UserCreate):
    async with SessionLocal() as db:
        hashed_password = hash_password(user.password)
        new_user = User(username=user.username, password=hashed_password)

        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)  

        return {"message": "User created", "user_id": new_user.id}

def authenticate_user(user: UserLogin):
    db = SessionLocal()
    db_user = db.query(User).filter(User.email == user.email).first()
    db.close()
    if not db_user or not verify_password(user.password, db_user.password):
        return {"error": "Invalid credentials"}
    return {"message": "Login successful"}