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

from sqlalchemy import literal_column

@router.get("/search/")
async def search_recipes(query: str = Query(..., min_length=3), db: AsyncSession = Depends(get_db)):
    # Префиксный поиск: запек -> запеканка, запечённый и т.д.
    query_terms = ' & '.join([f"{term}:*" for term in query.split()])

    # Для strpos берём первый термин без * (нужно для позиционного ранжирования)
    first_term = query.split()[0]

    ts_query = func.to_tsquery("russian", query_terms)
    rank_expr = func.ts_rank_cd(Recipe.search_vector, ts_query, 32).label("rank")
    pos_expr = func.strpos(Recipe.name, first_term).label("pos")

    statement = (
        select(Recipe, rank_expr, pos_expr)
        .where(Recipe.search_vector.op("@@")(ts_query))
        .order_by(
            pos_expr.asc().nulls_last(),
            rank_expr.desc()
        )
    )

    result = await db.execute(statement)
    recipes = result.all()

    if not recipes:
        raise HTTPException(status_code=404, detail="Рецепты не найдены")

    return [{"recipe": row[0], "rank": row.rank, "pos": row.pos} for row in recipes]
