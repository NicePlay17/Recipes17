from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.db.models import Base, User
from app.db import security
from app.db.auth import create_access_token, create_user, authenticate_user
from fastapi import FastAPI
from app.routers.auth import router as auth_router
from app.db.database import engine, Base
from app.routers import auth
from fastapi.middleware.cors import CORSMiddleware
from datetime import timedelta

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Разрешенные адреса фронта
    allow_credentials=True,
    allow_methods=["*"],  # Разрешаем любые методы (GET, POST и т. д.)
    allow_headers=["*"],  # Разрешаем любые заголовки
)

# Создание таблиц в БД (если их нет)
Base.metadata.create_all(bind=engine)
app.include_router(auth_router, prefix="/auth")
app.include_router(auth.router, prefix="/auth", tags=["auth"])

# Получение сессии БД
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# **Маршрут для регистрации**
@app.post("/register")
def register(username: str, password: str, db: Session = Depends(get_db)):
    user = create_user(db, username, password)
    return {"message": "Пользователь создан", "username": user.username}

app.include_router(auth_router, prefix="/auth")

# **Маршрут для входа и выдачи токена**
@app.post("/login")
def login(username: str, password: str, db: Session = Depends(get_db)):
    user = authenticate_user(db, username, password)
    if not user:
        raise HTTPException(status_code=400, detail="Неверный логин или пароль")
    
    access_token = create_access_token({"sub": user.username}, timedelta(minutes=60))
    return {"access_token": access_token, "token_type": "bearer"}

# **Пример защищённого маршрута**
@app.get("/profile")
def profile(token: str, db: Session = Depends(get_db)):
    from jose import jwt, JWTError

    SECRET_KEY = "mysecretkey"
    ALGORITHM = "HS256"

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        user = db.query(User).filter(User.username == username).first()
        if user is None:
            raise HTTPException(status_code=401, detail="Недействительный токен")
        return {"username": user.username}
    except JWTError:
        raise HTTPException(status_code=401, detail="Ошибка токена")
    
    # Добавляем CORS-миддлвару

origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175"
]


# Подключаем маршруты
 # Пример импорта роутов, если у тебя они в `routers/auth.py`
app.include_router(auth_router, prefix="/auth")

@app.get("/")
def read_root():
    return {"message": "API is running"}