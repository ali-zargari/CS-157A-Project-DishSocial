import './mainpage.css';
import {
    getUserIdFromCookie,
    logoutUser,
    showAllUser,
    showFriends,
    getAllRecipes,
    getSelectedRecipeInfo,
    getUserFriendReviews,
    generalSearchRecipes,
    performAdvancedRecipeSearch
} from './controller';

let selectedRecipeId = null;

console.log(getUserIdFromCookie());

document.getElementById('logoutButton').addEventListener('click', async function (event) {
    event.preventDefault();
    console.log("Log out clicked");

    if (await logoutUser()){
        window.location.href = 'login.html';
        console.log("search clicked");



    }
});


document.querySelector('.filter-button').addEventListener('click', async function() {
    console.log("search clicked");
    await performAdvancedRecipeSearch();
});



// Placeholder function to render recipe info to the DOM
function renderRecipeInfo(recipeInfo) {
    const recipeInfoContainer = document.getElementById('recipe-info');
    recipeInfoContainer.innerHTML = `
        <h3>${recipeInfo.Title}</h3>
        <p>Cook Time: ${recipeInfo.CookTime}</p>
        <p>Prep Time: ${recipeInfo.PrepTime}</p>
        <p>Total Calories: ${recipeInfo.TotalCalories}</p>
        <p>Ingredients: ${recipeInfo.Ingredients}</p>
        <p>Steps: ${recipeInfo.Steps}</p>
    `;
    // You might want to add more details depending on your recipe structure
}

async function performGeneralRecipeSearch() {
    const searchTerm = document.getElementById('general-search').value;
    if (!searchTerm.trim()) {
        // Fetch all recipes if search term is empty
        try {
            const recipes = await getAllRecipes(); // Assume this function fetches all recipes
            updateDOMWithRecipes(recipes);
        } catch (error) {
            console.error('Error fetching all recipes:', error);
        }
    } else {
        try {
            console.log('Search Term:', searchTerm);
            const recipes = await generalSearchRecipes(searchTerm); // Function to search recipes based on term
            updateDOMWithRecipes(recipes);
        } catch (error) {
            console.error('Error performing general search:', error);
        }
    }
}

function updateDOMWithRecipes(recipes) {
    const recipesContainer = document.querySelector('.recipe-list');

    // Clear previous results
    recipesContainer.innerHTML = '';

    // Check if recipes were found
    if (recipes.length === 0) {
        recipesContainer.innerHTML = '<p>No recipes found.</p>';
    } else {
        // Append new results to the container
        recipes.forEach(recipe => {
            const recipeDiv = document.createElement('div');
            recipeDiv.className = 'recipe';

            const recipeTitle = document.createElement('h3');
            recipeTitle.textContent = recipe.Title; // Adjust if your property names differ

            const recipeDescription = document.createElement('p');
            recipeDescription.textContent = recipe.Description; // Adjust if your property names differ

            recipeDiv.addEventListener('click', function() {
                const selectedRecipeId = recipe.RecipeID; // Assuming 'RecipeID' is the attribute from your database
                loadRecipeInfo(selectedRecipeId); // This function should handle loading the detailed info for the selected recipe
            });

            recipeDiv.appendChild(recipeTitle);
            recipeDiv.appendChild(recipeDescription);

            recipesContainer.appendChild(recipeDiv);
        });
    }
}




async function loadRecipes() {
    try {
        const recipes = await getAllRecipes(); // This function should fetch all recipes
        const recipeListContainer = document.querySelector('.recipe-list');
        recipeListContainer.innerHTML = ''; // Clear existing content

        recipes.forEach(recipe => {
            const recipeElement = document.createElement('div');
            recipeElement.className = 'recipe';

            const recipeTitle = document.createElement('h3');
            recipeTitle.textContent = recipe.Title; // Assuming 'Title' is the attribute from your database

            const recipeDescription = document.createElement('p');
            recipeDescription.textContent = recipe.Description; // Assuming 'Description' is the attribute

            // Append title and description to the recipe element
            recipeElement.appendChild(recipeTitle);
            recipeElement.appendChild(recipeDescription);

            // Add click event listener to each recipe element
            recipeElement.addEventListener('click', function() {
                const selectedRecipeId = recipe.RecipeID; // Assuming 'RecipeID' is the attribute from your database
                loadRecipeInfo(selectedRecipeId); // This function should handle loading the detailed info for the selected recipe
            });

            // Append the recipe element to the container
            recipeListContainer.appendChild(recipeElement);
        });
    } catch (error) {
        console.error('Failed to load recipes:', error);
    }
}


async function loadFriends() {
    try {
        const friends = await showFriends();
        const friendsListContainer = document.querySelector('.friend-list');
        friendsListContainer.innerHTML = '';
        friends.forEach(friend => {
            const friendElement = document.createElement('div');
            friendElement.className = 'friend';
            friendElement.textContent = `${friend.FirstName} ${friend.LastName}`;
            friendsListContainer.appendChild(friendElement);
        });
    } catch (error) {
        console.error('Failed to load friends:', error);
    }
}

async function loadRecipeInfo(recipeId) {
    try {
        const recipeInfo = await getSelectedRecipeInfo(recipeId); // Make sure this function is defined and returns the recipe data
        const recipeInfoContainer = document.querySelector('.recipe-info-wall'); // Adjust the selector to target where you want to load the recipe info

        // Clear out any existing content in the recipe info container
        recipeInfoContainer.innerHTML = '';

        // Create and append the recipe title
        const recipeTitle = document.createElement('h3');
        recipeTitle.textContent = recipeInfo.Title; // Assuming recipeInfo contains a Title property
        recipeInfoContainer.appendChild(recipeTitle);

        // Add more elements for the rest of the recipe information like cook time, prep time, etc.
        // Example for Cook Time:
        const cookTime = document.createElement('p');
        cookTime.textContent = `Cook Time: ${recipeInfo.CookTime}`;
        recipeInfoContainer.appendChild(cookTime);

        // Continue adding other elements from recipeInfo...
    } catch (error) {
        console.error('Failed to load recipe info:', error);
    }
}


async function loadWall() {
    try {
        const reviews = await getUserFriendReviews();
        const reviewWallContainer = document.getElementById('tab-wall');
        reviewWallContainer.innerHTML = '';

        reviews.forEach(review => {
            const reviewElement = document.createElement('p');
            reviewElement.textContent = review.text;
            reviewWallContainer.appendChild(reviewElement);
        });

    } catch (error) {
        console.error('Failed to load wall:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadFriends();
    loadRecipes();

    const tabs = document.querySelectorAll('.tab-link');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');

            tabs.forEach(tab => tab.classList.remove('current'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('current'));

            this.classList.add('current');
            document.getElementById(tabId).classList.add('current');

            if (tabId === 'tab-wall') {
                loadWall();
            }
        });
    });
});