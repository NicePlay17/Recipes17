import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Ingredients() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await fetch(`http://localhost:8000/recipe/?recipe_id=${id}`);
        if (!response.ok) throw new Error("Ошибка при загрузке ингредиентов");

        const data = await response.json();
        setRecipe(data.recipe);
        setIngredients(data.ingredients);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, [id]);

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
              {ingredients.map((ingredient, index) => (
                <li key={index}>
                  <span className="font-semibold">{ingredient.name}</span> - {ingredient.quantity || "Количество не указано"}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">📖 Инструкция</h3>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed bg-orange-50 p-4 rounded-xl">
              {recipe.instructions}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
