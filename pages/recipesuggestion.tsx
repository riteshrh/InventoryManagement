// pages/recipes.js
import { useEffect, useState } from 'react';
import { getRecipeSuggestions } from '../services/reciepe-service';
import { fetchPantryItems } from '../services/pantry-service';

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
    const pantryItems = await fetchPantryItems();
      const suggestions = await getRecipeSuggestions(pantryItems);
      setRecipes(suggestions);
      setLoading(false);
    };

    fetchRecipes();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Recipe Suggestions</h1>
      <ul>
        {recipes.map((recipe, index) => (
          <li key={index}>{recipe}</li>
        ))}
      </ul>
    </div>
  );
}
