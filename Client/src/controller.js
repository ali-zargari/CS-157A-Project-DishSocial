import axios from 'axios';

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
        const response = await axios.post('http://localhost:3002/logout');

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