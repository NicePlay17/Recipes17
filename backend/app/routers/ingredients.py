from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.database import get_db
from app.db.models.models import Recipe, Ingredient
from sqlalchemy import select, distinct
from collections import Counter
from sqlalchemy import select, func
from typing import List

router = APIRouter()

@router.get("/recipe/")
async def get_ingredients(recipe_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Recipe).where(Recipe.id == recipe_id))
    recipe = result.scalars().first()

    if not recipe:
        raise HTTPException(status_code=404, detail="Рецепт не найден")

    ingredients_result = await db.execute(
        select(Ingredient.name, Ingredient.quantity)  # Добавляем quantity
        .where(Ingredient.recipe_id == recipe_id)
    )
    ingredients = [
        {"name": ing[0], "quantity": ing[1]} for ing in ingredients_result.all()
    ]

    return {"recipe": {"id": recipe.id, "name": recipe.name}, "ingredients": ingredients}

@router.get("/ingtorec")
async def get_ingredients(session: AsyncSession = Depends(get_db)):
    result = await session.execute(select(Ingredient))
    ingredients = result.scalars().all()
    return [{"id": ing.id, "name": ing.name} for ing in ingredients]

@router.get("/search_by_ingredients")
async def search_by_ingredients(
    ingredients: List[str] = Query(...),  # ?ingredients=Яйцо&ingredients=Картофель
    session: AsyncSession = Depends(get_db)
):
    """
    Возвращает рецепты, содержащие все указанные ингредиенты.
    """
    # Шаг 1: Найдём ID рецептов, где встречаются ВСЕ ингредиенты из запроса
    subquery = (
        select(Ingredient.recipe_id)
        .where(Ingredient.name.in_(ingredients))
        .group_by(Ingredient.recipe_id)
        .having(func.count(func.distinct(Ingredient.name)) == len(ingredients))
        .subquery()
    )

    # Шаг 2: Получаем рецепты по найденным recipe_id
    result = await session.execute(
        select(Recipe).where(Recipe.id.in_(select(subquery)))
    )
    recipes = result.scalars().all()

    return [
        {
            "id": recipe.id,
            "name": recipe.name,
        }
        for recipe in recipes
    ]
