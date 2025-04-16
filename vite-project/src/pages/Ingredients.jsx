import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { setRecipeLoading, setRecipeSuccess, setRecipeError } from "../features/recipesSlice";

export default function Ingredients() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const recipe = useSelector((state) => state.recipes.recipe);
  const ingredients = useSelector((state) => state.recipes.ingredients);
  const loading = useSelector((state) => state.recipes.loading);
  const error = useSelector((state) => state.recipes.error);

  const user = useSelector((state) => state.auth.user); // Получаем информацию о пользователе из состояния Redux

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);

  const [content, setContent] = useState("");
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        dispatch(setRecipeLoading());
        const response = await fetch(`http://localhost:8000/recipe/?recipe_id=${id}`);
        if (!response.ok) throw new Error("Ошибка при загрузке ингредиентов");
        const data = await response.json();
        dispatch(setRecipeSuccess({ recipe: data.recipe, ingredients: data.ingredients }));
      } catch (err) {
        dispatch(setRecipeError(err.message));
      }
    };

    fetchIngredients();
  }, [id, dispatch]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const res = await fetch(`http://localhost:8000/reviews/?recipe_id=${id}`);
        if (!res.ok) throw new Error("Ошибка при загрузке отзывов");
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        setReviewsError(err.message);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      setSubmitError("Пожалуйста, заполните все поля.");
      return;
    }

    if (!user || !user.id) {
      setSubmitError("Пожалуйста, войдите в систему для отправки отзыва.");
      return;
    }

    console.log("User from Redux:", user);
console.log("User from localStorage:", JSON.parse(localStorage.getItem('user')));
    try {
      setSubmitting(true);
      setSubmitError(null);
      const res = await fetch("http://localhost:8000/reviews/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipe_id: parseInt(id),
          user_id: user.id, // Подставляем id пользователя
          content,
        }),
      });

      if (!res.ok) throw new Error("Ошибка при отправке отзыва");

      // Очистка формы
      setContent("");

      // Обновление списка отзывов
      const updatedReviews = await fetch(`http://localhost:8000/reviews/?recipe_id=${id}`);
      const data = await updatedReviews.json();
      setReviews(data);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-100 to-pink-50 flex items-center justify-center px-6 py-10">
      <div className="absolute top-6 left-6">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-orange-500 text-white rounded-xl shadow hover:bg-orange-600 transition"
        >
          ← Назад
        </button>
      </div>

      {loading && <p className="text-gray-600 animate-pulse text-lg">Загрузка...</p>}
      {error && <p className="text-red-600 text-lg">{error}</p>}

      {recipe && (
        <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-3xl w-full">
          <h2 className="text-3xl font-bold text-orange-600 mb-6 text-center">{recipe.name}</h2>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">🧂 Ингредиенты</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 pl-4">
              {ingredients?.length > 0 ? (
                ingredients.map((ingredient, index) => (
                  <li key={index}>
                    <span className="font-semibold">{ingredient.name}</span> - {ingredient.quantity || "Количество не указано"}
                  </li>
                ))
              ) : (
                <li>Ингредиенты не найдены.</li>
              )}
            </ul>
          </div>

          <div className="mt-10">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">🗣️ Отзывы</h3>

            {reviewsLoading && <p className="text-gray-600">Загрузка отзывов...</p>}
            {reviewsError && <p className="text-red-600">{reviewsError}</p>}

            {reviews.length > 0 ? (
              <ul className="space-y-4 mb-6">
                {reviews.map((review) => (
                  <li key={review.id} className="bg-gray-100 p-4 rounded-xl shadow">
                    <p className="text-gray-800 mb-1">👤 <span className="font-semibold">{review.username}</span></p>
                    <p className="text-gray-700">{review.content}</p>
                  </li>
                ))}
              </ul>
            ) : (
              !reviewsLoading && <p className="text-gray-500 mb-6">Отзывов пока нет.</p>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <textarea
                placeholder="Оставьте отзыв..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl shadow-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
              ></textarea>
              {submitError && <p className="text-red-500">{submitError}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="bg-orange-500 text-white py-2 px-6 rounded-xl shadow hover:bg-orange-600 transition disabled:opacity-50"
              >
                {submitting ? "Отправка..." : "Отправить"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
