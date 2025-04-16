// src/features/auth/authThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Логин
export const loginUser = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    // Здесь предполагается, что credentials включает username и password
    const response = await axios.post('http://localhost:8000/auth/login', credentials);
    return response.data;  // Возвращаем данные, полученные от сервера
  } catch (err) {
    // Возвращаем ошибку с деталями из ответа сервера (если есть)
    return thunkAPI.rejectWithValue(err.response?.data?.detail || 'Ошибка входа');
  }
});

// Регистрация
export const registerUser = createAsyncThunk('auth/register', async (credentials, thunkAPI) => {
  try {
    const response = await axios.post('http://localhost:8000/auth/register', credentials);
    return { message: 'Регистрация успешна!' };  // Возвращаем успешное сообщение
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.detail || 'Ошибка регистрации');
  }
});

// Смена пароля
export const changePassword = createAsyncThunk('auth/changePassword', async (data, thunkAPI) => {
  try {
    const response = await axios.post('http://localhost:8000/change-password/', data, {
      headers: {
        Authorization: `Bearer ${data.token}`,  // Передаем токен в заголовке
      },
    });
    return { message: response.data.message };  // Возвращаем сообщение о успешной смене пароля
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.detail || 'Ошибка смены пароля');
  }
});
