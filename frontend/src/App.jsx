import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./components/Login";
import Register from './components/Register';
import HomePage from './components/HomePage';
import ProfilePage from './components/Profile';
import Ingredients from './components/Ingredients'; // Импорт компонента с ингредиентами
import "./style.css";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <Router>
      <Routes>
        {token ? (
          <>
            <Route path="/home" element={<HomePage onLogout={handleLogout} />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/recipe/:id" element={<Ingredients />} /> {/* Новый маршрут для ингредиентов */}
            <Route path="*" element={<Navigate to="/home" />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
