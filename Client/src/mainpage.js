import './mainpage.css';
import {
    getUserIdFromCookie,
    logoutUser,
    showAllUser,
    getAllRecipes,
    getSelectedRecipeInfo,
    getUserFriendReviews,
    getUserNameById,
    getRecipesByUser,
    deleteRecipe,
    getReviewsByUser,
    deleteReview,
    followUser,
    unfollowUser,
    getRecipeAuthor
} from './controller';
import axios from "axios";

let selectedRecipeId = null;
let lastSearchTerm = '';
let lastFilter = '';



document.getElementById('logoutButton').addEventListener('click', async function (event) {
    event.preventDefault();

    if (await logoutUser()){
        window.location.href = 'index.html';

    }
});

document.getElementById('profileButton').addEventListener('click', function (event) {
    event.preventDefault();

    const userID = getUserIdFromCookie();

    // If userID is found, pass it as a query parameter to the settings page
    if (userID !== null) {
        window.location.href = `settings.html?userID=${encodeURIComponent(userID)}`;
    } else {
        // Handle the scenario where no userID is present
        window.location.href = 'settings.html';
    }
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


let friendsSet = new Set();

// Fetch all users and the initial friends list
async function loadAllUsers() {
    try {
        let searchTerm = document.getElementById('all-users-search').value.trim().toLowerCase();
        searchTerm = sanitizeSearchTerm(searchTerm);

        // Fetch users and friends list
        const [users, friends] = await Promise.all([showAllUser(), showFriends()]);
        const usersListContainer = document.querySelector('.All-list');
        const currentUser = getUserIdFromCookie();
        usersListContainer.innerHTML = '';

        // Initialize friends set for quick lookup
        friendsSet = new Set(friends.map(friend => friend.UserID));

        for (const user of users) {
            if (user.UserID === currentUser) continue;

            const userName = `${user.FirstName} ${user.LastName}`.toLowerCase();
            if (searchTerm && !userName.includes(searchTerm)) continue;

            const userElement = document.createElement('div');
            userElement.className = 'user';
            userElement.style.display = "flex";
            userElement.style.justifyContent = "space-between";
            userElement.style.alignItems = "center";

            const userText = document.createTextNode(`${user.FirstName} ${user.LastName}`);
            userElement.appendChild(userText);

            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';

            // Determine if the user is already followed
            const isCurrentlyFollowed = friendsSet.has(user.UserID);
            const followButton = createButton(
                isCurrentlyFollowed ? 'Unfollow' : 'Follow',
                isCurrentlyFollowed ? 'red' : 'green'
            );

            followButton.addEventListener('click', async () => {
                const isFollowed = friendsSet.has(user.UserID);

                try {
                    if (isFollowed) {
                        // Unfollow logic
                        const success = await unfollowUser(currentUser, user.UserID);
                        if (success) {
                            followButton.textContent = 'Follow';
                            followButton.style.backgroundColor = 'green';
                            friendsSet.delete(user.UserID); // Remove from the friends set
                        }
                    } else {
                        // Follow logic
                        const success = await followUser(currentUser, user.UserID);
                        if (success) {
                            followButton.textContent = 'Unfollow';
                            followButton.style.backgroundColor = 'red';
                            friendsSet.add(user.UserID); // Add to the friends set
                        }
                    }
                    await loadWall(); // Optionally refresh the wall
                    await loadFriends(); // Refresh the friends list

                } catch (error) {
                    console.error(`Error updating follow status: ${error.message}`);
                    followButton.textContent = 'Error';
                    followButton.style.backgroundColor = 'gray';
                }
            });

            const profileButton = createButton('Profile', 'green');
            profileButton.addEventListener('click', () => {
                window.location.href = `user.html?userID=${user.UserID}`;
            });

            buttonContainer.appendChild(followButton);
            buttonContainer.appendChild(profileButton);
            userElement.appendChild(buttonContainer);
            usersListContainer.appendChild(userElement);
        }
    } catch (error) {
        console.error('Failed to load all users:', error);
    }
}




function createButton(text, backgroundColor) {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.backgroundColor = backgroundColor;
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.padding = '5px 10px';
    button.style.marginLeft = '10px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '0.8em';
    return button;
}


function sanitizeSearchTerm(term) {
    // Remove all non-alphanumeric characters except spaces
    return term.replace(/[^a-zA-Z0-9\s]/g, '').trim().toLowerCase();
}

async function loadFriends() {
    try {
        // Get search term and sanitize it
        let searchTerm = document.getElementById('friends-search').value;
        searchTerm = sanitizeSearchTerm(searchTerm);

        const friends = await showFriends();
        const friendsListContainer = document.querySelector('.friend-list');
        friendsListContainer.innerHTML = '';

        for (let i = 0; i < friends.length; i++) {
            const friend = friends[i];

            const friendName = `${friend.FirstName} ${friend.LastName}`.toLowerCase();
            // Skip this friend if the search term does not match or if it's empty
            if (searchTerm && !friendName.includes(searchTerm)) {
                return; // Skip this iteration
            }


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
            const deleteButton = createButton('Unfollow', 'red');
            deleteButton.addEventListener('click', async function(){
                // Delete friend code here


                try {
                    const success = await unfollowUser(getUserIdFromCookie(), friend.UserID); // Replace with your actual delete function
                    if (success) {
                        await loadFriends(); // Reload the friends list after deletion
                        await loadWall();
                        await loadAllUsers();
                    } else {
                        deleteButton.textContent = 'Error';
                        deleteButton.style.backgroundColor = 'gray';
                    }
                } catch (error) {
                    console.error(`Error deleting friend: ${error.message}`);
                    deleteButton.textContent = 'Error';
                    deleteButton.style.backgroundColor = 'gray';
                }

            });
            buttonContainer.appendChild(deleteButton);

            // Create Profile button for each friend
            const profileButton = createButton('Profile', 'green');
            profileButton.addEventListener('click', () => {
                // On click, navigate to user.html
                window.location.href = `user.html?userID=${friend.UserID}`;
            });
            buttonContainer.appendChild(profileButton);

            friendElement.appendChild(buttonContainer);
            friendsListContainer.appendChild(friendElement);
        }
    } catch (error) {
        console.error('Failed to load friends:', error);
    }
}




async function loadRecipeInfo(recipeId) {
    try {
        const recipeInfo = await getSelectedRecipeInfo(recipeId);
        const recipeInfoContainer = document.querySelector('.recipe-description');
        const reviewFormSection = document.querySelector('.review-form-section');
        console.log("loadRecipeInfo");
        console.log(recipeId);
        const recipeAuthor = await getRecipeAuthor(recipeId);

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

        const steps = document.createElement('p');
        steps.textContent = `Steps: ${recipeInfo.Steps}`;
        recipeInfoContainer.appendChild(steps);

        const totalCalories = document.createElement('p');
        totalCalories.textContent = `Total Calories: ${recipeInfo.TotalCalories}`;
        recipeInfoContainer.appendChild(totalCalories);

        const ingredients = document.createElement('p');
        ingredients.textContent = `Ingredients: ${recipeInfo.Ingredients}`;
        recipeInfoContainer.appendChild(ingredients);

        const author = document.createElement('p');
        if(recipeAuthor === 0 ){
            author.textContent = 'Author: DishSocial';
        }else{
            const authorName = await getUserNameById(recipeAuthor.UserID);
            console.log("recipeAuthor.UserID: ");
            console.log(recipeAuthor.UserID);
            console.log("authorName");
            console.log(authorName);

            author.textContent = `Author: ${authorName}`;
        }
        recipeInfoContainer.appendChild(author);

        // Create and append 'Add to Custom List' button
        let isInList = await checkRecipeInList(recipeId);
        const addButton = document.createElement('button');
        addButton.textContent = isInList ? "Remove from MyList" : "Add to MyList";


        // Create container div for buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex'; // Use flexbox to arrange buttons horizontally
        buttonContainer.style.marginTop = '10px'; // Add some top margin to separate buttons from recipe info
        buttonContainer.id = 'laButtons';

        // Set button color based on whether the recipe is in the user's list or not
        addButton.style.backgroundColor = isInList ? "#dc3545" : "#007bff";
        addButton.id = 'addButton';
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
        await axios.post('https://ai-council-419503.wl.r.appspot.com/addToCustomList', { userId, recipeId });
    }
    catch (error) {
        console.error('Failed to add recipe to a custom list:', error);
    }
}

async function removeFromCustomList(recipeId) {
    try {
        const userId = getUserIdFromCookie();
        const response = await axios.delete('https://ai-council-419503.wl.r.appspot.com/removeFromCustomList', { data: { userId, recipeId } });

        if (response.status === 200) {
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
        const response = await axios.get(`https://ai-council-419503.wl.r.appspot.com/isInCustomList`, {
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
        const currentUserId = getUserIdFromCookie();
        const reviewedByUser = await getReviewsByUser(currentUserId);
        const response = await axios.get(`https://ai-council-419503.wl.r.appspot.com/reviews/${recipeId}`);
        const reviews = response.data;

        const reviewsList = document.querySelector('.reviews-list');
        reviewsList.innerHTML = ''; // Clear existing reviews before displaying the latest ones

        reviews.forEach(review => {
            // Create and append review items to the reviews list
            const reviewItem = document.createElement('div');
            const isReviewedByCurrentUser = reviewedByUser.includes(review.ReviewID);

            reviewItem.className = 'review-item';
            reviewItem.innerHTML = `
                <p class="review-text">"${review.ReviewText}"</p>
                <div class="review-details">
                    <span class="review-author">- ${review.FirstName} ${review.LastName}</span>
                    <span class="review-rating">Rating: ${review.Rating} Stars</span>
                    ${isReviewedByCurrentUser ? `
                        <button class="delete-button" data-review-id="${review.ReviewID}">
                            Delete
                        </button>
                    ` : ''}
                </div>
            `;

            reviewsList.appendChild(reviewItem);

            if(isReviewedByCurrentUser){
                const deleteButton = reviewItem.querySelector('.delete-button');
                deleteButton.addEventListener('click', async function() {
                    await deleteReview(review.ReviewID);
                    await fetchAndDisplayReviews(recipeId);
                });
            }
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

    const minCalories = document.getElementById('min-calories').value;
    const maxCalories = document.getElementById('max-calories').value;

    const userID = getUserIdFromCookie(); // This function needs to be defined to get the user ID from cookie

    try {
        const response = await axios.get(`https://ai-council-419503.wl.r.appspot.com/recipes/search`, {
            params: {
                searchTerm,
                filter,
                userID,
                minCalories: minCalories ? Number(minCalories) : undefined, // Send as undefined if empty
                maxCalories: maxCalories ? Number(maxCalories) : undefined // Send as undefined if empty
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
        const response = await axios.post('https://ai-council-419503.wl.r.appspot.com/review/addReview', postData);

        if (response.status === 201) {
            // Append the new review to the list on the page
            const newReview = response.data;
            await fetchAndDisplayReviews(selectedRecipeId);
            //addReviewToPage(newReview);

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



async function userUploadRecipe(recipeData) {
    // Retrieve the User ID from the cookie
    const uid = getUserIdFromCookie();

    // Add the User ID to the recipe data
    const fullRecipeData = { ...recipeData, uid };

    try {
        // Send the POST request with the user ID included in the data
        const response = await axios.post('https://ai-council-419503.wl.r.appspot.com/recipe/userUploadRecipe', fullRecipeData);

        // Return the created recipe object (or any other relevant response data)
        return response.data;
    } catch (error) {
        console.error('There was a problem with your axios operation: user upload recipe', error);
        return null;
    }
}



async function showFriends() {
    const uid = getUserIdFromCookie();

    try {
        const response = await axios.get('https://ai-council-419503.wl.r.appspot.com/users/friends', {
            params: { uid }
        });
        return response.data;
    } catch (error) {
        console.error('There was a problem with your axios showFriends operation:', error);
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
        const response = await axios.get(`https://ai-council-419503.wl.r.appspot.com/recipes/liked`, {
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


        // Check if either conversion results in NaN, indicating invalid input
        if (isNaN(userId) || isNaN(recipeId)) {
            console.error('User ID or Recipe ID is not a valid number');
            return false;
        }

        const response = await axios.post('https://ai-council-419503.wl.r.appspot.com/recipes/like', {
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
        const response = await axios.delete(`https://ai-council-419503.wl.r.appspot.com/recipes/unlike`, {
            data: { userId, recipeId }
        });
        return response.status === 200; // Assuming 200 means successful deletion
    } catch (error) {
        console.error('Failed to unlike recipe:', error);
        return false;
    }
}


async function checkIfFriend(userId, friendId, retries = 3, delay = 500) {
    try {
        userId = parseInt(userId, 10);
        friendId = parseInt(friendId, 10);

        if (isNaN(userId) || isNaN(friendId)) {
            console.error('User ID or Friend ID is not a valid number');
            return false;
        }

        const response = await axios.get('https://ai-council-419503.wl.r.appspot.com/followed', {
            params: { userId, friendId }
        });

        return response.data.followed;
    } catch (error) {
        if (error.response && error.response.status === 404 && retries > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
            return checkIfFriend(userId, friendId, retries - 1, delay);
        } else {
            console.error(`Error checking if user is a friend: ${error.message}`);
            return false;
        }
    }
}

document.querySelector('#all-users button').addEventListener('click', loadAllUsers);
document.querySelector('#friends button').addEventListener('click', loadAllUsers);
