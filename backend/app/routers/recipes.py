from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.database import get_db
from app.db.models.models import Recipe, Review
from sqlalchemy import select, func, desc
from sqlalchemy import event, text

@event.listens_for(Recipe, 'before_insert')
@event.listens_for(Recipe, 'before_update')
def update_search_vector(mapper, connection, target):
    stmt = text("""
        UPDATE recipes
        SET search_vector = 
            setweight(to_tsvector('russian', :name), 'A')
        WHERE id = :id
    """)
    connection.execute(stmt, {"name": target.name, "id": target.id})




router = APIRouter()

@router.get("/search/")
async def search_recipes(query: str = Query(..., min_length=2), db: AsyncSession = Depends(get_db)):
    # Разбиваем запрос на отдельные слова и добавляем * для префиксного поиска
    query_terms = ' & '.join([f"{term}:*" for term in query.split()])
    statement = select(Recipe).filter(Recipe.search_vector.op('@@')(func.to_tsquery('russian', query_terms)))
    result = await db.execute(statement)
    recipes = result.scalars().all()

    if not recipes:
        raise HTTPException(status_code=404, detail="Рецепты не найдены")

    return recipes


