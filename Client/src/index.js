import axios from 'axios';
import { loginUser, addUser } from "./controller";
import './index.css';

document.getElementById('registrationForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const user = {
        FirstName: document.getElementById('regFirstName').value,
        LastName: document.getElementById('regLastName').value,
        Gender: document.getElementById('regGender').value,
        Email: document.getElementById('regEmail').value,
        Birthplace: document.getElementById('regBirthplace').value,
        DateOfBirth: document.getElementById('regDateOfBirth').value,
        Password: document.getElementById('regPassword').value
    };

   
    const { FirstName, LastName, Gender, Email, Birthplace, DateOfBirth, Password } = user;

    if(await addUser(FirstName, LastName, Gender, Email, Birthplace, DateOfBirth, Password)) {
        alert("You are registered successfully.");
        console.log('User Added Successfully');
        if (await loginUser(Email, Password)) {
            window.location.href = 'mainpage.html';
        }
    } else {
        console.log('User NOT ADDED.');
       
        let errorMsg = document.createElement('p');
        errorMsg.textContent = "Email already exists!";
        errorMsg.style.color = "red";

       
        document.getElementById('registrationForm').appendChild(errorMsg);

        setTimeout(() => {
           
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
       
        console.log('Login failed');
       
        let errorMsg = document.createElement('p');
        errorMsg.textContent = "Invalid email or password!";
        errorMsg.style.color = "red";

       
        document.getElementById('loginForm').appendChild(errorMsg);

        setTimeout(() => {
           
            errorMsg.remove();
        }, 5000);
    }
});