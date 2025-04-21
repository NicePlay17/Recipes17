from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import timedelta
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.future import select
from app.db.database import get_db
from app.db.schemas.schemas import UserCreate, UserLogin
from app.services.auth_service import (
    hash_password,
    authenticate_user,
    create_access_token
)

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


@router.post("/register")
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    from app.db.models.models import User  # импортировать модель тут или выше

    result = await db.execute(select(User).filter(User.username == user.username))
    existing_user = result.scalars().first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Пользователь уже существует")

    hashed_password = hash_password(user.password)
    new_user = User(username=user.username, hashed_password=hashed_password)

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return {"message": "Регистрация успешна! Перейдите на страницу входа."}


@router.post("/login")
async def login(user: UserLogin, db: AsyncSession = Depends(get_db)):
    db_user = await authenticate_user(db, user.username, user.password)

    if not db_user:
        raise HTTPException(status_code=400, detail="Неверный логин или пароль")

    access_token = create_access_token({"sub": db_user.username}, timedelta(minutes=60))

    return {
        "token": access_token,
        "user": {
            "id": db_user.id,
            "username": db_user.username,
        }
    }
