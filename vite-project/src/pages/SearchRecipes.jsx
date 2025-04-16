import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchRecipes = () => {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();  // Хук для навигации

  const handleSearch = async () => {
    if (query.length < 2) {
      setRecipes([]);
      return;
    }

    try {
      console.log("Запрос отправлен:", query);
      const response = await fetch(`http://127.0.0.1:8000/search/?query=${query}`);
      
      if (!response.ok) {
        throw new Error(`Ошибка запроса: ${response.status}`);
      }

      const data = await response.json();
      console.log("Ответ сервера:", data);
      setRecipes(data);
    } catch (error) {
      console.error("Ошибка при загрузке рецептов:", error);
    }
  };

  const handleRecipeClick = (id) => {
    navigate(`/recipe/${id}`);  // Переход на страницу рецепта
  };

  return (
    <div className="flex flex-col items-center p-4">
      <input
        type="text"
        placeholder="Поиск рецептов..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <button
        onClick={handleSearch}
        className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      >
        Найти
      </button>

      {recipes.length > 0 && (
        <ul className="mt-4 w-full max-w-xl bg-white border border-gray-300 rounded-md max-h-52 overflow-y-auto">
          {recipes.map((recipe) => (
            <li
              key={recipe.id}
              className="p-3 cursor-pointer hover:bg-gray-100"
              onClick={() => handleRecipeClick(recipe.id)}  // Обработчик клика
            >
              {recipe.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchRecipes;
