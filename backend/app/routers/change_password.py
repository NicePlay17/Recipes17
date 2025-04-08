from fastapi import APIRouter, Depends, Body, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.database import get_db
from app.db.models.models import User
from config import SECRET_KEY, ALGORITHM
from jose import jwt, JWTError

router = APIRouter()

@router.post("/change-password/")
async def change_password(
    current_password: str = Body(...),
    new_password: str = Body(...),
    token: str = Body(...),
    db: AsyncSession = Depends(get_db)
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    result = await db.execute(select(User).filter(User.username == username))
    user = result.scalars().first()

    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    if not user.verify_password(current_password):
        raise HTTPException(status_code=400, detail="Неверный текущий пароль")

    user.set_password(new_password)
    await db.commit()

    return {"message": "Пароль успешно изменён"}
