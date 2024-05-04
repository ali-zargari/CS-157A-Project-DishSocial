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
    userUploadRecipe,
    getRecipesByUser,
    deleteRecipe
} from './controller';
import axios from "axios";

let selectedRecipeId = null;
let lastSearchTerm = '';
let lastFilter = '';



document.getElementById('logoutButton').addEventListener('click', async function (event) {
    event.preventDefault();

    if (await logoutUser()){
        window.location.href = 'login.html';

    }
});

document.getElementById('profileButton').addEventListener('click', function (event) {
    event.preventDefault();
    window.location.href = 'settings.html';
});


document.querySelector('.filter-button').addEventListener('click', async function() {
    await performAdvancedRecipeSearch();
});



async function loadRecipes() {
    try {
        const currentUserId = getUserIdFromCookie();
        // fetch the uploaded recipes by the current User from the database
        const userUploadedRecipes = await getRecipesByUser(currentUserId);
        const recipes = await getAllRecipes();
        const recipeListContainer = document.querySelector('.recipe-list');
        recipeListContainer.innerHTML = '';

        recipes.forEach(recipe => {
            const recipeElement = document.createElement('div');
            recipeElement.className = 'recipe';

            const recipeTitle = document.createElement('h3');
            recipeTitle.textContent = recipe.Title;

            const recipeIngredients = recipe.Ingredients ? `<p>${recipe.Ingredients}</p>` : '';

            const isUploadedByCurrentUser = userUploadedRecipes.includes(recipe.RecipeID);
            recipeElement.innerHTML = `
                <h3>${recipe.Title}</h3>
                ${recipeIngredients}
            `;

            if (isUploadedByCurrentUser) {
                const deleteButton = document.createElement('button');
                deleteButton.innerText = 'Delete';
                deleteButton.addEventListener('click', async (event) => {
                    event.stopPropagation();
                    await deleteRecipe(recipe.RecipeID);
                    await performAdvancedRecipeSearch(lastSearchTerm, lastFilter); // <-- Here! Call the search function
                })
                recipeElement.appendChild(deleteButton);
            }

            recipeElement.addEventListener('click', function() {
                selectedRecipeId = recipe.RecipeID;
                loadRecipeInfo(selectedRecipeId);
            });

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
            friendElement.style.display = "flex";
            friendElement.style.justifyContent = "space-between";
            friendElement.style.alignItems = "center";    // Centre align items vertically

            const friendText = document.createTextNode(`${friend.FirstName} ${friend.LastName}`);
            friendElement.appendChild(friendText);

            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';

            // Create Delete button for each friend
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.style.backgroundColor = 'red';
            deleteButton.style.color = 'white';
            deleteButton.style.border = 'none';
            deleteButton.style.padding = '5px 10px';
            deleteButton.style.marginLeft = '10px';
            deleteButton.style.cursor = 'pointer';
            deleteButton.style.fontSize = '0.8em';
            deleteButton.addEventListener('click', () => {
                // Delete friend code here
                console.log(`Deleting friend: ${friend.FirstName} ${friend.LastName}`);
            });
            buttonContainer.appendChild(deleteButton);

            // Create Profile button for each friend
            const profileButton = document.createElement('button');
            profileButton.textContent = 'Profile';
            profileButton.style.backgroundColor = 'green';
            profileButton.style.color = 'white';
            profileButton.style.border = 'none';
            profileButton.style.padding = '5px 10px';
            profileButton.style.marginLeft = '10px';
            profileButton.style.cursor = 'pointer';
            profileButton.style.fontSize = '0.8em';
            profileButton.addEventListener('click', () => {
                // On click, navigate to user.html
                window.location.href = `user.html?userID=${friend.UserID}`;
            });
            buttonContainer.appendChild(profileButton);

            friendElement.appendChild(buttonContainer);
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
        const reviewFormSection = document.querySelector('.review-form-section');

        // Clear out any existing content in the recipe info container
        recipeInfoContainer.innerHTML = '';

        // Assuming that recipeInfo will be null or undefined if no recipe is found
        if (recipeInfo) {
            reviewFormSection.style.display = 'flex';
        }

        // Create and append the recipe title
        const recipeTitle = document.createElement('h3');
        recipeTitle.textContent = recipeInfo.Title;
        recipeInfoContainer.appendChild(recipeTitle);

        // Add more elements for the rest of the recipe information like cook time, prep time, etc.
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

        // Create and append 'Add to Custom List' button
        let isInList = await checkRecipeInList(recipeId);
        const addButton = document.createElement('button');
        addButton.textContent = isInList ? "Remove from MyList" : "Add to MyList";


        // Create container div for buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex'; // Use flexbox to arrange buttons horizontally
        buttonContainer.style.marginTop = '10px'; // Add some top margin to separate buttons from recipe info


        // Set button color based on whether the recipe is in the user's list or not
        addButton.style.backgroundColor = isInList ? "#dc3545" : "#007bff";

        addButton.addEventListener('click', async function() {
            if(isInList) {
                await removeFromCustomList(recipeId);
            } else {
                await sendRecipeToCustomList(recipeId);
            }

            // Update isInList and button text
            isInList = await checkRecipeInList(recipeId);
            addButton.textContent = isInList ? "Remove from MyList" : "Add to MyList";

            // Update button color based on the updated isInList value
            addButton.style.backgroundColor = isInList ? "#dc3545" : "#007bff";
        });


        // Create and append 'Like' button
        let isLiked = await checkIfRecipeIsLiked(recipeId); // This function needs to be defined to check the like status
        const likeButton = document.createElement('button');
        likeButton.textContent = isLiked ? "Unlike" : "Like";
        likeButton.style.backgroundColor = isLiked ? "#dc3545" : "#007bff"; // Red for unlike, green for like
        likeButton.style.color = 'white';
        likeButton.style.marginTop = '10px'; // Extra styling to match the existing buttons

        likeButton.addEventListener('click', async function() {
            if (isLiked) {
                await unlikeRecipe(recipeId); // This function needs to be defined to handle unliking the recipe
            } else {
                await likeRecipe(recipeId); // This function needs to be defined to handle liking the recipe
            }

            // Toggle the like state and update the button text and color
            isLiked = !isLiked;
            likeButton.textContent = isLiked ? "Unlike" : "Like";
            likeButton.style.backgroundColor = isLiked ? "#dc3545" : "#007bff";
        });

        buttonContainer.appendChild(likeButton);

        buttonContainer.appendChild(addButton);

        recipeInfoContainer.appendChild(buttonContainer);

        reviewFormSection.style.display = 'block';
    } catch (error) {
        console.error('Failed to load recipe info:', error);
        const reviewFormSection = document.querySelector('.review-form-section');
    }

    // Fetch reviews for the recipe
    await fetchAndDisplayReviews(recipeId);
}





async function sendRecipeToCustomList(recipeId) {
    try {
        const userId = getUserIdFromCookie();
        await axios.post('http://localhost:3002/addToCustomList', { userId, recipeId });
    }
    catch (error) {
        console.error('Failed to add recipe to a custom list:', error);
    }
}

async function removeFromCustomList(recipeId) {
    try {
        const userId = getUserIdFromCookie();
        const response = await axios.delete('http://localhost:3002/removeFromCustomList', { data: { userId, recipeId } });

        if (response.status === 200) {
            console.log('Recipe removed from custom list:');
        } else {
            throw new Error('Remove operation failed');
        }
    }
    catch (error) {
        console.error('Failed to remove recipe from custom list:', error);
    }
}

async function checkRecipeInList(recipeId) {
    try {
        const response = await axios.get(`http://localhost:3002/isInCustomList`, {
            params: {
                userId: getUserIdFromCookie(),
                recipeId: recipeId
            }
        });

        return response.status === 200; // If status is 200, return true. The recipe is in the list.
    } catch (error) {
        console.error(`Error in checkRecipeInList: ${error.message}`);
        if (error.response && error.response.status === 404) {
            console.error('Endpoint not found. Check if server is running and endpoint URL is correct.');
        }
        return false; // If the status is not 200 or an error occurred, return false. The recipe is not in the list.
    }
}


async function fetchAndDisplayReviews(recipeId) {
    try {
        const response = await axios.get(`http://localhost:3002/reviews/${recipeId}`);
        const reviews = response.data;


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
            reviewContainer.className = 'review-container';

            const reviewFriend = document.createElement('p');
            reviewFriend.textContent = `${review.FriendName}`;
            reviewFriend.className = 'review-friend';
            reviewContainer.appendChild(reviewFriend);

            const reviewRecipe = document.createElement('p');
            reviewRecipe.textContent = `Reviewed \'${review.Title}\'`;
            reviewRecipe.className = 'review-recipe';
            reviewContainer.appendChild(reviewRecipe);

            const reviewText = document.createElement('p');
            reviewText.textContent = `Review: \"${review.ReviewText}\"`;
            reviewText.className = 'review-text';
            reviewContainer.appendChild(reviewText);

            const reviewDate = document.createElement('p');
            reviewDate.textContent = `Date: ${review.PublishDate}`;
            reviewDate.className = 'review-date';
            reviewContainer.appendChild(reviewDate);

            const reviewRating = document.createElement('div'); // Changed to div for better styling control
            reviewRating.textContent = `${review.Rating} Stars`;
            reviewRating.className = 'review-rating';
            reviewContainer.appendChild(reviewRating);



            reviewContainer.addEventListener('click', function() {
                loadRecipeInfo(review.RecipeID);
            });

            reviewWallContainer.appendChild(reviewContainer);
        });
    } catch (error) {
        console.error('Failed to load wall:', error);
    }
}


