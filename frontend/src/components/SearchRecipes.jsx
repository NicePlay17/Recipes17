import React, { useState } from "react";
import styles from "./SearchRecipes.module.css"; 

const SearchRecipes = () => {
    const [query, setQuery] = useState("");
    const [recipes, setRecipes] = useState([]);

    const handleSearch = async () => {
        if (query.length < 2) {
            setRecipes([]); 
            return;
        }

        try {
            console.log("Запрос отправлен:", query);
            const response = await fetch(`http://127.0.0.1:8000/search/?query=${query}`);
            
            if (!response.ok) {
                throw new Error(`Ошибка запроса: ${response.status}`);
            }

            const data = await response.json();
            console.log("Ответ сервера:", data);
            setRecipes(data);
        } catch (error) {
            console.error("Ошибка при загрузке рецептов:", error);
        }
    };

    return (
        <div className={styles.searchContainer}>
            <input 
                type="text"
                placeholder="Поиск рецептов..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={styles.searchInput}
            />
            <button onClick={handleSearch} className={styles.searchButton}>Найти</button>

            {recipes.length > 0 && (
                <ul className={styles.searchResults}>
                    {recipes.map((recipe, index) => (
                        <li key={recipe.id || index}>{recipe.name}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchRecipes;
