import './mainpage.css';
import {
    getUserIdFromCookie,
    logoutUser,
    showAllUser,
    showFriends,
    getAllRecipes,
    getSelectedRecipeInfo,
    getUserFriendReviews,
    generalSearchRecipes
} from './controller';
import axios from "axios";

let selectedRecipeId = null;

console.log("Current UserID: ");
console.log(getUserIdFromCookie());

document.getElementById('logoutButton').addEventListener('click', async function (event) {
    event.preventDefault();
    console.log("Log out clicked");

    if (await logoutUser()){
        window.location.href = 'login.html';

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
            recipeDescription.textContent = recipe.Description; // Assuming 'Description' is the attribute, no description yet

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

async function loadAllUsers() {
    try {
        const users = await showAllUser();
        const usersListContainer = document.querySelector('.All-list');
        usersListContainer.innerHTML = '';
        users.forEach(user => {
            const userElement = document.createElement('div');
            userElement.className = 'user';
            userElement.textContent = `${user.FirstName} ${user.LastName}`;
            usersListContainer.appendChild(userElement);
        });
    } catch (error) {
        console.error('Failed to load all users:', error);
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
        const prepTime = document.createElement('p');
        prepTime.textContent = `Prep Time: ${recipeInfo.PrepTime}`;
        recipeInfoContainer.appendChild(prepTime);

        const steps = document.createElement('p');
        steps.textContent = `Steps: ${recipeInfo.Steps}`;
        recipeInfoContainer.appendChild(steps);

        const totalCalories = document.createElement('p');
        totalCalories.textContent = `Total Calories: ${recipeInfo.TotalCalories}`;
        recipeInfoContainer.appendChild(totalCalories);

        const ingredients = document.createElement('p');
        ingredients.textContent = `Ingredients: ${recipeInfo.Ingredients}`;
        recipeInfoContainer.appendChild(ingredients);

    } catch (error) {
        console.error('Failed to load recipe info:', error);
    }
}


async function loadWall() {
    try {
        const reviews = await getUserFriendReviews(getUserIdFromCookie());
        const reviewWallContainer = document.querySelector('.wall-content');
        reviewWallContainer.innerHTML = '';

        reviews.forEach(review => {
            const reviewContainer = document.createElement('div');
            reviewContainer.className = 'review-container';  // Add a class for styling and interaction

            const reviewFriend = document.createElement('p');
            reviewFriend.textContent = `Friend: ${review.FriendName}`;
            reviewContainer.appendChild(reviewFriend);

            const reviewRecipe = document.createElement('p');
            reviewRecipe.textContent = `Recipe: ${review.Title}`;
            reviewContainer.appendChild(reviewRecipe);

            const reviewText = document.createElement('p');
            reviewText.textContent = `Review: ${review.ReviewText}`;
            reviewContainer.appendChild(reviewText);

            const reviewRating = document.createElement('p');
            reviewRating.textContent = `Rating: ${review.Rating}`;
            reviewContainer.appendChild(reviewRating);

            const reviewVotes = document.createElement('p');
            reviewVotes.textContent = `Votes: ${review.NumVotes}`;
            reviewContainer.appendChild(reviewVotes);

            const reviewDate = document.createElement('p');
            reviewDate.textContent = `Date: ${review.PublishDate}`;
            reviewContainer.appendChild(reviewDate);

            // Add click event listener to the review container
            reviewContainer.addEventListener('click', function() {
                loadRecipeInfo(review.RecipeID);
            });

            const lineBreak = document.createElement('br');
            reviewWallContainer.appendChild(lineBreak);

            reviewWallContainer.appendChild(reviewContainer); // Append the review container to the wall container
        });

    } catch (error) {
        console.error('Failed to load wall:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadAllUsers();
    loadFriends();
    loadRecipes();
    loadWall();
});

async function performAdvancedRecipeSearch() {
    const searchTerm = document.getElementById('general-search').value;
    const filter = document.getElementById('recipeFilter').value;
    const userID = getUserIdFromCookie(); // This function needs to be defined to get the user ID from cookie

    try {
        const response = await axios.get(`http://localhost:3002/recipes/search`, {
            params: {
                searchTerm: searchTerm,
                filter: filter,
                userID: userID
            }
        });

        // Clear the current recipe list
        const recipeListContainer = document.querySelector('.recipe-list');
        recipeListContainer.innerHTML = '';

        // Populate with new results
        response.data.forEach(recipe => {
            const recipeElement = document.createElement('div');
            recipeElement.className = 'recipe';
            recipeElement.innerHTML = `
                <h3>${recipe.Title}</h3>
                <p>${recipe.Ingredients}</p>  
            `;

            // Add click event listener to each recipe element
            recipeElement.addEventListener('click', function() {
                const selectedRecipeId = recipe.RecipeID; // Assuming 'RecipeID' is the attribute from your database
                loadRecipeInfo(selectedRecipeId); // This function should handle loading the detailed info for the selected recipe

            });

            // Append the new element to the container
            recipeListContainer.appendChild(recipeElement);
        });

        // If no recipes found, display a message
        if(response.data.length === 0) {
            recipeListContainer.innerHTML = '<p>No recipes found.</p>';
        }

    } catch (error) {
        console.error('Error performing advanced search:', error);
    }
}