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