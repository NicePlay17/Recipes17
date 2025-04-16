import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addIngredient, removeIngredient } from '../features/Filtersslice';
import { Link } from 'react-router-dom';

const FilterPage = () => {
  const dispatch = useDispatch();
  const selectedIngredients = useSelector(state => state.filters?.selectedIngredients || []);
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchIngredients = async () => {
      const response = await fetch('http://localhost:8000/ingtorec');
      const data = await response.json();
      const unique = [...new Map(data.map(item => [item.name, item])).values()];
      setIngredients(unique);
    };
    fetchIngredients();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    const filtered = ingredients
      .filter(ing => ing.name.toLowerCase().startsWith(value.toLowerCase()))
      .filter(ing => !selectedIngredients.includes(ing.name));
    setFilteredSuggestions(filtered);
  };

  const handleSuggestionClick = (ingredientName) => {
    if (!selectedIngredients.includes(ingredientName)) {
      dispatch(addIngredient(ingredientName));
      setInputValue('');
      setFilteredSuggestions([]);
    }
  };

  const handleRemove = (ingredientName) => {
    dispatch(removeIngredient(ingredientName));
  };

  const handleSearch = async () => {
    if (selectedIngredients.length === 0) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      selectedIngredients.forEach((ing) => params.append('ingredients', ing));
      const response = await fetch(`http://localhost:8000/search_by_ingredients?${params.toString()}`);
      const data = await response.json();
      setRecipes(data);
    } catch (err) {
      console.error('Ошибка при поиске рецептов:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen p-4">
      {/* Центрированная панель с фильтрами */}
      <div className="w-1/2 p-4 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl mb-2 text-center">Найди и выбери ингредиенты</h2>

        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Начни вводить..."
          className="w-full p-2 border rounded mb-2"
        />

        {/* Выпадающий список */}
        {filteredSuggestions.length > 0 && (
          <ul className="border bg-white rounded shadow max-h-40 overflow-y-auto">
            {filteredSuggestions.map((item) => (
              <li
                key={item.id}
                onClick={() => handleSuggestionClick(item.name)}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                {item.name}
              </li>
            ))}
          </ul>
        )}

        {/* Выбранные ингредиенты */}
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedIngredients.map((name) => (
            <span
              key={name}
              className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full flex items-center space-x-2"
            >
              <span>{name}</span>
              <button onClick={() => handleRemove(name)} className="ml-2 text-red-600 font-bold">&times;</button>
            </span>
          ))}
        </div>

        <button
          onClick={handleSearch}
          className="mt-4 px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all w-full"
        >
          Найти рецепт
        </button>
      </div>

      {/* Правая панель для отображения рецептов с прокруткой */}
      <div className="w-1/2 p-4">
        {loading ? (
          <p className="text-teal-600 animate-pulse text-center">Загрузка...</p>
        ) : (
          <div>
            {recipes.length > 0 ? (
              <div
                className="max-h-150 overflow-y-scroll space-y-4"
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#4fa3b1 #e0f7fa' }}
              >
                {recipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="bg-white p-4 mb-4 rounded-lg shadow-md hover:shadow-xl cursor-pointer"
                  >
                    <Link to={`/recipe/${recipe.id}`}>
                      <h3 className="text-xl font-semibold">{recipe.name}</h3>
                      <p className="text-gray-500">{recipe.name}</p>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">Рецепты не найдены</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterPage;
