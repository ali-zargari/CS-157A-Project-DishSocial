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

export async function loginUser(email, password) {
    try {
        const response = await axios.post('http://localhost:3002/login',
            { email, password }, { withCredentials: true });
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

//add a user based on userid
export async function addUser(FirstName, LastName, Gender, Email, Birthplace, DateOfBirth, Password) {

    try{
        const response = await axios.post('http://localhost:3002/users', { FirstName, LastName, Gender, Email,
            Birthplace, DateOfBirth, Password });

        if(response.data.status === 'success') {
            //console.log(response.data);
            //console.log("TESTING")
            return true;
        } else {
            console.log('Registration failed');
            return false;
        }
    } catch (error){
        console.error('Error adding user: ', error);
    }

}


