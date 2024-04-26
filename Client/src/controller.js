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
        console.log(response.data); // Log the response from the server

    } catch (error) {
        console.error('There was a problem with your axios operation:', error);
    }
}

export async function showFriends() {
    try {
        const response = await axios.get('http://localhost:3002/users/friends', {withCredentials : true});
        console.log(response.data); // Log the response from the server
        return response.data;
    } catch (error) {
        console.error('There was a problem with your axios showFriends operation:', error);
    }
}

export async function addRecipe(Title, CookTime, PrepTime, CookTemp, Steps, TotalCalories) {
    try {
        const response = await axios.post('http://localhost:3002/recipe', {
            Title, CookTime, PrepTime, CookTemp, Steps, TotalCalories, NumIngredients
        });
        console.log(response.data); // Log the response from the server

    } catch (error) {
        console.error('There was a problem with your axios operation: add recipe', error);
    }
}

export async function userUploadRecipe(Title, CookTime, PrepTime, CookTemp, Steps, TotalCalories, userID) {
    try {
        const NumIngredients = 0; //number of ingredients should be incremented from populating Recipe_Contains_Ingredients
        const response = await axios.post('http://localhost:3002/recipe/userUploadRecipe', {
            Title, CookTime, PrepTime, CookTemp, Steps, TotalCalories, NumIngredients, userID
        });
        console.log(response.data); // Log the response from the server

    } catch (error) {
        console.error('There was a problem with your axios operation: user upload recipe', error);
    }
}

export async function loginUser(email, password) {
    try {
        const response = await axios.post('http://localhost:3002/login', { email, password }, { withCredentials: true });
        //console.log(response.data); // Log the response from the server
        if (response.data.status === 'Logged in') {
            console.log('Login was successful');
            return true;
        } else {
            console.log('Login failed');
            return false;
        }
    } catch (error) {
        console.error('There was an error trying to log in:', error);
        return false;
    }
}

export async function logoutUser(email, password) {
    try {
        const response = await axios.post('http://localhost:3002/logout', {}, {
            withCredentials: true  // This ensures cookies are included in the request
        });

        if (response.data.status === 'Logged out') {
            console.log('You are logged out');
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

export async function getAllRecipes() {
    try {
        const response = await axios.get('http://localhost:3001/all-recipes');
        return response.data;
    } catch (error) {
        console.error("Error getting all recipes: ", error);
    }
}

export async function getRecipesByUser(userId) {
    try {
        const response = await axios.get(`http://localhost:3001/users/${userId}/recipes`);
        return response.data;
    } catch (error) {
        console.error("Error getting recipes of specific user with ID: ", userId, "\nError: ", error);
    }
}

export async function getFriendsRecipes(userId) {
    try {
        const response = await axios.get(`http://localhost:3001/users/${userId}/friends-recipes`);
        return response.data;
    } catch (error) {
        console.error("Error getting recipes from user's friends. User ID: ", userId, "\nError: ", error);
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