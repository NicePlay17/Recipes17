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
    <div className="container">
      <button onClick={() => navigate(-1)}>Назад</button>

      {loading && <p>Загрузка...</p>}
      {error && <p className="error">{error}</p>}

      {recipe && (
        <>
          <h2>{recipe.name}</h2>
          <ul>
            {ingredients.map((ingredient, index) => (
              <li key={index}>
                {ingredient.name} - {ingredient.quantity || "Количество не указано"}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
