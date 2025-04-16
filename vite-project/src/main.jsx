import React from "react";
import ReactDOM from "react-dom/client"; // Для React 18
import { Provider } from "react-redux"; // Подключение Redux
import { store } from "./app/store";     // Импорт хранилища
import { BrowserRouter } from "react-router-dom"; // Роутинг

import App from "./App";
import "./index.css";
import "./style.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