document.addEventListener('DOMContentLoaded', async function() {
    const userId = getUserIdFromCookie();
    const userName = await getUserNameById(userId);
    const headerH1Element = document.querySelector('header #greeting');
    if (headerH1Element){
        headerH1Element.textContent = `Welcome, ${userName}!`;
        headerH1Element.style.fontSize = '1.5em';
        headerH1Element.style.textAlign = 'center';
    }
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
    lastSearchTerm = searchTerm; // <-- Save the last search term

    const filter = document.getElementById('recipeFilter').value;
    lastFilter = filter; // <-- Save the last filter

    const userID = getUserIdFromCookie(); // This function needs to be defined to get the user ID from cookie

    try {
        const response = await axios.get(`http://localhost:3002/recipes/search`, {
            params: {
                searchTerm: searchTerm,
                filter: filter,
                userID: userID
            }
        });

        // Fetch the uploaded recipes by the current User from the database
        const userUploadedRecipes = await getRecipesByUser(userID);  // <-- NEW

        // Clear the current recipe list
        const recipeListContainer = document.querySelector('.recipe-list');
        recipeListContainer.innerHTML = '';

        // Populate with new results
        response.data.forEach(recipe => {
            const recipeElement = document.createElement('div');
            recipeElement.className = 'recipe';

            // Check if this recipe was uploaded by the current user
            const isUploadedByCurrentUser = userUploadedRecipes.includes(recipe.RecipeID); // <-- NEW

            recipeElement.innerHTML = `
                <h3>${recipe.Title}</h3>
                <p>${recipe.Ingredients}</p>
            `;

            // Add a delete button if uploaded by current user
            if (isUploadedByCurrentUser) {  // <-- NEW
                const deleteButton = document.createElement('button');
                deleteButton.innerText = 'Delete';
                deleteButton.addEventListener('click', async (event) => {
                    event.stopPropagation();
                    await deleteRecipe(recipe.RecipeID);
                    await performAdvancedRecipeSearch(lastSearchTerm, lastFilter); // <-- Here! Call the search function
                })
                recipeElement.appendChild(deleteButton);
            }

            // Add click event listener to each recipe element
            recipeElement.addEventListener('click', function () {
                const selectedRecipeId = recipe.RecipeID; // Assuming 'RecipeID' is the attribute from your database
                loadRecipeInfo(selectedRecipeId); // This function should handle loading the detailed info for the selected recipe

            });

            // Append the new element to the container
            recipeListContainer.appendChild(recipeElement);
        });

        // If no recipes found, display a message
        if (response.data.length === 0) {
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

    console.log("Selected: ", reviewText)

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
    reviewsList.appendChild(reviewItem);
}


// Function to handle the upload form submission
async function uploadRecipe(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Gather the form data
    const title = document.getElementById('title').value;
    const ingredients = document.getElementById('ingredients').value;
    const totalCalories = document.getElementById('totalCalories').value;
    const cookingSteps = document.getElementById('cookingSteps').value;

    // Put the form data into an object
    const recipeData = {
        Title: title,
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

        await loadRecipes();
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


async function checkIfRecipeIsLiked(recipeId) {
    try {
        const userId = getUserIdFromCookie();
        const response = await axios.get(`http://localhost:3002/recipes/liked`, {
            params: { userId, recipeId }
        });
        return response.status === 200;  // Assumes 200 means it's liked, adjust based on your API
    } catch (error) {
        console.error(`Error in checkIfRecipeIsLiked: ${error.message}`);
        return false; // Return false if there's an error or the recipe is not liked
    }
}


async function likeRecipe(recipeId) {
    try {
        // Retrieve the userId from cookies and ensure it's a digit
        let userId = getUserIdFromCookie();
        // Convert both userId and recipeId to integers
        userId = parseInt(userId, 10);
        recipeId = parseInt(recipeId, 10);

        console.log(
            `Liking recipe with ID ${recipeId} for user with ID ${userId}`
        )

        // Check if either conversion results in NaN, indicating invalid input
        if (isNaN(userId) || isNaN(recipeId)) {
            console.error('User ID or Recipe ID is not a valid number');
            return false;
        }

        const response = await axios.post('http://localhost:3002/recipes/like', {
            userId, recipeId
        });

        return response.status === 201; // Assuming 201 means created/successful
    } catch (error) {
        console.error('Failed to like recipe:', error);
        return false;
    }
}



async function unlikeRecipe(recipeId) {
    try {
        const userId = getUserIdFromCookie();
        const response = await axios.delete(`http://localhost:3002/recipes/unlike`, {
            data: { userId, recipeId }
        });
        return response.status === 200; // Assuming 200 means successful deletion
    } catch (error) {
        console.error('Failed to unlike recipe:', error);
        return false;
    }
}
