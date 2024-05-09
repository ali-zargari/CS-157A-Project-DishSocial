import './user.css'
import {getAllRecipesUploadedByUser, getAllReviewsByUser, getMyList, getUserInfoById, getSelectedRecipeInfo} from "./controller";
import { getFollowers, getFollowing } from "./controller";  // Adjust the path as necessary


function getUserIDFromQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('userID'); // Returns the userID from the URL, or null if not present
}


async function displayUserContent(userId) {
    const userReviews = await getAllReviewsByUser(userId);
    const userRecipes = await getAllRecipesUploadedByUser(userId);
    const userInfo = await getUserInfoById(userId);
    const myList= await getMyList(userId);

    console.log(myList);
    // Clear previous content
    document.querySelector('.recipe-list').innerHTML = '';
    document.querySelector('.reviews-list').innerHTML = '';
    document.querySelector('.my-list-recipes-list').innerHTML = '';

    // Update the <h1> element with the user's name
    if (userInfo) {
        document.getElementById('profileName').textContent = `Profile of ${userInfo.FirstName} ${userInfo.LastName}`;
    } else {
        document.getElementById('profileName').textContent = 'User Profile';
    }

    // Render user info
    if (userInfo) {

        document.getElementById('user-details').innerHTML = `
            <h2>User Details</h2>
            <p><strong>Name:</strong> ${userInfo.FirstName} ${userInfo.LastName}</p>
            <p><strong>Email:</strong> ${userInfo.Email}</p>
            <p><strong>Gender:</strong> ${userInfo.Gender}</p>
            <p><strong>Date of Birth:</strong> ${new Date(userInfo.DateOfBirth).toLocaleDateString()}</p>
            <p><strong>Birthplace:</strong> ${userInfo.Birthplace}</p>
            <p><strong>Age:</strong> ${userInfo.Age}</p>
        `;
    } else {
        document.getElementById('user-details').innerHTML = '<p>User details not available.</p>';
    }

    // Load recipes
    if (userRecipes.length > 0) {
        document.querySelector('.recipe-list').innerHTML = '';
        userRecipes.forEach(recipe => {
            const recipeElement = document.createElement('div');
            recipeElement.className = 'recipe-item';
            recipeElement.innerHTML = `<h3>${recipe.Title}</h3>
                                        <p><strong>Calories:</strong> ${recipe.TotalCalories}</p>
                                        <p><strong>Ingredients:</strong> ${recipe.Ingredients}</p>
                                        <p><strong>Steps:</strong> ${recipe.Steps}</p>`;
            document.querySelector('.recipe-list').appendChild(recipeElement);
        });
    } else {
        document.querySelector('.recipe-list').innerHTML = '<p>No recipes uploaded by this user.</p>';
    }

    // Load reviews
    if (userReviews.length > 0) {

        userReviews.forEach(review => {
            const reviewElement = document.createElement('div');
            reviewElement.className = 'review-item';
            reviewElement.innerHTML = `<h3>Review for: ${review.RecipeTitle}</h3>
                                       <p><strong>Date:</strong> ${new Date(review.PublishDate).toLocaleDateString()}</p>
                                       <p><strong>Rating:</strong> ${review.Rating}/5</p>
                                       <p><strong>Review:</strong> ${review.ReviewText}</p>`;
            document.querySelector('.reviews-list').appendChild(reviewElement);
        });
    } else {
        document.querySelector('.reviews-list').innerHTML = '<p>No reviews posted by this user.</p>';
    }

    if (myList.length > 0) {
        const customListContainer = document.querySelector('.my-list-recipes-list');
        myList.forEach(recipe => {
            const recipeElement = document.createElement('div');
            recipeElement.className = 'recipe-item';
            recipeElement.innerHTML = `<h3>${recipe.Title}</h3>
                                        <p><strong>Calories:</strong> ${recipe.TotalCalories}</p>
                                        <p><strong>Ingredients:</strong> ${recipe.Ingredients}</p>
                                        <p><strong>Steps:</strong> ${recipe.Steps}</p>`;
            customListContainer.appendChild(recipeElement);
        });
    } else {
        document.querySelector('.my-list-recipes-list').innerHTML = '<p>No recipes in your custom list.</p>';
    }
}


async function loadUserConnections(userId) {
    const followers = await getFollowers(userId);
    const following = await getFollowing(userId);

    const followingList = document.getElementById('following-list');
    followingList.innerHTML = following.map(user => `<div class="user-item" data-user-id="${user.UserID}">${user.FirstName} ${user.LastName}</div>`).join('');

    const followersList = document.getElementById('followers-list');
    followersList.innerHTML = followers.map(user => `<div class="user-item" data-user-id="${user.UserID}">${user.FirstName} ${user.LastName}</div>`).join('');

    // Add event listeners to user items
    const userItems = document.querySelectorAll('.user-item');
    userItems.forEach(item => {
        item.addEventListener('click', function () {
            const friendId = this.getAttribute('data-user-id');
            window.location.href = `user.html?userID=${friendId}`;
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const userId = getUserIDFromQuery();
    if (userId) {
        displayUserContent(userId);
        loadUserConnections(userId);
    } else {
        console.error("No user ID found in the query string.");
    }
});





document.addEventListener('DOMContentLoaded', function() {
    // Get the 'Main Page' button and add an event listener
    const mainPageButton = document.getElementById('mainpageButton');
    if (mainPageButton) {
        mainPageButton.addEventListener('click', function() {
            window.location.href = 'mainpage.html'; // Redirects to the main page
        });
    }

    // Get the 'Log out' button and add an event listener
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            // Implement log out functionality
            console.log('Logging out...');
            try {

                document.cookie = "userID=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
                window.location.href = 'index.html';
                return true;

            } catch (error) {
                console.error('There was an error trying to log out:', error);
                return false;
            }
        });
    }
});


