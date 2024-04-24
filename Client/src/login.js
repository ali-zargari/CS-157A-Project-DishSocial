import axios from 'axios';
import {loginUser} from "./controller";

document.getElementById('login-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (await loginUser(username, password)){
        window.location.href = 'mainpage.html';
    }

});

