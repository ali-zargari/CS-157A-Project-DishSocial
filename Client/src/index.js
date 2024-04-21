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

//add a user
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

//addUser('John','Doe', 'M', 'johndoe@gmail.com', 'st.pittsburg', '1990-10-23', 'johnpassword123')