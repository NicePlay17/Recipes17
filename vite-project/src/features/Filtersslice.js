// features/Filtersslice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedIngredients: [],
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    addIngredient: (state, action) => {
      if (!state.selectedIngredients.includes(action.payload)) {
        state.selectedIngredients.push(action.payload);
      }
    },
    removeIngredient: (state, action) => {
      state.selectedIngredients = state.selectedIngredients.filter(
        (ingredient) => ingredient !== action.payload
      );
    },
  },
});

export const { addIngredient, removeIngredient } = filtersSlice.actions;
export default filtersSlice.reducer;
