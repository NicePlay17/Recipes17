from fastapi import APIRouter, Depends
from app.db.auth import create_user, authenticate_user  # Импорт функций из `db.auth`
from app.db.schemas import UserCreate, UserLogin  # Схемы для валидации

router = APIRouter()

@router.post("/register")
async def register(user: UserCreate):
    return await create_user(user)

@router.post("/login")
async def login(user: UserLogin):
    return await authenticate_user(user)
