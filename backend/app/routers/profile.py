from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from jose import jwt, JWTError
from sqlalchemy.future import select
from app.db.database import get_db
from app.db.models.models import User
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

@router.get("/profile")
async def profile(token: str, db: AsyncSession = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")

        result = await db.execute(select(User).filter(User.username == username))
        user = result.scalars().first()

        if user is None:
            raise HTTPException(status_code=401, detail="Недействительный токен")

        return {"username": user.username}
    except JWTError:
        raise HTTPException(status_code=401, detail="Ошибка токена")
