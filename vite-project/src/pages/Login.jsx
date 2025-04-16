import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../features/authThunks';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const credentials = { username, password };
      const result = await dispatch(loginUser(credentials));

      if (loginUser.fulfilled.match(result)) {
        localStorage.setItem('token', result.payload.token);
        navigate("/home");
      } else {
        setError("Неверный логин или пароль");
      }
    } catch (error) {
      setError("Произошла ошибка при входе");
    }
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
          <h2 className="text-3xl font-bold text-center mb-6">Авторизация</h2>
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
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Войти
            </button>
          </form>
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/register')}
              className="text-blue-500 hover:underline"
            >
              Зарегистрироваться
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
