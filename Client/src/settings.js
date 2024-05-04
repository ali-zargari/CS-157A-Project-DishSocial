import './settings.css'
import { getUserById, updateUserById } from './controller.js';

document.addEventListener('DOMContentLoaded', async () => {
    const userId = '1'; // Set to the user ID you want to fetch data for
    const messageBox = document.getElementById('messageBox'); // Get the message box element

    try {
        const userData = await getUserById(userId);
        if (userData) {
            document.getElementById('firstName').value = userData.FirstName;
            document.getElementById('lastName').value = userData.LastName;
            document.getElementById('gender').value = userData.Gender;
            document.getElementById('email').value = userData.Email;
            document.getElementById('birthplace').value = userData.Birthplace;
            document.getElementById('birthdate').value = userData.DateOfBirth.slice(0, 10);

            const userInfoWrapper = document.getElementById('user-info-wrapper');
            userInfoWrapper.innerHTML = '<h2>User Information</h2>';

            Object.keys(userData).forEach(key => {
                const para = document.createElement('p');
                para.textContent = `${key}: ${userData[key]}`;
                userInfoWrapper.appendChild(para);
            });
        } else {
            console.log('No user data found');
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }

    const form = document.getElementById('settingsForm');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        let updatedData = {
            FirstName: document.getElementById('firstName').value,
            LastName: document.getElementById('lastName').value,
            Gender: document.getElementById('gender').value,
            Email: document.getElementById('email').value,
            Birthplace: document.getElementById('birthplace').value,
            DateOfBirth: document.getElementById('birthdate').value
        };

        const passwordValue = document.getElementById('password').value;
        if (passwordValue) {
            updatedData.Password = passwordValue;
        }

        try {
            const updateResponse = await updateUserById(userId, updatedData);
            messageBox.textContent = 'User updated successfully.'; // Set success message
            messageBox.className = 'message-box success'; // Additional class for styling success
            messageBox.style.display = 'block'; // Show the message box

            setTimeout(() => {
                messageBox.style.display = 'none'; // Optionally hide the message after some time
                location.reload(); // Refresh the page if update is successful
            }, 4000);
        } catch (error) {
            console.error('Error updating user data:', error);
            messageBox.textContent = 'Error updating user data.';
            messageBox.className = 'message-box error'; // Additional class for styling errors
            messageBox.style.display = 'block'; // Show the message box
        }
    });
});
