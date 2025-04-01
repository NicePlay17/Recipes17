import os
import re
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.future import select
from sqlalchemy.orm import sessionmaker
from sqlalchemy import func
from app.db.models.models import Ingredient, Recipe
from dotenv import load_dotenv
from app.db.database import Base

# Загружаем переменные окружения
load_dotenv()

# Настройки базы данных
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_async_engine(DATABASE_URL)
AsyncSessionLocal = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)


async def get_recipe_id(session: AsyncSession, name: str):
    """Поиск ID рецепта в базе данных."""
    result = await session.execute(select(Recipe).where(func.lower(Recipe.name) == name.lower()))
    existing_recipe = result.scalars().first()
    if existing_recipe:
        print(f"✅ Найден рецепт: {name} с ID {existing_recipe.id}")
        return existing_recipe.id
    print(f"❌ Не найден рецепт: {name}")
    return None


async def insert_recipes_from_file(filename: str):
    """Чтение рецептов из файла и запись в базу данных."""
    async with AsyncSessionLocal() as session:
        with open(filename, "r", encoding="utf-8") as file:
            lines = file.readlines()

        recipe_id = None
        
        for line in lines:
            line = line.strip().replace("\ufeff", "")  # Убираем скрытые символы (BOM и пробелы)
            if not line:
                continue

            match = re.match(r"^(\d+)\.\s(.+)$", line)
            if match:
                recipe_name = match.group(2).strip()
                recipe_id = await get_recipe_id(session, recipe_name)

                if not recipe_id:
                    new_recipe = Recipe(name=recipe_name)
                    session.add(new_recipe)
                    await session.flush()
                    recipe_id = new_recipe.id
                continue

            if line.lower() == "ингредиенты:":
                continue

            ingredient_match = re.match(r"^-\s(.+?)\s-\s(.+)$", line)
            if ingredient_match and recipe_id:
                ingredient_name = ingredient_match.group(1).strip()
                quantity = ingredient_match.group(2).strip()

                result = await session.execute(
                    select(Ingredient).where(
                        (Ingredient.recipe_id == recipe_id) & (func.lower(Ingredient.name) == ingredient_name.lower())
                    )
                )
                existing_ingredient = result.scalars().first()

                if not existing_ingredient:
                    new_ingredient = Ingredient(recipe_id=recipe_id, name=ingredient_name, quantity=quantity)
                    session.add(new_ingredient)

        await session.commit()  # Фиксируем изменения
        print("✅ Все рецепты и ингредиенты обработаны!")


# Запуск скрипта
if __name__ == "__main__":
    asyncio.run(insert_recipes_from_file(r"D:\Project\backend\app\db\topchik_utf8.txt"))
