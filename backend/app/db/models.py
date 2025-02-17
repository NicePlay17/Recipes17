from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


# class User(Base):
#     __tablename__ = "users"
#     username = Column(String, primary_key=True, index=True)
#     password = Column(String, nullable=False)  # Храним хэш

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)

# **Модель рецепта**
class Recipe(Base):
    __tablename__ = "recipes"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    ingredients = relationship("Ingredient", back_populates="recipe", cascade="all, delete")

# **Модель ингредиента**
class Ingredient(Base):
    __tablename__ = "ingredients"
    
    id = Column(Integer, primary_key=True, index=True)
    recipe_id = Column(Integer, ForeignKey("recipes.id", ondelete="CASCADE"))
    name = Column(String, nullable=False)
    quantity = Column(String, nullable=False)
    
    recipe = relationship("Recipe", back_populates="ingredients")

if __name__ == "__main__":
    from database import engine, Base
    Base.metadata.create_all(bind=engine)
    print("Таблицы успешно созданы!")