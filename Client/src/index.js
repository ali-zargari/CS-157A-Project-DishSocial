import axios from 'axios';

//example function for deleting user with useridToDelete
function app(useridToDelete){
    axios.delete(`http://localhost:3002/users/${useridToDelete}`)
        .then(response => {
            console.log(response.data); // Log the response from the server
        })
        .catch(error => {
            console.error('There was a problem trying to delete a user', error);
        });
}

//add a user based on userid
function addUser(FirstName, LastName, Gender, Email, Birthplace, DateOfBirth, Password) {
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
function deleteRecipe(recipeID){
    axios.delete(`http://localhost:3002/recipe/${recipeID}`)
        .then(response => {
            console.log(response.data); // Log the response from the server
        })
        .catch(error => {
            console.error('There was a problem trying to delete a recipe', error);
        });
}

function showAllUser() {
    axios.get('http://localhost:3002/users')
        .then(response => {
            console.log(response.data); // Log the response from the server
        })
        .catch(error => {
            console.error('There was a problem with your axios operation:', error);
        });
}

function addRecipe(Title, CookTime, PrepTime, CookTemp, Steps, TotalCalories, NumIngredients) {
    axios.post('http://localhost:3002/recipe', { Title, CookTime, PrepTime, CookTemp,
        Steps, TotalCalories, NumIngredients })
        .then(response => {
            console.log(response.data); // Log the response from the server
        })
        .catch(error => {
            console.error('There was a problem with your axios operation: add recipe', error);
        });
}

function userUploadRecipe(Title, CookTime, PrepTime, CookTemp, Steps, TotalCalories, NumIngredients, userID) {
    axios.post('http://localhost:3002/recipe/userUploadRecipe', { Title, CookTime, PrepTime, CookTemp,
        Steps, TotalCalories, NumIngredients, userID })
        .then(response => {
            console.log(response.data); // Log the response from the server
        })
        .catch(error => {
            console.error('There was a problem with your axios operation: user upload recipe', error);
        });
}
//addUser('John','Doe', 'M', 'johndoe@gmail.com', 'st.pittsburg', '1990-10-23', 'johnpassword123')
//deleteRecipe(6)//test delete on recipeid 6, test result: successfull delete
userUploadRecipe('TestingAdd checking insert id', '0 min', '0 min', 'low', 'yadas', 200, 0, 6)
