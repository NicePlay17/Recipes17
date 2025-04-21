import hashlib
import jwt
import datetime
import os
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from dotenv import load_dotenv
from app.db.models.models import User

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def create_access_token(data: dict, expires_delta: datetime.timedelta):
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def authenticate_user(db: AsyncSession, username: str, password: str):
    result = await db.execute(select(User).filter(User.username == username))
    db_user = result.scalars().first()

    if not db_user or hash_password(password) != db_user.hashed_password:
        return None

    return db_user
