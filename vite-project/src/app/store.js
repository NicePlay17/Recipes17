// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import profileReducer from '../features/profileSlice';
import recipesReducer from '../features/recipesSlice';
import filtersReducer from '../features/Filtersslice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    recipes: recipesReducer,
    filters: filtersReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});
