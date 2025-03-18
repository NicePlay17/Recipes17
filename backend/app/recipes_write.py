import os
import re
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine
from app.db.models.models import Ingredient, Recipe
from dotenv import load_dotenv
from app.db.database import Base

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_async_engine(DATABASE_URL)
AsyncSessionLocal = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)


async def get_recipe_id(session, name):
    """Получает ID рецепта, если он уже есть в базе."""
    result = await session.execute(select(Recipe).where(Recipe.name == name))
    existing_recipe = result.scalars().first()
    return existing_recipe.id if existing_recipe else None


async def insert_recipes_from_file(filename: str):
    async with AsyncSessionLocal() as session:
        async with session.begin():
            with open(filename, "r", encoding="utf-8") as file:
                lines = file.readlines()

            recipe_id = None
            recipe_name = None

            for line in lines:
                line = line.strip()
                if not line:
                    continue

                # Поиск названия рецепта (номер + название)
                match = re.match(r"^(\d+)\.\s(.+)$", line)
                if match:
                    recipe_name = match.group(2)
                    
                    # Проверяем, существует ли уже рецепт
                    recipe_id = await get_recipe_id(session, recipe_name)
                    if not recipe_id:
                        new_recipe = Recipe(name=recipe_name)
                        session.add(new_recipe)
                        await session.flush()  # Получаем ID рецепта
                        recipe_id = new_recipe.id

                    continue

                # Пропускаем строку "Ингредиенты:"
                if line.lower() == "ингредиенты:":
                    continue

                # Парсим ингредиенты: "- Название - Количество"
                ingredient_match = re.match(r"^- (.+?) - (.+)$", line)
                if ingredient_match and recipe_id:
                    ingredient_name = ingredient_match.group(1)
                    quantity = ingredient_match.group(2)

                    # Проверяем, есть ли уже этот ингредиент у данного рецепта
                    result = await session.execute(
                        select(Ingredient).where(
                            (Ingredient.recipe_id == recipe_id) & (Ingredient.name == ingredient_name)
                        )
                    )
                    existing_ingredient = result.scalars().first()

                    if not existing_ingredient:
                        new_ingredient = Ingredient(recipe_id=recipe_id, name=ingredient_name, quantity=quantity)
                        session.add(new_ingredient)

        await session.commit()


# Запуск скрипта
import asyncio
asyncio.run(insert_recipes_from_file(r"D:\Project\backend\app\db\topchik_utf8.txt"))
