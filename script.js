const apiKey = '1';  // You can register at themealdb.com to get an API key
let currentRecipe = null;
let ingredientIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    const submitGuess = document.getElementById('submit-guess');
    const guessInput = document.getElementById('guess-input');
    const feedback = document.getElementById('feedback');
    const ingredientHint = document.getElementById('ingredient-hint');
    const resultDiv = document.getElementById('result');
    const recipeNameElem = document.getElementById('recipe-name');
    const recipeImageElem = document.getElementById('recipe-image');
    const recipeInstructionsElem = document.getElementById('recipe-instructions');
    const recipeVideoElem = document.getElementById('recipe-video');

    // Fetch a random recipe from TheMealDB
    function fetchRandomRecipe() {
        fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
            .then(response => response.json())
            .then(data => {
                currentRecipe = data.meals[0];
                ingredientIndex = 0;
                displayNextIngredient();
            })
            .catch(error => {
                console.error('Error fetching recipe:', error);
            });
    }

    // Display the next ingredient as a hint
    function displayNextIngredient() {
        if (ingredientIndex < 20 && currentRecipe[`strIngredient${ingredientIndex + 1}`]) {
            ingredientHint.textContent = `Hint: Ingredient ${ingredientIndex + 1}: ${currentRecipe[`strIngredient${ingredientIndex + 1}`]}`;
            ingredientIndex++;
        } else {
            ingredientHint.textContent = 'No more ingredients! Give your best guess!';
        }
    }

    // Check the player's guess
    function checkGuess(guess) {
        if (guess.toLowerCase() === currentRecipe.strMeal.toLowerCase()) {
            feedback.textContent = 'Correct! Here is the recipe:';
            showRecipe();
        } else {
            feedback.textContent = 'Incorrect, try again!';
            displayNextIngredient();
        }
    }

    // Show the full recipe if the player wins or gives up
    function showRecipe() {
        resultDiv.style.display = 'block';
        recipeNameElem.textContent = currentRecipe.strMeal;
        recipeImageElem.src = currentRecipe.strMealThumb;
        recipeInstructionsElem.textContent = currentRecipe.strInstructions;
        recipeVideoElem.href = currentRecipe.strYoutube;
        recipeVideoElem.textContent = 'Watch Video';
        guessInput.disabled = true;
        submitGuess.disabled = true;
    }

    // Handle the guess submission
    submitGuess.addEventListener('click', () => {
        const guess = guessInput.value;
        if (guess) {
            checkGuess(guess);
        }
    });

    // Fetch a recipe on page load
    fetchRandomRecipe();
});
