import './mainpage.css';
import {
    getUserIdFromCookie,
    logoutUser,
    showAllUser,
    showFriends,
    getAllRecipes,
    getSelectedRecipeInfo,
    getUserFriendReviews
} from './controller';

let selectedRecipeId = null;

console.log(getUserIdFromCookie());

document.getElementById('logoutButton').addEventListener('click', async function (event) {
    event.preventDefault();
    console.log("Log out clicked");

    if (await logoutUser()){
        window.location.href = 'login.html';
    }
});

async function loadRecipes() {
    try {
        const recipes = await getAllRecipes();
        const recipeListContainer = document.querySelector('.recipe-list');
        recipeListContainer.innerHTML = '';

        recipes.forEach(recipe => {
            const recipeElement = document.createElement('div');
            recipeElement.className = 'recipe';
            recipeElement.textContent = recipe.title;
            recipeElement.dataset.id = recipe.id;

            recipeElement.addEventListener('click', function() {
                selectedRecipeId = this.dataset.id;
                loadRecipeInfo(selectedRecipeId);
            });

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
        const recipeInfo = await getSelectedRecipeInfo(recipeId);
        const recipeInfoContainer = document.getElementById('tab-recipe-info');
        recipeInfoContainer.innerHTML = '';

        const recipeTitle = document.createElement('h3');
        recipeTitle.textContent = recipeInfo.title;
        recipeInfoContainer.appendChild(recipeTitle);

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