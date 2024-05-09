import axios from 'axios';

export async function getUserById(userId) {
    try {
        const response = await axios.get(`http://localhost:3002/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('There was a problem fetching the user data:', error);
    }
}

export async function deleteUser(useridToDelete) {
    try {
        const response = await axios.delete(`http://localhost:3002/users/${useridToDelete}`);

    } catch (error) {
        console.error('There was a problem trying to delete a user', error);
    }
}

export async function deleteRecipe(recipeID) {
    try {
        const response = await axios.delete(`http://localhost:3002/recipe/${recipeID}`);

    } catch (error) {
        console.error('There was a problem trying to delete a recipe', error);
    }
}

export async function showAllUser() {
    try {
        const response = await axios.get('http://localhost:3002/users');
        return response.data;
    } catch (error) {
        console.error('There was a problem with your axios operation:', error);
    }
}

export async function totalLikes(recipeId) {
    try {
        const response = await axios.get(`http://localhost:3002/totalLikes/${recipeId}`);
        return response.data;
    } catch (error) {
        console.error('There was a problem with your axios operation: grabbing total likes', error);
    }
}


export async function loginUser(email, password) {
   
    const uid = getUserIdFromCookie();

    try {
       
        const response = await axios.post('http://localhost:3002/login', {
            email,
            password,
            uid
        });

       
        if (response.data.status === 'Logged in') {
            document.cookie = `userID=${response.data.userID}; path=/`;
            return response.data.userID;
        } else {
            return null;
        }
    } catch (error) {
        console.error('There was an error trying to log in:', error);
        return null;
    }
}


export async function logoutUser(email, password) {
    try {

        document.cookie = "userID=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";

        return true;
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
            return false;
        }
    } catch (error) {
        console.error('Error adding user: ', error);
        return false;
    }
}



export async function updateUserById(userId, userData) {
    try {
        const response = await axios.put(`http://localhost:3002/users/${userId}`, userData);

       
        if(response.status === 200){
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
    for(let i = 0; i < cookieArray.length; i++){
        let cookiePair = cookieArray[i].split('=');

        if(cookiePair[0] === 'userID'){
           
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

export async function getUserNameById(uID) {
    try {
        const response = await axios.get(`http://localhost:3002/users/${uID}`);

        return response.data.FirstName + ' ' + response.data.LastName;
    } catch (error) {
        console.error('Failed to get user name:', error);
    }
}

export async function getSelectedRecipeInfo(recipeID) {
    try {
        const response = await axios.get(`http://localhost:3002/recipe/${recipeID}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to get selected recipe info: ${error}`);
    }
}

export async function getRecipeAuthor(recipeID) {
    try {
        const response = await axios.get(`http://localhost:3002/getRecipeAuthor/${recipeID}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to get selected recipe author: ${error}`);
    }
}

export async function getUserFriendReviews(userID) {
    try {
        const response = await axios.get(`http://localhost:3002/user/friendReviews/${userID}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to get user friend reviews: ${error}`);
    }
}

export async function getAllRecipes() {
    try {
        const response = await axios.get('http://localhost:3002/recipe');
        return response.data;
    } catch (error) {
        console.error('Failed to get all recipes:', error);
    }
}


export async function getRecipesByUser(userId) {
    try {
        const response = await axios.get(`http://localhost:3002/userRecipes/${userId}`);
        return response.data;
    } catch (error) {
        console.error('There was a problem fetching the user upload data:', error);
    }
}


export async function getAllReviewsByUser(userId) {
    try {
        const response = await axios.get(`http://localhost:3002/users/${userId}/reviews`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch reviews by user:', error);
    }
}


export async function getAllRecipesUploadedByUser(userId) {
    try {
        const response = await axios.get(`http://localhost:3002/users/${userId}/recipes`);
        return response.data;
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


export async function getFollowers(userId) {
    try {
        const response = await axios.get(`http://localhost:3002/users/${userId}/followers`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch followers:', error);
        return [];
    }
}

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
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error following user:', error);
        return false;
    }
}

export async function unfollowUser(userId, friendId) {
    try {
       
        userId = parseInt(userId, 10);
        friendId = parseInt(friendId, 10);

       
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
        return response.data;
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

export async function getMyList(userId) {
    try {
        const response = await axios.get(`http://localhost:3002/users/customListRecipes/${userId}`);
        return response.data;
    } catch (error) {
        console.error('There was a problem with your axios operation: grabbing user recipe list', error);
    }
}