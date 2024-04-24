import axios from 'axios';


//console.log("HERE")


//example function for deleting user with useridToDelete
export function app(useridToDelete){
    axios.delete(`http://localhost:3002/users/6`)
        .then(response => {
            console.log(response.data); // Log the response from the server
        })
        .catch(error => {
            console.error('There was a problem trying to delete a user', error);
        });
}

//add a user based on userid
export function addUser(FirstName, LastName, Gender, Email, Birthplace, DateOfBirth, Password) {


    console.log(FirstName, LastName, Gender, Email, Birthplace, DateOfBirth);

    axios.post('http://localhost:3002/users', { FirstName, LastName, Gender, Email,
                                                        Birthplace, DateOfBirth, Password })
        .then(response => {
            console.log(response.data); // Log the response from the server
        })
        .catch(error => {
            console.error('There was a problem with your axios operation:', error);
        });
}

//delete a recipe based on recipeid
export function deleteRecipe(recipeID){
    axios.delete(`http://localhost:3002/recipe/${recipeID}`)
        .then(response => {
            console.log(response.data); // Log the response from the server
        })
        .catch(error => {
            console.error('There was a problem trying to delete a recipe', error);
        });
}

export function showAllUser() {
    axios.get('http://localhost:3002/users')
        .then(response => {
            console.log(response.data); // Log the response from the server
        })
        .catch(error => {
            console.error('There was a problem with your axios operation:', error);
        });
}

export function addRecipe(Title, CookTime, PrepTime, CookTemp, Steps, TotalCalories, NumIngredients) {
    axios.post('http://localhost:3002/recipe', { Title, CookTime, PrepTime, CookTemp,
        Steps, TotalCalories, NumIngredients })
        .then(response => {
            console.log(response.data); // Log the response from the server
        })
        .catch(error => {
            console.error('There was a problem with your axios operation: add recipe', error);
        });
}

export function userUploadRecipe(Title, CookTime, PrepTime, CookTemp, Steps, TotalCalories, NumIngredients, userID) {
    axios.post('http://localhost:3002/recipe/userUploadRecipe', { Title, CookTime, PrepTime, CookTemp,
        Steps, TotalCalories, NumIngredients, userID })
        .then(response => {
            console.log(response.data); // Log the response from the server
        })
        .catch(error => {
            console.error('There was a problem with your axios operation: user upload recipe', error);
        });
}

export async function loginUser(username, password) {
    try {
        const response = await axios.post('http://localhost:3002/login', { username, password }, { withCredentials: true });
        console.log(response.data); // Log the response from the server
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

