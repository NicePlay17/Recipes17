from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.db.models.models import Base, User
from app.db.security import hash_password, verify_password
from app.db.auth import create_token

app = FastAPI()

# Создаём таблицы
Base.metadata.create_all(bind=engine)

# Функция для получения сессии БД
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/register")
def register(username: str, password: str, db: Session = Depends(get_db)):
    hashed_password = hash_password(password)
    user = User(username=username, password_hash=hashed_password)
    db.add(user)
    db.commit()
    return {"message": "User registered successfully"}

@app.post("/login")
def login(username: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token(user.username)
    return {"token": token}
