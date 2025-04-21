from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import  init_db
from app.routers.auth import router as auth_router
from dotenv import load_dotenv
import os
from app.routers.recipes import router as search_router
from app.routers.ingredients import router as recipe_router, router as ingtorec_router, router as search_by_ingredients_router
from app.routers.change_password import router as password_change_router
from app.routers.review import router as reviews_router
from app.routers.profile import router as profile_router
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

app = FastAPI()

# Разрешённые источники для CORS
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5173",
    "http://192.168.116.205:5173/",
    "http://192.168.56.1:5173/"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    await init_db()


# Подключаем маршруты авторизации
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(search_router, prefix="", tags=["search"])
app.include_router(recipe_router, prefix="", tags=["recipe"])
app.include_router(password_change_router, prefix="", tags=["user"])
app.include_router(ingtorec_router, prefix="", tags=["intorec"])
app.include_router(search_by_ingredients_router, prefix="", tags=["search_reecipe_ing"])
app.include_router(reviews_router, prefix="", tags=["review"])
app.include_router(profile_router, prefix="", tags=["profile"])


# # Главная страница API
# @app.get("/")
# def read_root():
#     return {"message": "API is running"}



