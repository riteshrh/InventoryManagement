export const getRecipeSuggestions = async (pantryItems) => {
  try {
    const itemsString = pantryItems.map(item => item.name).join(', ');
    const prompt = `Given the following pantry items: ${itemsString}, suggest some recipes.`;

    console.log('Making request to OpenRouter API with prompt:', prompt);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_GITHUB}`,
        // 'HTTP-Referer': `${process.env.NEXT_PUBLIC_SITE_URL}`,
        // 'X-Title': `${process.env.NEXT_PUBLIC_SITE_NAME}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini-2024-07-18',
        messages: [
          { role: 'user', content: prompt }
        ],
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error fetching recipe suggestions: ${errorData.message}`);
    }

    const data = await response.json();
    const recipes = data.choices[0]?.message?.content?.split('\n').filter(Boolean) || [];
    return recipes;

  } catch (error) {
    console.error('Error fetching recipe suggestions:', error.message);
    throw error;
  }
};
