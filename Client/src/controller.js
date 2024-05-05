import axios from 'axios';

export async function getUserById(userId) {
    try {
        const response = await axios.get(`http://localhost:3002/users/${userId}`);
        console.log(response.data); // You can also manipulate or directly return this data
        return response.data; // Returning the data for further use
    } catch (error) {
        console.error('There was a problem fetching the user data:', error);
    }
}

export async function app(useridToDelete) {
    try {
        const response = await axios.delete(`http://localhost:3002/users/${useridToDelete}`);
        console.log(response.data); // Log the response from the server

    } catch (error) {
        console.error('There was a problem trying to delete a user', error);
    }
}

export async function deleteRecipe(recipeID) {
    try {
        const response = await axios.delete(`http://localhost:3002/recipe/${recipeID}`);
        console.log(response.data); // Log the response from the server

    } catch (error) {
        console.error('There was a problem trying to delete a recipe', error);
    }
}

export async function showAllUser() {
    try {
        const response = await axios.get('http://localhost:3002/users');
        console.log("All users: ");
        console.log(response.data); // Log the response from the server
        return response.data;
    } catch (error) {
        console.error('There was a problem with your axios operation:', error);
    }
}

export async function showFriends() {
    try {
        const response = await axios.get('http://localhost:3002/users/friends', {withCredentials : true});
        console.log("All friends: ");
        console.log(response.data); // Log the response from the server
        return response.data;
    } catch (error) {
        console.error('There was a problem with your axios showFriends operation:', error);
    }
}

// export async function addRecipe(Title, CookTime, PrepTime, CookTemp, Steps, TotalCalories) {
//     try {
//         const response = await axios.post('http://localhost:3002/recipe', {
//             Title, CookTime, PrepTime, CookTemp, Steps, TotalCalories, Ingredients
//         });
//         console.log(response.data); // Log the response from the server
//
//     } catch (error) {
//         console.error('There was a problem with your axios operation: add recipe', error);
//     }
// }

// Inside your controller

export async function userUploadRecipe(recipeData) {
    try {
        const response = await axios.post('http://localhost:3002/recipe/userUploadRecipe', recipeData, { withCredentials : true });
        return response.data; // You might want to return the created recipe object
    } catch (error) {
        console.error('There was a problem with your axios operation: user upload recipe', error);
        return null;
    }
}


export async function loginUser(email, password) {
    try {
        const response = await axios.post('http://localhost:3002/login', { email, password }, { withCredentials: true });

        if (response.data.status === 'Logged in') {
            console.log('Login was successful');
            document.cookie = `userID=${response.data.userID}; path=/`; // Save the userID in a cookie
            return response.data.userID;
        } else {
            console.log('Login failed');
            return null;
        }
    } catch (error) {
        console.error('There was an error trying to log in:', error);
        return null;
    }
}

export async function logoutUser(email, password) {
    try {
        const response = await axios.post('http://localhost:3002/logout', {}, {
            withCredentials: true  // This ensures cookies are included in the request
        });

        if (response.data.status === 'Logged out') {
            console.log('You are logged out');
            document.cookie = "userID= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
            return true;
        } else {
            console.log('Logged out failed');
            return false;
        }
    } catch (error) {
        console.error('There was an error trying to log out:', error);
        return false;
    }
}

export async function addUser(FirstName, LastName, Gender, Email, Birthplace, DateOfBirth, Password) {
    try {
        const response = await axios.post('http://localhost:3002/users', {
            FirstName, LastName, Gender, Email, Birthplace, DateOfBirth, Password
        });

        if (response.data.status === 'success') {
            return true;
        } else {
            console.log('Registration failed');
            return false;
        }
    } catch (error) {
        console.error('Error adding user: ', error);
        return false;
    }
}

//add review to a recipe
export async function userReviewsRecipe(UserID, RecipeID, PublishDate, NumVotes, Rating, ReviewText) {
    try {
        const response = await axios.post('http://localhost:3002/review/addReview', {
            UserID, RecipeID, PublishDate, NumVotes, Rating, ReviewText
        });
        console.log(response.data); // Log the response from the server

    } catch (error) {
        console.error('There was a problem with your axios operation: userReviewsRecipe', error);
    }
}

//add ingredients, pass ingredients as array even if it is only one
export async function addIngredientToRecipe(RecipeID,IngredientIDs) {
    try {
        const response = await axios.post('http://localhost:3002/recipe/addIngredient', {
            RecipeID,IngredientIDs
        });
        console.log(response.data); // Log the response from the server

    } catch (error) {
        console.error('There was a problem with your axios operation: addIngredientToRecipe', error);
    }
}

export async function updateUserById(userId, userData) {
    try {
        const response = await axios.put(`http://localhost:3002/users/${userId}`, userData);

        // Check if the request was successful
        if(response.status === 200){
            console.log(`User with ID ${userId} successfully updated.`);
            return response.data;
        } else {
            console.error(`Error occurred: Status code ${response.status}`);
        }
    } catch (error) {
        console.error('There was a problem updating the user data:', error);
    }
}



export function getUserIdFromCookie() {
    let cookieArray = document.cookie.split('; ');
    console.log(cookieArray);
    console.log(document.cookie);
    for(let i = 0; i < cookieArray.length; i++){
        let cookiePair = cookieArray[i].split('=');

        if(cookiePair[0] === 'userID'){
            // Return the value of 'userID' cookie
            return cookiePair[1];
        }
    }
    return null;
}

