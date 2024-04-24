import axios from "axios";
import {addUser} from "./controller";

document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting via the browser

    const user = {
        FirstName: document.getElementById('FirstName').value,
        LastName: document.getElementById('LastName').value,
        Gender: document.getElementById('Gender').value,
        Email: document.getElementById('Email').value,
        Birthplace: document.getElementById('Birthplace').value,
        DateOfBirth: document.getElementById('DateOfBirth').value,
        Password: document.getElementById('Password').value
    };

    addUser(user);
    console.log(user)

});