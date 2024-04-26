import axios from 'axios';
import {logoutUser} from "./controller";

document.getElementById('logoutButton').addEventListener('click', async function (event) {
    event.preventDefault();
    console.log("Log out clicked");
    if (await logoutUser()){
        window.location.href = 'login.html';
    }

});