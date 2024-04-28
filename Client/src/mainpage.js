import './mainpage.css';
import {
    getUserIdFromCookie,
    logoutUser,
    showAllUser,
    showFriends,
    getAllRecipes,
    getSelectedRecipeInfo,
    getUserFriendReviews,
    getUserNameById,
    userUploadRecipe
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

            // Check if the recipe includes ingredients
            const recipeIngredients = recipe.Ingredients ? `<p>${recipe.Ingredients}</p>` : '';

            // Construct the innerHTML for the recipe element including ingredients if they exist
            recipeElement.innerHTML = `
                <h3>${recipe.Title}</h3>
                ${recipeIngredients}
            `;

            // Add click event listener to each recipe element
            recipeElement.addEventListener('click', function() {
                selectedRecipeId = recipe.RecipeID; // Assuming 'RecipeID' is the attribute from your database
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
        const recipeInfo = await getSelectedRecipeInfo(recipeId);
        const recipeInfoContainer = document.querySelector('.recipe-description');
        const reviewFormSection = document.querySelector('.review-form-section'); // Select the review form section


        // Clear out any existing content in the recipe info container
        recipeInfoContainer.innerHTML = '';

        // Assuming that recipeInfo will be null or undefined if no recipe is found
        if (recipeInfo) {
            reviewFormSection.style.display = 'flex'; // Hide the review form on error
        }

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


        reviewFormSection.style.display = 'block'; // Show the review form


    } catch (error) {
        console.error('Failed to load recipe info:', error);
        const reviewFormSection = document.querySelector('.review-form-section');


    }

    // Fetch reviews for the recipe
    await fetchAndDisplayReviews(recipeId);

}

async function fetchAndDisplayReviews(recipeId) {
    try {
        const response = await axios.get(`http://localhost:3002/reviews/${recipeId}`);
        const reviews = response.data;

        console.log(reviews);

        const reviewsList = document.querySelector('.reviews-list');
        reviewsList.innerHTML = ''; // Clear existing reviews before displaying the latest ones

        reviews.forEach(review => {
            // Create and append review items to the reviews list
            const reviewItem = document.createElement('div');
            reviewItem.className = 'review-item';
            reviewItem.innerHTML = `
                <p class="review-text">"${review.ReviewText}"</p>
                <div class="review-details">
                    <span class="review-author">- ${review.FirstName} ${review.LastName}</span>
                    <span class="review-rating">Rating: ${review.Rating} Stars</span>
                </div>
            `;
            reviewsList.appendChild(reviewItem);
        });
    } catch (error) {
        console.error('Error loading reviews:', error);
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

document.addEventListener('DOMContentLoaded', async function() {

    if (selectedRecipeId) {
        await loadRecipeInfo(selectedRecipeId);
    }

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
document.getElementById('postReviewForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Get the form data
    const reviewText = document.getElementById('reviewText').value;
    const reviewRating = document.getElementById('reviewRating').value;
    const userID = getUserIdFromCookie(); // This function retrieves the current user's ID from a cookie

    if (!selectedRecipeId) {
        console.error('No recipe selected.');
        alert('Please select a recipe before submitting a review.');
        return;
    }

    try {
        const postData = {
            UserID: userID,
            RecipeID: selectedRecipeId,
            Rating: parseInt(reviewRating),
            ReviewText: reviewText
        };

        // POST the review data to the server
        const response = await axios.post('http://localhost:3002/review/addReview', postData);

        if (response.status === 201) {
            // Append the new review to the list on the page
            const newReview = response.data;
            addReviewToPage(newReview);

            // Clear the form fields
            document.getElementById('reviewText').value = '';
            document.getElementById('reviewRating').value = '1';
            alert('Review successfully added.');
        } else {
            console.error('Failed to submit review:', response.status, response.statusText);
            alert('Failed to submit review.');
        }
    } catch (error) {
        console.error('Error submitting review:', error);
        alert('Error submitting review. Check console for more details.');
    }
});

async function addReviewToPage(review) {
    const reviewsList = document.querySelector('.reviews-list');
    const reviewItem = document.createElement('div');
    const author = await getUserNameById(review.UserID);
    reviewItem.className = 'review-item';
    reviewItem.innerHTML = `
        <p class="review-text">"${review.ReviewText}"</p>
        <div class="review-details">
            <span class="review-author">- ${author}</span>
            <span class="review-rating"> ${review.Rating} Stars</span>
        </div>
    `;
    console.log(await getUserNameById())
    reviewsList.appendChild(reviewItem);
}


// Function to handle the upload form submission
async function uploadRecipe(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Gather the form data
    const title = document.getElementById('title').value;
    const cookTime = document.getElementById('cookTime').value;
    const prepTime = document.getElementById('prepTime').value;
    const ingredients = document.getElementById('ingredients').value;
    const totalCalories = document.getElementById('totalCalories').value;
    const cookingSteps = document.getElementById('cookingSteps').value;

    // Put the form data into an object
    const recipeData = {
        Title: title,
        CookTime: cookTime,
        PrepTime: prepTime,
        Ingredients: ingredients,
        TotalCalories: totalCalories,
        Steps: cookingSteps
    };

    // Call the function from your controller to make the POST request
    const newRecipe = await userUploadRecipe(recipeData);

    // If the new recipe was created successfully
    if (newRecipe) {
        // Call a function to add the new recipe to the list of recipes in the DOM
        addRecipeToDom(newRecipe);
        // Optionally clear the form
        event.target.reset();
    } else {
        // Handle the error case
        alert('Failed to upload recipe.');
    }
}

// Attach the event listener to the form
document.getElementById('uploadRecipeForm').addEventListener('submit', uploadRecipe);

// Function to add a recipe to the DOM
function addRecipeToDom(recipe) {
    const recipeListContainer = document.querySelector('.recipe-list');

    console.log("HAHAHAHAHAHAHAHA", recipe)

    // Create the new recipe element
    const recipeElement = document.createElement('div');
    recipeElement.className = 'recipe';

    recipeElement.innerHTML = `
        <h3>${recipe.Title}</h3>
        <p>${recipe.Ingredients}</p>  <!-- You might want to format the ingredients differently -->
    `;

    // Add an event listener to load the recipe details when clicked
    recipeElement.addEventListener('click', function() {
        selectedRecipeId = recipe.RecipeID;
        loadRecipeInfo(selectedRecipeId);
    });

    // Append the new recipe to the list
    recipeListContainer.appendChild(recipeElement);
}
