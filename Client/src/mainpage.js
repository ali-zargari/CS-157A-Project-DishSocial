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
    getRecipeAuthor,
    totalLikes
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

   
    if (userID !== null) {
        window.location.href = `settings.html?userID=${encodeURIComponent(userID)}`;
    } else {
       
        window.location.href = 'settings.html';
    }
});


document.querySelector('.filter-button').addEventListener('click', async function() {
    await performAdvancedRecipeSearch();
});



async function loadRecipes() {
    try {
       
        const response = await axios.get('https://ai-council-419503.wl.r.appspot.com/recipes-with-authors');
        const recipesWithAuthors = response.data;

       
        const currentUserId = getUserIdFromCookie();
        const userUploadedRecipes = await getRecipesByUser(currentUserId);
        const uploadedRecipesSet = new Set(userUploadedRecipes);

       
        const recipeListContainer = document.querySelector('.recipe-list');
        recipeListContainer.innerHTML = '';
        const fragment = document.createDocumentFragment();

       
        for (const recipe of recipesWithAuthors) {
           
            const isUploadedByCurrentUser = uploadedRecipesSet.has(recipe.RecipeID);

           
            const recipeElement = document.createElement('div');
            recipeElement.className = 'recipe';
            recipeElement.style.display = 'flex';
            recipeElement.style.justifyContent = 'space-between';
            recipeElement.style.alignItems = 'flex-start';
            recipeElement.style.padding = '15px';
            recipeElement.style.border = '1px solid #ddd';
            recipeElement.style.borderRadius = '8px';
            recipeElement.style.marginBottom = '10px';
            recipeElement.style.cursor = 'pointer';

           
            const infoContainer = document.createElement('div');
            infoContainer.className = 'info-container';
            infoContainer.style.display = 'flex';
            infoContainer.style.flexDirection = 'row';
            infoContainer.style.justifyContent = 'space-between';
           
            infoContainer.style.flex = '0 0 75%';

           
            const titleAndIngredientsContainer = document.createElement('div');
            titleAndIngredientsContainer.className = 'title-ingredients-container';
            titleAndIngredientsContainer.style.display = 'flex';
            titleAndIngredientsContainer.style.flexDirection = 'column';
            titleAndIngredientsContainer.style.gap = '4px';

           
            const recipeTitle = document.createElement('h3');
            recipeTitle.textContent = recipe.Title;
            recipeTitle.style.margin = '0';

            const recipeIngredients = document.createElement('p');
            recipeIngredients.textContent = recipe.Ingredients || '';
            recipeIngredients.style.margin = '0';

           
            titleAndIngredientsContainer.appendChild(recipeTitle);
            titleAndIngredientsContainer.appendChild(recipeIngredients);

           
            const detailsInfoContainer = document.createElement('div');
            detailsInfoContainer.className = 'details-info-container';
            detailsInfoContainer.style.display = 'flex';
            detailsInfoContainer.style.flexDirection = 'column';
            detailsInfoContainer.style.gap = '4px';

           
            const recipeAuthor = `Author: ${recipe.AuthorName || 'Unknown'}`;
            let avgRatingText = 'N/A';
            if (recipe.AvgRating > '0' && recipe.AvgRating < '5.01') {
                avgRatingText = parseFloat(recipe.AvgRating).toFixed(1);
            }

            const avgRating = `Average Rating: ${avgRatingText}`;
            const numRatings = `${recipe.NumRatings || 0}`;
            const numReviews = `${recipe.NumReviews || 0}`;

           
            const line1Element = document.createElement('p');
            line1Element.textContent = recipeAuthor;
            line1Element.style.margin = '0';

            const line2Element = document.createElement('p');
            line2Element.textContent = avgRating;
            line2Element.style.margin = '0';

            const line3Element = document.createElement('p');
            line3Element.textContent = `${numRatings} Ratings \n ${numReviews} Reviews`;
            line3Element.style.margin = '0';


           
            detailsInfoContainer.appendChild(line1Element);
            detailsInfoContainer.appendChild(line2Element);
            detailsInfoContainer.appendChild(line3Element);

           
            infoContainer.appendChild(titleAndIngredientsContainer);
            infoContainer.appendChild(detailsInfoContainer);

           
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'button-container';
            buttonContainer.style.display = 'flex';
            buttonContainer.style.gap = '8px';

           
            if (isUploadedByCurrentUser) {
                const deleteButton = document.createElement('button');
                deleteButton.innerText = 'Delete';
                deleteButton.style.padding = '8px 15px';
                deleteButton.style.border = 'none';
                deleteButton.style.borderRadius = '5px';
                deleteButton.style.backgroundColor = '#a72828';
                deleteButton.style.color = '#fff';
                deleteButton.style.cursor = 'pointer';
                deleteButton.style.fontSize = '0.9em';
                deleteButton.style.marginLeft = '10px';
                deleteButton.addEventListener('click', async (event) => {
                    event.stopPropagation();
                    await deleteRecipe(recipe.RecipeID);
                    await loadRecipes();
                });

               
                buttonContainer.appendChild(deleteButton);
            } else {
                infoContainer.style.width = '100%';
                recipeElement.style.justifyContent = 'space-around';
            }
           
            recipeElement.addEventListener('click', () => {
                selectedRecipeId = recipe.RecipeID;
                loadRecipeInfo(selectedRecipeId);

               
                const highlightedElement = document.querySelector('.recipe-highlighted');
                if (highlightedElement) {
                    highlightedElement.classList.remove('recipe-highlighted');
                }

               
                recipeElement.classList.add('recipe-highlighted');
            });

           
            recipeElement.appendChild(infoContainer);
            recipeElement.appendChild(buttonContainer);

           
            fragment.appendChild(recipeElement);
        }

       
        recipeListContainer.appendChild(fragment);
    } catch (error) {
        console.error('Failed to load recipes:', error);
    }
}



