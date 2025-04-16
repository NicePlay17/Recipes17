import { createSlice } from '@reduxjs/toolkit';
import { loginUser, registerUser, changePassword } from './authThunks';

// Безопасное извлечение пользователя из localStorage
let storedUser = null;
try {
  const userFromStorage = localStorage.getItem('user');
  if (userFromStorage && userFromStorage !== "undefined") {
    storedUser = JSON.parse(userFromStorage);
  }
} catch (e) {
  console.error('Ошибка при разборе user из localStorage:', e);
}

const initialState = {
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  user: storedUser,
  loading: false,
  error: null,
  message: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    setAuthStatus: (state, action) => {
      state.isAuthenticated = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { token, user } = action.payload;
        state.token = token;
        state.isAuthenticated = true;
        state.user = user;
        state.loading = false;

        // Сохраняем токен и пользователя
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user)); // user должен включать `id`, `username` и т.п.
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.loading = false;

        // Если сервер возвращает user и token, можно раскомментировать и сохранить:
        // const { token, user } = action.payload;
        // state.token = token;
        // state.user = user;
        // state.isAuthenticated = true;
        // localStorage.setItem('token', token);
        // localStorage.setItem('user', JSON.stringify(user));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, setAuthStatus } = authSlice.actions;
export default authSlice.reducer;
