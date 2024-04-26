import axios from 'axios';
import {loginUser} from "./controller";
import './login.css';


document.getElementById('login-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (await loginUser(email, password)){
        window.location.href = 'mainpage.html';
    }

});

