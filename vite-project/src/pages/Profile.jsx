import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { changePassword, clearMessages } from "../features/profileSlice";

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newConfirmPassword, setNewConfirmPassword] = useState("");

  const { error, message, status } = useSelector((state) => state.profile);
  const backgrounds = [
    "/images/background6.jpg"
    
  ];
  useEffect(() => {
    return () => {
      dispatch(clearMessages());
    };
  }, [dispatch]);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== newConfirmPassword) {
      return alert("Пароли не совпадают!");
    }

    try {
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
    <div
  className="min-h-screen bg-cover bg-center flex items-center justify-center px-6 py-10"
  style={{ backgroundImage: `url(${backgrounds[0]})` }}
>

      {/* Кнопка "Назад" в левом верхнем углу */}
      <button
  onClick={() => navigate("/home")}
  className="absolute top-4 left-4 bg-[#a13d3d] text-black px-4 py-2 rounded-lg hover:bg-[#f75e5e] transition border border-gray-300 shadow-md"
      >
        ← Назад
      </button>

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-700">Мой профиль</h2>

        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Сменить пароль</h3>

        {error && <p className="text-red-600">{error}</p>}
        {message && <p className="text-green-600">{message}</p>}

        <form onSubmit={handleChangePassword}>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Текущий пароль:</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-4 bg-white border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Новый пароль:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-4 bg-white border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-500 transition-all"
            />
          </div>

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
    </div>
  );
}
