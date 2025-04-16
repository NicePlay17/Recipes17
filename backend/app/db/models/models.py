from sqlalchemy import create_engine, Column, Integer, String, DateTime, func, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from app.db.database import Base
from dotenv import load_dotenv
import hashlib
import os
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import TSVECTOR

load_dotenv()


DATABASE_URL = os.getenv("DATABASE_URL")


class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    search_vector = Column(TSVECTOR)

class Ingredient(Base):
    __tablename__ = "ingredients"
    id = Column(Integer, primary_key=True)
    recipe_id = Column(Integer, nullable=False)
    name = Column(String, nullable=False)
    quantity = Column(String, nullable=False)

class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True)
    recipe_id = Column(Integer, ForeignKey("recipes.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    content = Column(String, nullable=False)

    user = relationship("User", back_populates="reviews")

engine = create_engine(DATABASE_URL)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    reviews = relationship("Review", back_populates="user")


    def verify_password(self, password: str) -> bool:
        return self.hashed_password == hashlib.sha256(password.encode()).hexdigest()

    def set_password(self, password: str):
        self.hashed_password = hashlib.sha256(password.encode()).hexdigest()
