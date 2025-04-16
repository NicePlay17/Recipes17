from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.database import get_db
from app.db.models.models import Review
from sqlalchemy.orm import selectinload
from pydantic import BaseModel

router = APIRouter()

@router.get("/reviews/")
async def get_reviews(recipe_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Review).options(selectinload(Review.user)).where(Review.recipe_id == recipe_id)
    )
    reviews = result.scalars().all()
    return [
        {
            "id": review.id,
            "user_id": review.user_id,
            "username": review.user.username if review.user else "Неизвестно",
            "content": review.content
        } for review in reviews
    ]


class ReviewCreate(BaseModel):
    recipe_id: int
    user_id: int
    content: str

    

@router.post("/reviews/")
async def create_review(review_data: ReviewCreate, db: AsyncSession = Depends(get_db)):
    new_review = Review(
        recipe_id=review_data.recipe_id,
        user_id=review_data.user_id,
        content=review_data.content
    )
    db.add(new_review)
    await db.commit()
    await db.refresh(new_review)
    return {
        "id": new_review.id,
        "recipe_id": new_review.recipe_id,
        "user_id": new_review.user_id,
        "content": new_review.content
    }
