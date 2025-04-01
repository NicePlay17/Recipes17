from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.database import get_db
from app.db.models.models import Recipe

router = APIRouter()

@router.get("/search/")
async def search_recipes(query: str = Query(..., min_length=2), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Recipe).filter(Recipe.name.ilike(f"%{query}%")))
    recipes = result.scalars().all()
    
    if not recipes:
        raise HTTPException(status_code=404, detail="Рецепты не найдены")
    
    return recipes