export async function getUserInfo() {
    try {
        const userID = getUserIdFromCookie();
        if(userID === null){
            console.error('User ID not found in cookie');
            return null;
        }

        const response = await axios.get(`http://localhost:3002/users/${userID}`);
        return response.data;
    } catch (error) {
        console.error('Failed to get user info:', error);
    }
}

export async function getUserNameById() {
    try {
        const uID = getUserIdFromCookie();
        const response = await axios.get(`http://localhost:3002/users/${uID}`);

        return response.data.FirstName + ' ' + response.data.LastName;
    } catch (error) {
        console.error('Failed to get user name:', error);
    }
}

export async function getSelectedRecipeInfo(recipeID) {
    try {
        const response = await axios.get(`http://localhost:3002/recipe/${recipeID}`);
        return response.data; // Returning the data for further use
    } catch (error) {
        console.error(`Failed to get selected recipe info: ${error}`);
    }
}

export async function getUserFriendReviews(userID) {
    try {
        const response = await axios.get(`http://localhost:3002/user/friendReviews/${userID}`);
        return response.data; // Returning the data for further use
    } catch (error) {
        console.error(`Failed to get user friend reviews: ${error}`);
    }
}

// give me function to get all recipes
export async function getAllRecipes() {
    try {
        const response = await axios.get('http://localhost:3002/recipe');
        return response.data; // Returning the data for further use
    } catch (error) {
        console.error('Failed to get all recipes:', error);
    }
}

export async function generalSearchRecipes(searchTerm) {
    try {
        const response = await axios.get(`http://localhost:3002/recipes/search?term=${encodeURIComponent(searchTerm)}`);
        console.log(response.data); // Log the response from the server
        return response.data;
    } catch (error) {
        console.error('Failed to perform general search:', error);
    }
}




// Function to load the recipe info when a recipe is clicked
async function loadRecipeInfo(recipeID) {
    try {
        const response = await axios.get(`http://localhost:3002/recipe/${recipeID}`);
        const recipeInfo = response.data;

        // Assuming you have a function to render recipe info
        renderRecipeInfo(recipeInfo);
    } catch (error) {
        console.error('Failed to load recipe info:', error);
    }
}


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

export async function getRecipesByUser(userId) {
    try {
        const response = await axios.get(`http://localhost:3002/userRecipes/${userId}`);
        console.log(response.data); // Log the response; This is an array of recipe IDs
        return response.data; // Returning the array of RecipeIDs for further use
    } catch (error) {
        console.error('There was a problem fetching the user upload data:', error);
    }
}


export async function getAllReviewsByUser(userId) {
    try {
        const response = await axios.get(`http://localhost:3002/users/${userId}/reviews`);
        console.log("All reviews by user:", response.data);
        return response.data; // Return the data for further use
    } catch (error) {
        console.error('Failed to fetch reviews by user:', error);
    }
}


export async function getAllRecipesUploadedByUser(userId) {
    try {
        const response = await axios.get(`http://localhost:3002/users/${userId}/recipes`);
        console.log("All recipes uploaded by user:", response.data);
        return response.data; // Return the data for further use
    } catch (error) {
        console.error('Failed to fetch recipes uploaded by user:', error);
    }
}


export async function getUserInfoById(userId) {
    try {
        const response = await axios.get(`http://localhost:3002/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to get user info:', error);
        return null;
    }
}


// Function to get the list of users following a specific user
export async function getFollowers(userId) {
    try {
        const response = await axios.get(`http://localhost:3002/users/${userId}/followers`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch followers:', error);
        return [];
    }
}

// Function to get the list of users a specific user is following
export async function getFollowing(userId) {
    try {
        const response = await axios.get(`http://localhost:3002/users/${userId}/following`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch following:', error);
        return [];
    }
}

export async function followUser(userId, followedUserId) {
    try {
        const response = await axios.post('http://localhost:3002/users/follow', {
            userId,
            followedUserId
        });

        if (response.status === 201) {
            console.log('Successfully followed user.');
            return true;
        } else {
            console.log('Failed to follow user.');
            return false;
        }
    } catch (error) {
        console.error('Error following user:', error);
        return false;
    }
}

export async function unfollowUser(userId, friendId) {
    try {
        // Convert both userId and friendId to integers
        userId = parseInt(userId, 10);
        friendId = parseInt(friendId, 10);

        console.log(
            `User with ID ${userId} is unfollowing user with ID ${friendId}`
        );

        // Check if either conversion results in NaN, indicating invalid input
        if (isNaN(userId) || isNaN(friendId)) {

            console.error('User ID or Friend ID is not a valid number');
            return false;
        }

        const response = await axios.delete('http://localhost:3002/unfollow', {
            data: { userId, friendId }
        });

        return response.data.success;
    } catch (error) {
        console.error(`Error unfollowing user: ${error.message}`);
        return false;
    }
}

export async function getReviewsByUser(userId) {
    try {
        const response = await axios.get(`http://localhost:3002/userReviews/${userId}`);
        console.log(response.data); // Log the response; This is an array of review IDs
        return response.data; // Returning the array of ReviewIDs for further use
    } catch (error) {
        console.error('There was a problem fetching the user reviewIds:', error);
    }
}

export async function deleteReview(reviewIdToDelete) {
    try {
        const response = await axios.delete(`http://localhost:3002/review/${reviewIdToDelete}`);

    } catch (error) {
        console.error('There was a problem trying to delete a review', error);
    }
}