import axios from 'axios';
import { loginUser, addUser } from "./controller";
import './index.css';

document.getElementById('registrationForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the form from submitting via the browser

    const user = {
        FirstName: document.getElementById('regFirstName').value,
        LastName: document.getElementById('regLastName').value,
        Gender: document.getElementById('regGender').value,
        Email: document.getElementById('regEmail').value,
        Birthplace: document.getElementById('regBirthplace').value,
        DateOfBirth: document.getElementById('regDateOfBirth').value,
        Password: document.getElementById('regPassword').value
    };

    // Destructure the user object into individual variables
    const { FirstName, LastName, Gender, Email, Birthplace, DateOfBirth, Password } = user;

    if(await addUser(FirstName, LastName, Gender, Email, Birthplace, DateOfBirth, Password)) {
        console.log('User Added Successfully');
    } else {
        console.log('User NOT ADDED.');
        // Create an error message element if the user already exists
        let errorMsg = document.createElement('p');
        errorMsg.textContent = "Email already exists!";
        errorMsg.style.color = "red"; // Style the message with red color

        // Append the error message to the form
        document.getElementById('registrationForm').appendChild(errorMsg);

        setTimeout(() => {
            // Remove the error message after 5 seconds
            errorMsg.remove();
        }, 5000);
    }
});

document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (await loginUser(email, password)) {
        window.location.href = 'mainpage.html';
    } else {
        // Display an error message or perform any other action on login failure
        console.log('Login failed');
        // Create an error message element if login fails
        let errorMsg = document.createElement('p');
        errorMsg.textContent = "Invalid email or password!";
        errorMsg.style.color = "red"; // Style the message with red color

        // Append the error message to the form
        document.getElementById('loginForm').appendChild(errorMsg);

        setTimeout(() => {
            // Remove the error message after 5 seconds
            errorMsg.remove();
        }, 5000);
    }
});