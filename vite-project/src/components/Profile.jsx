import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");  // Текущий пароль для смены
  const [newPassword, setNewPassword] = useState("");          // Новый пароль
  const [newConfirmPassword, setNewConfirmPassword] = useState(""); // Подтверждение нового пароля
  const [error, setError] = useState("");  // Ошибка
  const [message, setMessage] = useState("");  // Успешное сообщение

  const handleSave = () => {
    if (password !== confirmPassword) {
      alert("Пароли не совпадают!");
      return;
    }
    alert("Данные сохранены");
  };

  // Функция для изменения пароля
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== newConfirmPassword) {
      setError("Пароли не совпадают!");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // Получаем токен из localStorage

      const response = await fetch("http://localhost:8000/change-password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          token: token, // Передаем токен в теле запроса
        }),
      });

      if (!response.ok) {
        throw new Error("Не удалось изменить пароль");
      }

      const data = await response.json();
      setMessage(data.message);
      setCurrentPassword("");
      setNewPassword("");
      setNewConfirmPassword("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-teal-100 to-white-50 px-6 py-4 font-poppins">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-700">Мой профиль</h2>

        <div className="space-y-6">
          {/* Имя пользователя */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Имя:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 bg-white border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-500 transition-all"
            />
          </div>

          {/* Кнопки сохранения */}
          <div className="flex justify-between gap-4 mt-6">
            <button
              className="w-full py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all duration-300"
              onClick={handleSave}
            >
              Сохранить
            </button>
            <button
              className="w-full py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-all duration-300"
              onClick={() => navigate("/home")}
            >
              Назад
            </button>
          </div>
        </div>

        {/* Форма для смены пароля */}
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">Сменить пароль</h3>

          {error && <p className="text-red-600">{error}</p>}
          {message && <p className="text-green-600">{message}</p>}

          <form onSubmit={handleChangePassword}>
            {/* Текущий пароль */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Текущий пароль:</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-4 bg-white border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-500 transition-all"
              />
            </div>

            {/* Новый пароль */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Новый пароль:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-4 bg-white border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-500 transition-all"
              />
            </div>

            {/* Подтверждение нового пароля */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Подтвердите новый пароль:</label>
              <input
                type="password"
                value={newConfirmPassword}
                onChange={(e) => setNewConfirmPassword(e.target.value)}
                className="w-full p-4 bg-white border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-500 transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all duration-300 mt-6"
            >
              Сменить пароль
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
