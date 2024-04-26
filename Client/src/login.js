import axios from 'axios';
import {loginUser} from "./controller";

document.getElementById('login-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (await loginUser(email, password)){
        window.location.href = 'mainpage.html';
    }

});

