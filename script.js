<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recipe Guessing Game</title>
    <style>
        /* Simple styling for the game */
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        #result {
            display: none;
        }
        #ingredient-list {
            margin-top: 20px;
        }
        #ingredient-list li {
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <h1>Guess the Recipe</h1>

    <div>
        <input type="text" id="guess-input" placeholder="Enter your guess here...">
        <button id="submit-guess">Submit Guess</button>
        <button id="hint-button">Get Hint</button>
        <button id="give-up">Give Up</button>
    </div>

    <p id="feedback"></p>
    <p id="ingredient-hint">Hint: Guess to reveal ingredients!</p>
    
    <ul id="ingredient-list"></ul>

    <div id="result">
        <h2 id="recipe-name"></h2>
        <img id="recipe-image" alt="Recipe Image">
        <p id="recipe-instructions"></p>
        <a id="recipe-video" target="_blank">Watch Video</a>
    </div>

    <script>
        const apiKey = '1';  // You can register at themealdb.com to get an API key
        let currentRecipe = null;
        let ingredientIndex = 0;
        let maxIngredients = 20;

        document.addEventListener('DOMContentLoaded', () => {
            const submitGuess = document.getElementById('submit-guess');
            const guessInput = document.getElementById('guess-input');
            const feedback = document.getElementById('feedback');
            const ingredientHint = document.getElementById('ingredient-hint');
            const ingredientList = document.getElementById('ingredient-list');
            const resultDiv = document.getElementById('result');
            const recipeNameElem = document.getElementById('recipe-name');
            const recipeImageElem = document.getElementById('recipe-image');
            const recipeInstructionsElem = document.getElementById('recipe-instructions');
            const recipeVideoElem = document.getElementById('recipe-video');
            const hintButton = document.getElementById('hint-button');
            const giveUpButton = document.getElementById('give-up');

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

            // Display the next ingredient and keep it on the screen
            function displayNextIngredient() {
                if (ingredientIndex < maxIngredients && currentRecipe[`strIngredient${ingredientIndex + 1}`]) {
                    const ingredient = currentRecipe[`strIngredient${ingredientIndex + 1}`];
                    const listItem = document.createElement('li');
                    listItem.textContent = `Ingredient ${ingredientIndex + 1}: ${ingredient}`;
                    ingredientList.appendChild(listItem);
                    ingredientIndex++;
                } else {
                    ingredientHint.textContent = 'No more ingredients! Give your best guess or give up!';
                }
            }

            // Provide an additional hint about the recipe (e.g., category or area)
            function provideRecipeHint() {
                const hint = `Hint: This is a ${currentRecipe.strArea} ${currentRecipe.strCategory}.`;
                ingredientHint.textContent = hint;
            }

            // Check the player's guess
            function checkGuess(guess) {
                if (guess.toLowerCase() === currentRecipe.strMeal.toLowerCase()) {
                    feedback.textContent = 'Correct! Here is the recipe:';
                    showRecipe();
                } else if (ingredientIndex < maxIngredients) {
                    feedback.textContent = 'Incorrect, try again!';
                    displayNextIngredient();
                } else {
                    feedback.textContent = 'Out of ingredients! Here is the recipe:';
                    showRecipe();
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
                hintButton.disabled = true;
                giveUpButton.disabled = true;
            }

            // Handle the guess submission
            submitGuess.addEventListener('click', () => {
                const guess = guessInput.value;
                if (guess) {
                    checkGuess(guess);
                }
            });

            // Provide a hint when the hint button is clicked
            hintButton.addEventListener('click', provideRecipeHint);

            // Give up and show the recipe
            giveUpButton.addEventListener('click', () => {
                feedback.textContent = 'You gave up! Here is the recipe:';
                showRecipe();
            });

            // Fetch a recipe on page load
            fetchRandomRecipe();
        });
    </script>
</body>
</html>
