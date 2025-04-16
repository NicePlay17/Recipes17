import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../features/authThunks'; // Импортируем thunk
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, message } = useSelector((state) => state.auth); // Используем состояние из Redux

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Диспатчим экшн для регистрации
    dispatch(registerUser({ username, password }))
      .unwrap() // Делаем unwrap, чтобы обработать результат (если успешный или с ошибкой)
      .then(() => {
        // Если регистрация прошла успешно, показываем сообщение и через 2 секунды перенаправляем на страницу авторизации
        setTimeout(() => {
          navigate('/login');
        }, 2000);  // Перенаправление через 2 секунды
      })
      .catch((err) => {
        // Если ошибка, она будет автоматически установлена в Redux через экшн
        console.error(err);
      });
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Левая часть с картинкой */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-white">
        <img
          src="/chef.png" // убедись, что это обновлённый PNG с прозрачным фоном
          alt="Повар"
          className="max-w-[57%] h-auto drop-shadow-none shadow-none"
        />
      </div>

      {/* Правая часть с формой */}
      <div className="w-full md:w-1/2 flex items-center justify-left">
        <div className="bg-white p-10 rounded-xl border border-gray-300 shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-6">Регистрация</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 mb-2">Логин</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}
            {message && <p className="text-green-500 text-center">{message}</p>}
            {loading && <p className="text-gray-500 text-center">Загрузка...</p>}

            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Зарегистрироваться
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-blue-500 hover:underline"
            >
              Уже есть аккаунт? Войти
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
