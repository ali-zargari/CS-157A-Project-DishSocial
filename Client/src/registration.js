import {addUser} from "./controller";

document.getElementById('userForm').addEventListener('submit',async function(event) {
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
        document.getElementById('userForm').appendChild(errorMsg);

        setTimeout(() => {
            // Remove the error message after 5 seconds
            errorMsg.remove();
        }, 5000);
    }

});

