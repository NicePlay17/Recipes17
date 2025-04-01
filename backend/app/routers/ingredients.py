from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.database import get_db
from app.db.models.models import Recipe, Ingredient

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
