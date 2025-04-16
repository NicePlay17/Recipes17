import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Login from './pages/Login';
import Register from './pages/Register';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/Profile';
import Ingredients from './pages/Ingredients'; // Новый компонент страницы рецепта
import { setAuthStatus } from './features/authSlice';
import FilterPage from './pages/FilterPage'; // Подразумеваем, что у вас есть этот action

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Если токен существует, считаем, что пользователь авторизован
    if (token) {
      dispatch(setAuthStatus(true));  // Устанавливаем статус авторизации
    }
  }, [token, dispatch]);

  return (
    <Routes>
      {isAuthenticated ? (
        <>
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/recipe/:id" element={<Ingredients />} /> {/* Новый маршрут для рецепта */}
          <Route path="/filter" element={<FilterPage />} /> {/* Страница фильтра */}
          <Route path="*" element={<Navigate to="/home" />} />
        </>
      ) : (
        <>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" />} />
        </>
      )}
    </Routes>
  );
};

export default App;
