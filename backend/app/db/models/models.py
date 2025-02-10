from sqlalchemy import create_engine, Column, Integer, String, DateTime, func
from sqlalchemy.ext.declarative import declarative_base
from database import Base

DATABASE_URL = "postgresql://postgres:170805Maks@localhost:5432/postgres"

Base = declarative_base()

class Ingredient(Base):
    __tablename__ = "ingredients"

    id = Column(Integer, primary_key=True)
    recipe_name = Column(String, nullable=False)
    ingredient = Column(String, nullable=False)

engine = create_engine(DATABASE_URL)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=func.now())