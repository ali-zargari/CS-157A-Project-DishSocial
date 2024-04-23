import axios from 'axios';

document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    axios.post('/login', {
        username: username,
        password: password,
    })
        .then((response) => {
            const data = response.data;
            document.getElementById('result').textContent = JSON.stringify(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});