import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Создаем асинхронный экшен для получения данных профиля
export const fetchProfile = createAsyncThunk('profile/fetchProfile', async (userId, thunkAPI) => {
  try {
    const response = await axios.get(`http://localhost:8000/api/profile/${userId}`);
    return response.data; // возвращаем данные профиля
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Смена пароля
export const changePassword = createAsyncThunk(
  'profile/changePassword',
  async ({ current_password, new_password }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      
      // Отправляем запрос на сервер
      const response = await fetch('http://localhost:8000/change-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password,
          new_password,
          token, // Токен должен быть передан в теле запроса
        }),
      });

      // Ответ от сервера
      const data = await response.json();

      // Если ответ от сервера не успешный (не 2xx)
      if (!response.ok) {
        throw new Error(data.detail || 'Ошибка смены пароля');
      }

      return data.message; // Сообщение от сервера
    } catch (error) {
      // Обработка ошибок и возврат с сообщением об ошибке
      return rejectWithValue(error.message);
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    username: '',
    status: 'idle', // Статус: 'idle', 'loading', 'succeeded', 'failed'
    error: null,
    message: '',
  },
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    clearMessages: (state) => {
      state.error = null;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Когда идет запрос на смену пароля
      .addCase(changePassword.pending, (state) => {
        state.status = 'loading';
        state.error = null; // Очистка предыдущих ошибок
        state.message = ''; // Очистка сообщения о статусе
      })
      // Когда запрос на смену пароля выполнен успешно
      .addCase(changePassword.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = action.payload; // Сообщение от сервера о смене пароля
      })
      // Когда запрос на смену пароля завершился с ошибкой
      .addCase(changePassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; // Сообщение об ошибке
      });
  },
});

export const { setUsername, clearMessages } = profileSlice.actions;
export default profileSlice.reducer;
