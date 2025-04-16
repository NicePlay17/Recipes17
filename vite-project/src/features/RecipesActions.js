// src/features/recipesActions.js
export const fetchRecipeData = (id) => async (dispatch) => {
    try {
      dispatch({ type: 'recipes/setLoading' });
  
      const response = await fetch(`http://localhost:8000/recipe/?recipe_id=${id}`);
      const data = await response.json();
  
      if (!response.ok) throw new Error('Ошибка при загрузке данных');
  
      dispatch({
        type: 'recipes/setRecipeSuccess',
        payload: {
          recipe: data.recipe,
          ingredients: data.ingredients,
        },
      });
    } catch (error) {
      dispatch({ type: 'recipes/setRecipeError', payload: error.message });
    }
  };
  