document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '1'; // API key for TheMealDB
    const guessInput = document.getElementById('guess-input');
    const submitGuessButton = document.getElementById('submit-guess');
    const feedback = document.getElementById('feedback');
    const ingredientList = document.getElementById('ingredient-list');
    const hintText = document.getElementById('ingredient-hint');
    const hintButton = document.getElementById('hint-button');
    const giveUpButton = document.getElementById('give-up');

    const modal = document.getElementById('result-modal');
    const overlay = document.getElementById('overlay');
    const closeModalButton = document.getElementById('close-modal');
    const expandModalButton = document.getElementById('expand-modal');
    const recipeName = document.getElementById('recipe-name');
    const recipeImage = document.getElementById('recipe-image');
    const recipeInstructions = document.getElementById('recipe-instructions');
    const recipeVideo = document.getElementById('recipe-video');

    const carouselLeft = document.getElementById('carousel-left');
    const carouselRight = document.getElementById('carousel-right');

    let currentRecipe = null; // Stores the current recipe
    let ingredients = []; // Array of ingredients for the current recipe
    let guessedRecipes = new Set(); // Track guessed recipes
    let revealedIngredients = 0; // Tracks how many ingredients have been revealed

    // Fetch and load a random recipe
    function loadRandomRecipe() {
        fetch('https://www.themealdb.com/api/json/v1/1/random.php')
            .then(response => response.json())
            .then(data => {
                if (data.meals && data.meals.length > 0) {
                    currentRecipe = data.meals[0];
                    ingredients = getIngredients(currentRecipe);

                    console.log("Loaded Recipe:", currentRecipe);
                    console.log("Ingredients:", ingredients);

                    // Display a hint about the recipe
                    const hint = `This recipe is a ${currentRecipe.strArea} dish in the ${currentRecipe.strCategory} category.`;
                    hintText.textContent = `Hint: ${hint}`;
                } else {
                    console.error('No meals found.');
                }
            })
            .catch(error => {
                console.error('Error fetching recipe:', error);
            });
    }

    // Extract ingredients from the recipe
    function getIngredients(recipe) {
        const ingredientArray = [];
        for (let i = 1; i <= 20; i++) {
            const ingredient = recipe[`strIngredient${i}`];
            const measure = recipe[`strMeasure${i}`];
            if (ingredient) {
                ingredientArray.push(`${ingredient} (${measure})`);
            }
        }
        return ingredientArray;
    }

    // Reveal the next ingredient in the list
    function revealNextIngredient() {
        if (revealedIngredients < ingredients.length) {
            const ingredientItem = document.createElement('li');
            ingredientItem.textContent = ingredients[revealedIngredients];
            ingredientList.appendChild(ingredientItem);
            revealedIngredients++;
        } else {
            feedback.textContent = 'No more ingredients to reveal!';
        }
    }

    // Populate the modal with recipe details
    function populateModal(recipe) {
        recipeName.textContent = recipe.strMeal;
        recipeImage.src = recipe.strMealThumb;
        recipeImage.alt = recipe.strMeal;
        recipeInstructions.textContent = recipe.strInstructions;
        recipeVideo.href = recipe.strYoutube;
        recipeVideo.style.display = recipe.strYoutube ? 'block' : 'none';

        // Reset modal state
        recipeInstructions.style.display = 'none';
        expandModalButton.style.display = 'block';

        // Show the modal
        modal.style.display = 'block';
        overlay.style.display = 'block';
    }

    // Close the modal
    function closeModal() {
        modal.style.display = 'none';
        overlay.style.display = 'none';
    }

    // Reset the game state
    function resetGame() {
        guessInput.value = '';
        feedback.textContent = '';
        ingredientList.innerHTML = ''; // Clear the ingredient list
        guessedRecipes.clear();
        revealedIngredients = 0;

        loadRandomRecipe();
        showIngredientList();
        closeModal();
    }

    // Check the user's guess
    function checkGuess(guess) {
        if (!currentRecipe) return false;
        return guess.toLowerCase() === currentRecipe.strMeal.toLowerCase();
    }

    // Event listener for submitting a guess
    submitGuessButton.addEventListener('click', () => {
        const guess = guessInput.value.trim();
        if (!guess) {
            feedback.textContent = 'Cannot enter an empty guess!';
            return;
        }
        if (guessedRecipes.has(guess.toLowerCase())) {
            feedback.textContent = 'You have already guessed this!';
            return;
        }

        guessedRecipes.add(guess.toLowerCase());

        if (checkGuess(guess)) {
            feedback.textContent = 'Correct! Well done!';
            populateModal(currentRecipe); // Show modal with recipe details
        } else {
            feedback.textContent = 'Incorrect guess!';
            revealNextIngredient();
        }
    });

    // Event listener for the "Give Up" button
    giveUpButton.addEventListener('click', () => {
        feedback.textContent = `The correct recipe was: ${currentRecipe.strMeal}`;
        populateModal(currentRecipe); // Show modal with recipe details
    });

    // Event listener for closing the modal
    closeModalButton.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    // Event listener for expanding the modal
    expandModalButton.addEventListener('click', () => {
        recipeInstructions.style.display = 'block';
        expandModalButton.style.display = 'none';
    });
    function showIngredientList() {
        ingredientList.classList.add('show');
    }
    // Fetch and populate carousels
    async function populateCarousels() {
        try {
            const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s='); // Fetch all recipes
            const data = await response.json();

            if (data.meals) {
                const meals = data.meals;

                // Create wrapper for the carousel images
                const leftWrapper = document.createElement('div');
                leftWrapper.classList.add('carousel-wrapper');

                const rightWrapper = document.createElement('div');
                rightWrapper.classList.add('carousel-wrapper');

                // Add images to the wrapper
                function addImages(wrapper) {
                    meals.forEach(meal => {
                        const img = document.createElement('img');
                        img.src = meal.strMealThumb;
                        img.alt = meal.strMeal;
                        wrapper.appendChild(img);
                    });
                }

                // Add images to both carousels
                addImages(leftWrapper);
                addImages(rightWrapper);

                // Add the first wrapper to the left carousel
                carouselLeft.appendChild(leftWrapper);

                // Create clone of leftWrapper and append it to make the loop seamless
                const leftClone = leftWrapper.cloneNode(true);
                carouselLeft.appendChild(leftClone);

                // Add the second wrapper to the right carousel
                carouselRight.appendChild(rightWrapper);

                // Create clone of rightWrapper and append it to make the loop seamless
                const rightClone = rightWrapper.cloneNode(true);
                carouselRight.appendChild(rightClone);
            }
        } catch (error) {
            console.error('Error fetching recipes for carousel:', error);
        }
    }

    // Call the function to populate carousels
    populateCarousels();
    

    
    // Initialise the game
    resetGame();
});
