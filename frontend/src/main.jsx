import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactDOM from 'react-dom/client';  // Для React 18
import { useNavigate } from "react-router-dom";  // Импортируем useNavigate
import './style.css';
import App from './App';

function Home() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();  // Инициализация navigate

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/protected", {
          headers: { Authorization: token },
        });

        setMessage(response.data.message);
      } catch (error) {
        navigate("/");  // Перенаправление в случае ошибки
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <div>
      <h2>{message}</h2>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
