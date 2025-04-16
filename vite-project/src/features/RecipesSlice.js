// src/features/recipesSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  recipe: null,
  ingredients: [],
  loading: false,
  error: "",
};

const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    setRecipeLoading: (state) => {
      state.loading = true;
      state.error = "";
    },
    setRecipeSuccess: (state, action) => {
      state.loading = false;
      state.recipe = action.payload.recipe;
      state.ingredients = action.payload.ingredients;
    },
    setRecipeError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setRecipeLoading, setRecipeSuccess, setRecipeError } = recipesSlice.actions;

export default recipesSlice.reducer;
