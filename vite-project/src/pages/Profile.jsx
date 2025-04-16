import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { changePassword, clearMessages } from "../features/profileSlice";

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Состояния для полей формы
  const [currentPassword, setCurrentPassword] = useState("");  
  const [newPassword, setNewPassword] = useState("");          
  const [newConfirmPassword, setNewConfirmPassword] = useState(""); 
  
  // Получаем данные из Redux
  const { username, error, message, status } = useSelector((state) => state.profile);
  
  // Эффект для очистки сообщений при изменении
  useEffect(() => {
    return () => {
      dispatch(clearMessages());
    };
  }, [dispatch]);
  
  // Функция для смены пароля
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== newConfirmPassword) {
      return alert("Пароли не совпадают!");
    }

    try {
      const token = localStorage.getItem("token"); // Получаем токен из localStorage

      const data = await dispatch(changePassword({ current_password: currentPassword, new_password: newPassword }));

      if (changePassword.rejected.match(data)) {
        alert("Ошибка: " + data.payload);
      } else {
        setCurrentPassword("");
        setNewPassword("");
        setNewConfirmPassword("");
      }
    } catch (err) {
      alert("Произошла ошибка");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-teal-100 to-white-50 px-6 py-4 font-poppins">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-700">Мой профиль</h2>

        {/* Имя пользователя */}
        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Имя:</label>
            <input
              type="text"
              value={username}
              readOnly
              className="w-full p-4 bg-white border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-500 transition-all"
            />
          </div>

          {/* Форма для смены пароля */}
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
              disabled={status === 'loading'}
            >
              Сменить пароль
            </button>
          </form>
        </div>

        {/* Кнопка назад */}
        <div className="flex justify-between gap-4 mt-6">
          <button
            className="w-full py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-all duration-300"
            onClick={() => navigate("/home")}
          >
            Назад
          </button>
        </div>
      </div>
    </div>
  );
}
