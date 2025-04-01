import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [favorites, setFavorites] = useState(["Рецепт 1", "Рецепт 2"]); // Для примера

  const handleSave = () => {
    if (password !== confirmPassword) {
      alert("Пароли не совпадают!");
      return;
    }
    alert("Данные сохранены");
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">Мой профиль</h2>

      <div className="profile-section">
        <label>Имя:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="profile-section">
        <label>Новый пароль:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="profile-section">
        <label>Подтвердите пароль:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <div className="profile-section">
        <h3>Избранные рецепты</h3>
        <ul>
          {favorites.map((recipe, index) => (
            <li key={index}>{recipe}</li>
          ))}
        </ul>
      </div>

      <div className="profile-buttons">
        <button className="save-button" onClick={handleSave}>Сохранить</button>
        <button className="back-button" onClick={() => navigate("/home")}>Назад</button>
      </div>
    </div>
  );
}
