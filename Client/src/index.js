import axios from 'axios';

//example function for deleting user with useridToDelete
function app(useridToDelete){
    axios.delete(`http://localhost:3002/users/${useridToDelete}`)
        .then(response => {
            console.log(response.data); // Log the response from the server
        })
        .catch(error => {
            console.error('There was a problem with your axios operation:', error);
        });
}

app(5)