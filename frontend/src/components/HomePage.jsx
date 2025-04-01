import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
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
      setRecipes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <button className="profile-button" onClick={() => navigate("/profile")}>
          <FaUser /> Мой профиль
        </button>
        <button className="logout-button" onClick={onLogout}>Выйти</button>
      </div>

      <div className="content">
        <div className="search-box">
          <input
            type="text"
            placeholder="Введите название рецепта"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="search-button" onClick={handleSearch}>
            <FaSearch /> Найти
          </button>
        </div>

        {loading && <p>Загрузка...</p>}
        {error && <p className="error">{error}</p>}

        <div className="recipe-list">
          {recipes.length > 0 ? (
            <ul>
              {recipes.map((recipe) => (
                <li key={recipe.id} onClick={() => navigate(`/recipe/${recipe.id}`)} className="recipe-item">
                  {recipe.name}
                </li>
              ))}
            </ul>
          ) : (
            !loading && query && <p>Рецепты не найдены</p>
          )}
        </div>
      </div>
    </div>
  );
}
