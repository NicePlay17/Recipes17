import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaUser, FaFilter } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { logout } from "../features/authSlice";

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bgIndex, setBgIndex] = useState(0);

  const backgrounds = [
    "/images/background1.jpg",
    "/images/background2.jpg",
    "/images/background3.jpg"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [backgrounds.length]);

  // Обработка переданных данных с фильтров
  useEffect(() => {
    if (location.state?.filteredRecipes) {
      setRecipes(location.state.filteredRecipes);
    }
  }, [location.state]);

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Пожалуйста, введите хотя бы 3 символа.");
      setRecipes([]); // Очищаем список перед выводом ошибки
      return;
    }

    if (query.trim().length < 3) {
      setError(`Запрос должен содержать хотя бы 3 символа. Введено: ${query.trim().length}`);
      setRecipes([]); // Очищаем список перед выводом ошибки
      return;
    }

    setLoading(true);
    setError(""); // Сбрасываем ошибку
    setRecipes([]); // Сбрасываем список рецептов перед новым поиском

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

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-r from-teal-100 to-pink-50 items-center justify-start px-6 py-4">
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${backgrounds[bgIndex]})` }}
      ></div>

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
          onClick={() => navigate("/filter")}
          className="px-6 py-3 bg-yellow-500 text-white shadow-lg rounded-lg flex items-center gap-3 hover:bg-yellow-600 transition-all duration-300"
        >
          <FaFilter />
          Фильтр
        </button>
        <button
          onClick={handleLogout}
          className="px-6 py-3 bg-pink-500 text-white shadow-lg rounded-lg hover:bg-pink-600 transition-all duration-300"
        >
          Выйти
        </button>
      </div>

      {/* Поисковая форма */}
      <div className="flex flex-col items-center gap-6 w-full max-w-2xl mt-28 z-10">
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

        {error && (
          <div className="w-full max-w-2xl mt-2 p-4 bg-white border border-red-500 text-red-600 rounded-lg shadow-md">
            <p>{error}</p>
          </div>
        )}
      </div>

      {/* Результаты поиска */}
      <div className="mt-10 w-full max-w-2xl flex-grow z-10">
        {recipes.length > 0 ? (
          <div className="max-h-[500px] overflow-y-auto pr-2">
            <ul className="space-y-4">
              {recipes.map((recipe, index) => (
                <li
                  key={recipe.id || recipe.recipe?.id || index}
                  onClick={() => navigate(`/recipe/${recipe.id || recipe.recipe?.id}`)}
                  className="bg-white p-5 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:bg-teal-100"
                >
                  <h3 className="text-xl font-semibold text-orange-300">
                    {recipe.name || recipe.recipe?.name || "Без названия"}
                  </h3>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          !loading && query && <p className="text-red-600 text-center font-semibold text-lg"></p>
        )}
      </div>
    </div>
  );
}