let friendsSet = new Set();

async function loadAllUsers() {
    try {
        let searchTerm = document.getElementById('all-users-search').value.trim().toLowerCase();
        searchTerm = sanitizeSearchTerm(searchTerm);

       
        const [users, friends] = await Promise.all([showAllUser(), showFriends()]);
        const usersListContainer = document.querySelector('.All-list');
        const currentUser = getUserIdFromCookie();
        usersListContainer.innerHTML = '';

       
        friendsSet = new Set(friends.map(friend => friend.UserID));

        let currentUserElement = null;

        for (const user of users) {
            const userName = `${user.FirstName} ${user.LastName}`.toLowerCase();
            if (searchTerm && !userName.includes(searchTerm)) continue;

           
            const userElement = document.createElement('div');
            userElement.className = 'user';
            userElement.style.display = "flex";
            userElement.style.justifyContent = "space-between";
            userElement.style.alignItems = "center";
            userElement.style.padding = '10px';

           
            if (user.UserID == currentUser) {
                userElement.style.backgroundColor = '#e0f7fa';
                const meLabel = document.createElement('span');
                meLabel.textContent = "Me";
                meLabel.style.color = '#00796b';
                meLabel.style.marginLeft = '10px';
                userElement.appendChild(meLabel);
                currentUserElement = userElement;
            } else {
               
                const userText = document.createTextNode(`${user.FirstName} ${user.LastName}`);
                userElement.appendChild(userText);
            }

           
            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';

           
            const isCurrentlyFollowed = friendsSet.has(user.UserID);
            const followButton = createButton(
                isCurrentlyFollowed ? 'Unfollow' : 'Follow',
                isCurrentlyFollowed ? 'red' : 'green'
            );

            followButton.addEventListener('click', async () => {
                const isFollowed = friendsSet.has(user.UserID);

                try {
                    if (isFollowed) {
                        const success = await unfollowUser(currentUser, user.UserID);
                        if (success) {
                            followButton.textContent = 'Follow';
                            followButton.style.backgroundColor = 'green';
                            friendsSet.delete(user.UserID);
                        }
                    } else {
                        const success = await followUser(currentUser, user.UserID);
                        if (success) {
                            followButton.textContent = 'Unfollow';
                            followButton.style.backgroundColor = 'red';
                            friendsSet.add(user.UserID);
                        }
                    }

                    await loadWall();
                    await loadFriends();

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

           
            if (user.UserID !== currentUser) {
                usersListContainer.appendChild(userElement);
            }
        }

       
        if (currentUserElement) {
            usersListContainer.prepend(currentUserElement);
        }
    } catch (error) {
        console.error('Failed to load all users:', error);
    }
}

document.getElementById('friends-filter-btn').addEventListener('click', loadFriends);


async function loadFriends() {
    try {
        let searchTerm = document.getElementById('friends-search').value.trim().toLowerCase();
        searchTerm = sanitizeSearchTerm(searchTerm);

       
        const [users, friends] = await Promise.all([showAllUser(), showFriends()]);
        const friendsListContainer = document.querySelector('.friend-list');
        const currentUser = getUserIdFromCookie();
        friendsListContainer.innerHTML = '';

       
        friendsSet = new Set(friends.map(friend => friend.UserID));

        let currentUserElement = null;

        for (const friend of friends) {
            const friendName = `${friend.FirstName} ${friend.LastName}`.toLowerCase();
            if (searchTerm && !friendName.includes(searchTerm)) continue;

           
            const friendElement = document.createElement('div');
            friendElement.className = 'friend';
            friendElement.style.display = "flex";
            friendElement.style.justifyContent = "space-between";
            friendElement.style.alignItems = "center";
           

           
            if (friend.UserID == currentUser) {
                friendElement.style.backgroundColor = '#e0f7fa';
                const meLabel = document.createElement('span');
                meLabel.textContent = "Me";
                meLabel.style.color = '#00796b';
                meLabel.style.marginLeft = '10px';
                friendElement.appendChild(meLabel);
                currentUserElement = friendElement;
            } else {
               
                const friendText = document.createTextNode(`${friend.FirstName} ${friend.LastName}`);
                friendElement.appendChild(friendText);
            }

           
            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';

           
            const deleteButton = createButton('Unfollow', 'red');
            deleteButton.addEventListener('click', async () => {
                try {
                    const success = await unfollowUser(currentUser, friend.UserID);
                    if (success) {
                        await loadFriends();
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

           
            const profileButton = createButton('Profile', 'green');
            profileButton.addEventListener('click', () => {
                window.location.href = `user.html?userID=${friend.UserID}`;
            });

           
            buttonContainer.appendChild(deleteButton);
            buttonContainer.appendChild(profileButton);

           
            friendElement.appendChild(buttonContainer);

           
            if (friend.UserID !== currentUser) {
                friendsListContainer.appendChild(friendElement);
            }
        }

       
        if (currentUserElement) {
            friendsListContainer.prepend(currentUserElement);
        }
    } catch (error) {
        console.error('Failed to load friends:', error);
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
   
    return term.replace(/[^a-zA-Z0-9\s]/g, '').trim().toLowerCase();
}



async function loadRecipeInfo(recipeId) {
    try {
        const recipeInfo = await getSelectedRecipeInfo(recipeId);
        const recipeInfoContainer = document.querySelector('.recipe-description');
        const reviewFormSection = document.querySelector('.review-form-section');
        const recipeAuthor = await getRecipeAuthor(recipeId);
        const likesData = await totalLikes(recipeId);
       
        recipeInfoContainer.innerHTML = '';

       
        if (recipeInfo) {
            reviewFormSection.style.display = 'flex';
        }

       
        const recipeTitle = document.createElement('h3');
        recipeTitle.textContent = recipeInfo.Title;
        recipeInfoContainer.appendChild(recipeTitle);

       

        const steps = document.createElement('p');
        steps.textContent = `Steps: ${recipeInfo.Steps}`;
        recipeInfoContainer.appendChild(steps);

        const totalCalories = document.createElement('p');
        totalCalories.textContent = `Total Calories: ${recipeInfo.TotalCalories}`;
        recipeInfoContainer.appendChild(totalCalories);

        const ingredients = document.createElement('p');
        ingredients.textContent = `Ingredients: ${recipeInfo.Ingredients}`;
        recipeInfoContainer.appendChild(ingredients);

        const reviewCount = document.createElement('p');
        reviewCount.textContent = `Total Reviews: ${recipeInfo.ReviewCount}`;
        recipeInfoContainer.appendChild(reviewCount);

        const likes = document.createElement('p');
        likes.textContent = `Total Likes: ${likesData.totalLikes}`;
        recipeInfoContainer.appendChild(likes);

        const avgRating = document.createElement('p');
        if(recipeInfo.AverageRating != null) {
            avgRating.textContent = `Average Rating: ${recipeInfo.AverageRating}`;
        }else{
            avgRating.textContent = `Average Rating: 0`;
        }
        recipeInfoContainer.appendChild(avgRating);

        const author = document.createElement('p');
        if(recipeAuthor === 0 ){
            author.textContent = 'Author: DishSocial';
        }else{
            const authorName = await getUserNameById(recipeAuthor.UserID);

            author.textContent = `Author: ${authorName}`;
        }
        recipeInfoContainer.appendChild(author);

       
        let isInList = await checkRecipeInList(recipeId);
        const addButton = document.createElement('button');
        addButton.textContent = isInList ? "Remove from MyList" : "Add to MyList";


       
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.marginTop = '10px';
        buttonContainer.id = 'laButtons';

       
        addButton.style.backgroundColor = isInList ? "#dc3545" : "#007bff";
        addButton.id = 'addButton';
        addButton.addEventListener('click', async function() {
            if(isInList) {
                await removeFromCustomList(recipeId);
            } else {
                await sendRecipeToCustomList(recipeId);
            }

           
            isInList = await checkRecipeInList(recipeId);
            addButton.textContent = isInList ? "Remove from MyList" : "Add to MyList";

           
            addButton.style.backgroundColor = isInList ? "#dc3545" : "#007bff";
        });



       
        let isLiked = await checkIfRecipeIsLiked(recipeId);
        const likeButton = document.createElement('button');
        likeButton.textContent = isLiked ? "Unlike" : "Like";
        likeButton.style.backgroundColor = isLiked ? "#dc3545" : "#007bff";
        likeButton.style.color = 'white';
        likeButton.style.marginTop = '10px';

        likeButton.addEventListener('click', async function() {
            if (isLiked) {
                await unlikeRecipe(recipeId);
            } else {
                await likeRecipe(recipeId);
            }
           
            isLiked = !isLiked;
            likeButton.textContent = isLiked ? "Unlike" : "Like";
            likeButton.style.backgroundColor = isLiked ? "#dc3545" : "#007bff";

            await loadRecipeInfo(selectedRecipeId);
        });

        buttonContainer.appendChild(likeButton);

        buttonContainer.appendChild(addButton);

        recipeInfoContainer.appendChild(buttonContainer);

        reviewFormSection.style.display = 'block';
    } catch (error) {
        console.error('Failed to load recipe info:', error);
        const reviewFormSection = document.querySelector('.review-form-section');
    }

   
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

        return response.status === 200;
    } catch (error) {
        console.error(`Error in checkRecipeInList: ${error.message}`);
        if (error.response && error.response.status === 404) {
            console.error('Endpoint not found. Check if server is running and endpoint URL is correct.');
        }
        return false;
    }
}


async function fetchAndDisplayReviews(recipeId) {
    try {
        const currentUserId = getUserIdFromCookie();
        const reviewedByUser = await getReviewsByUser(currentUserId);
        const response = await axios.get(`https://ai-council-419503.wl.r.appspot.com/reviews/${recipeId}`);
        const reviews = response.data;

        const reviewsList = document.querySelector('.reviews-list');
        reviewsList.innerHTML = '';

        reviews.forEach(review => {
           
            const reviewItem = document.createElement('div');
            const isReviewedByCurrentUser = reviewedByUser.includes(review.ReviewID);
            let isFiveStars = false;

            if(review.Rating === 5){
                isFiveStars = true;
            }
            reviewItem.className = 'review-item';
            reviewItem.innerHTML = `
                <p class="review-text">"${review.ReviewText}"</p>
                <div class="review-details">
                    <span class="review-author">- ${review.FirstName} ${review.LastName}</span>
                    ${isFiveStars ? `
                        <span class="gold-rating">Rating: ${review.Rating} Stars</span>
                    ` : `<span class="review-rating">Rating: ${review.Rating} Stars</span>`}
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
                    await loadRecipeInfo(selectedRecipeId)
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

            const reviewRating = document.createElement('div');
            reviewRating.textContent = `${review.Rating} Stars`;
            if (review.Rating === 5) {
                reviewRating.className = 'gold-rating';
            }
            else{
                reviewRating.className = 'review-rating';
            }
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
    let searchTerm;
    let filter;
    if (arguments.length === 0) {
        searchTerm = document.getElementById('general-search').value;
        filter = document.getElementById('recipeFilter').value;
    } else {
        searchTerm = arguments[0];
        filter = arguments[1];
    }

    lastSearchTerm = searchTerm;
    lastFilter = filter;

    const minCalories = document.getElementById('min-calories').value;
    const maxCalories = document.getElementById('max-calories').value;

    const userID = getUserIdFromCookie();

    await loadRecipesWithParams({
        searchTerm,
        filter,
        userID,
        minCalories: minCalories ? Number(minCalories) : undefined,
        maxCalories: maxCalories ? Number(maxCalories) : undefined
    });
}



document.getElementById('postReviewForm').addEventListener('submit', async function (event) {
    event.preventDefault();

   
    const reviewText = document.getElementById('reviewText').value;
    const reviewRating = document.getElementById('reviewRating').value;
    const userID = getUserIdFromCookie();
    const reviewFormSection = document.querySelector('.review-form-section');

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

       
        const response = await axios.post('https://ai-council-419503.wl.r.appspot.com/review/addReview', postData);

        if (response.status === 201) {
           
            const newReview = response.data;
            await loadRecipeInfo(selectedRecipeId)
           

           
            document.getElementById('reviewText').value = '';
            document.getElementById('reviewRating').value = '1';
            alert('Review successfully added.');
            reviewFormSection.classList.remove('post-gold-rating');
        } else {
            console.error('Failed to submit review:', response.status, response.statusText);
            alert('Failed to submit review.');
        }
    } catch (error) {
        console.error('Error submitting review:', error);
        alert('Error submitting review. Check console for more details.');
    }
});



async function uploadRecipe(event) {
    event.preventDefault();

   
    const title = document.getElementById('title').value;
    const ingredients = document.getElementById('ingredients').value;
    const totalCalories = document.getElementById('totalCalories').value;
    const cookingSteps = document.getElementById('cookingSteps').value;

   
    const recipeData = {
        Title: title,
        Ingredients: ingredients,
        TotalCalories: totalCalories,
        Steps: cookingSteps
    };

   
    const newRecipe = await userUploadRecipe(recipeData);

   
    if (newRecipe) {
       
       
       
        event.target.reset();
        if(lastFilter.length !== 0 || lastSearchTerm.length !== 0){
            console.log("this is loaded");
            await performAdvancedRecipeSearch(lastSearchTerm, lastFilter);
        }
        else{
            console.log("else loaded");
            await loadRecipes();
        }
    } else {
       
        alert('Failed to upload recipe.');
    }
}



async function userUploadRecipe(recipeData) {
   
    const uid = getUserIdFromCookie();

   
    const fullRecipeData = { ...recipeData, uid };

    try {
       
        const response = await axios.post('https://ai-council-419503.wl.r.appspot.com/recipe/userUploadRecipe', fullRecipeData);

       
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


document.getElementById('uploadRecipeForm').addEventListener('submit', uploadRecipe);

function addRecipeToDom(recipe) {
    const recipeListContainer = document.querySelector('.recipe-list');


   
    const recipeElement = document.createElement('div');
    recipeElement.className = 'recipe';

    recipeElement.innerHTML = `
        <h3>${recipe.Title}</h3>
        <p>${recipe.Ingredients}</p>  <!-- You might want to format the ingredients differently -->
    `;

   
   
   
   
   

   
    recipeListContainer.appendChild(recipeElement);
}



async function checkIfRecipeIsLiked(recipeId) {
    try {
        const userId = getUserIdFromCookie();
        const response = await axios.get(`https://ai-council-419503.wl.r.appspot.com/recipes/liked`, {
            params: { userId, recipeId }
        });
        return response.status === 200; 
    } catch (error) {
        console.error(`Error in checkIfRecipeIsLiked: ${error.message}`);
        return false;
    }
}


async function likeRecipe(recipeId) {
    try {
       
        let userId = getUserIdFromCookie();
       
        userId = parseInt(userId, 10);
        recipeId = parseInt(recipeId, 10);


       
        if (isNaN(userId) || isNaN(recipeId)) {
            console.error('User ID or Recipe ID is not a valid number');
            return false;
        }

        const response = await axios.post('https://ai-council-419503.wl.r.appspot.com/recipes/like', {
            userId, recipeId
        });

        return response.status === 201;
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
        return response.status === 200;
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


document.getElementById('reviewRating').addEventListener('change', function() {
    const reviewRating = this;
    const reviewFormSection = document.querySelector('.review-form-section');

   
    if (reviewRating.value === '5') {
        reviewFormSection.classList.add('post-gold-rating');
    } else {
        reviewFormSection.classList.remove('post-gold-rating');
    }
});


async function getAllRecipesWithAuthors() {
    try {
       
        const response = await axios.get('https://ai-council-419503.wl.r.appspot.com/recipes-with-authors');

       
        return response.data;
    } catch (error) {
        console.error('Error fetching all recipes with authors:', error);
        return [];
    }
}

async function loadRecipesWithParams(params) {
    try {
       
        const response = await axios.get('https://ai-council-419503.wl.r.appspot.com/recipes-with-authors/search', {
            params: params
        });
        const recipes = response.data;

       
        const currentUserId = params.userID;
        const userUploadedRecipes = await getRecipesByUser(currentUserId);
        const uploadedRecipesSet = new Set(userUploadedRecipes);

       
        const recipeListContainer = document.querySelector('.recipe-list');
        recipeListContainer.innerHTML = '';
        const fragment = document.createDocumentFragment();

       
        for (const recipe of recipes) {
           
            const isUploadedByCurrentUser = uploadedRecipesSet.has(recipe.RecipeID);

           
            const recipeElement = document.createElement('div');
            recipeElement.className = 'recipe';
            recipeElement.style.display = 'flex';
            recipeElement.style.justifyContent = 'space-between';
            recipeElement.style.alignItems = 'flex-start';
            recipeElement.style.padding = '15px';
            recipeElement.style.border = '1px solid #ddd';
            recipeElement.style.borderRadius = '8px';
            recipeElement.style.marginBottom = '10px';
            recipeElement.style.cursor = 'pointer';

           
            const infoContainer = document.createElement('div');
            infoContainer.className = 'info-container';
            infoContainer.style.display = 'flex';
            infoContainer.style.flexDirection = 'row';
            infoContainer.style.justifyContent = 'space-between';
            infoContainer.style.flex = '0 0 75%';

           
            const titleAndIngredientsContainer = document.createElement('div');
            titleAndIngredientsContainer.className = 'title-ingredients-container';
            titleAndIngredientsContainer.style.display = 'flex';
            titleAndIngredientsContainer.style.flexDirection = 'column';
            titleAndIngredientsContainer.style.gap = '4px';

           
            const recipeTitle = document.createElement('h3');
            recipeTitle.textContent = recipe.Title;
            recipeTitle.style.margin = '0';

            const recipeIngredients = document.createElement('p');
            recipeIngredients.textContent = recipe.Ingredients || '';
            recipeIngredients.style.margin = '0';

           
            titleAndIngredientsContainer.appendChild(recipeTitle);
            titleAndIngredientsContainer.appendChild(recipeIngredients);

           
            const detailsInfoContainer = document.createElement('div');
            detailsInfoContainer.className = 'details-info-container';
            detailsInfoContainer.style.display = 'flex';
            detailsInfoContainer.style.flexDirection = 'column';
            detailsInfoContainer.style.gap = '4px';

           
            const recipeAuthor = `Author: ${recipe.AuthorName || 'Unknown'}`;
            let avgRatingText = 'N/A';
            if (recipe.AvgRating > '0' && recipe.AvgRating < '5.01') {
                avgRatingText = parseFloat(recipe.AvgRating).toFixed(1);
            }

            const avgRating = `Average Rating: ${avgRatingText}`;
            const numRatings = `${recipe.NumRatings || 0}`;
            const numReviews = `${recipe.NumReviews || 0}`;

           
            const line1Element = document.createElement('p');
            line1Element.textContent = recipeAuthor;
            line1Element.style.margin = '0';

            const line2Element = document.createElement('p');
            line2Element.textContent = avgRating;
            line2Element.style.margin = '0';

            const line3Element = document.createElement('p');
            line3Element.textContent = `${numRatings} Ratings \n ${numReviews} Reviews`;
            line3Element.style.margin = '0';

           
            detailsInfoContainer.appendChild(line1Element);
            detailsInfoContainer.appendChild(line2Element);
            detailsInfoContainer.appendChild(line3Element);

           
            infoContainer.appendChild(titleAndIngredientsContainer);
            infoContainer.appendChild(detailsInfoContainer);

           
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'button-container';
            buttonContainer.style.display = 'flex';
            buttonContainer.style.gap = '8px';

           
            if (isUploadedByCurrentUser) {
                const deleteButton = document.createElement('button');
                deleteButton.innerText = 'Delete';
                deleteButton.style.padding = '8px 15px';
                deleteButton.style.border = 'none';
                deleteButton.style.borderRadius = '5px';
                deleteButton.style.backgroundColor = '#a72828';
                deleteButton.style.color = '#fff';
                deleteButton.style.cursor = 'pointer';
                deleteButton.style.fontSize = '0.9em';
                deleteButton.style.marginLeft = '10px';
                deleteButton.addEventListener('click', async (event) => {
                    event.stopPropagation();
                    await deleteRecipe(recipe.RecipeID);

                    await loadRecipesWithParams(params);
                    if (selectedRecipeId === recipe.RecipeID){
                        const recipeInfoContainer = document.querySelector('.recipe-description');
                        const reviewFormSection = document.querySelector('.review-form-section');
                        recipeInfoContainer.innerHTML = '';
                        reviewFormSection.innerHTML = '';
                    }
                });

               
                buttonContainer.appendChild(deleteButton);
            } else {
                infoContainer.style.width = '100%';
                recipeElement.style.justifyContent = 'space-around';
            }

           
            recipeElement.addEventListener('click', () => {
                selectedRecipeId = recipe.RecipeID;
                loadRecipeInfo(selectedRecipeId);

               
                const highlightedElement = document.querySelector('.recipe-highlighted');
                if (highlightedElement) {
                    highlightedElement.classList.remove('recipe-highlighted');
                }

               
                recipeElement.classList.add('recipe-highlighted');
            });

           
            recipeElement.appendChild(infoContainer);
            recipeElement.appendChild(buttonContainer);

           
            fragment.appendChild(recipeElement);
        }

       
        recipeListContainer.appendChild(fragment);
    } catch (error) {
        console.error('Failed to load recipes with parameters:', error);
    }
}

document.querySelector('#all-users button').addEventListener('click', loadAllUsers);
document.querySelector('#friends button').addEventListener('click', loadAllUsers);
