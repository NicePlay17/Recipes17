import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaUser } from "react-icons/fa";

export default function HomePage({ onLogout }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:8000/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Ошибка при загрузке рецептов");

      const data = await response.json();
      setRecipes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-teal-100 to-pink-50 items-center justify-start px-6 py-4 relative">
      {/* Верхние кнопки */}
      <div className="absolute top-5 right-5 flex gap-4 z-10">
        <button
          onClick={() => navigate("/profile")}
          className="px-6 py-3 bg-teal-500 text-white shadow-lg rounded-lg flex items-center gap-3 hover:bg-teal-600 transition-all duration-300"
        >
          <FaUser />
          Мой профиль
        </button>
        <button
          onClick={onLogout}
          className="px-6 py-3 bg-pink-500 text-white shadow-lg rounded-lg hover:bg-pink-600 transition-all duration-300"
        >
          Выйти
        </button>
      </div>

      {/* Поисковая форма */}
      <div className="flex flex-col items-center gap-6 w-full max-w-2xl mt-28">
        <div className="flex w-full gap-2">
          <input
            type="text"
            placeholder="Введите название рецепта"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-grow p-4 bg-white border border-gray-300 rounded-l-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-500 max-w-xl transition duration-200 ease-in-out"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-4 bg-teal-500 text-white border-l-0 border-gray-300 rounded-r-lg flex items-center gap-3 hover:bg-teal-600 transition-all duration-300"
          >
            <FaSearch />
            Найти
          </button>
        </div>

        {loading && <p className="text-teal-600 animate-pulse">Загрузка...</p>}
        {error && <p className="text-red-500">{error}</p>}
      </div>

      {/* Результаты поиска */}
      <div className="mt-10 w-full max-w-2xl flex-grow overflow-auto">
        {recipes.length > 0 ? (
          <ul className="space-y-4">
            {recipes.map((recipe) => (
              <li
                key={recipe.id}
                onClick={() => navigate(`/recipe/${recipe.id}`)}
                className="bg-white p-5 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:bg-teal-100"
              >
                <h3 className="text-xl font-semibold text-orange-300">{recipe.name}</h3>
              </li>
            ))}
          </ul>
        ) : (
          !loading &&
          query && <p className="text-gray-600 text-center">Рецепты не найдены</p>
        )}
      </div>
    </div>
  );
}
