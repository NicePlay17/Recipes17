from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.middleware.cors import CORSMiddleware
from datetime import timedelta
from jose import jwt, JWTError

from app.db.database import get_db, init_db
from app.db.models.models import User
from app.db.auth import router as auth_router
from sqlalchemy.future import select
from dotenv import load_dotenv
import os
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

app = FastAPI()

# Разрешённые источники для CORS
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    await init_db()


# Подключаем маршруты авторизации
app.include_router(auth_router, prefix="/auth", tags=["auth"])


# Главная страница API
@app.get("/")
def read_root():
    return {"message": "API is running"}


# Защищённый маршрут профиля
@app.get("/profile")
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
