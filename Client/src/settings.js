import './settings.css'
import { getUserById, updateUserById } from './controller.js';

document.addEventListener('DOMContentLoaded', async () => {
    const userId = '1'; // Set to the user ID you want to fetch data for

    // Fetch user data and populate the form
    try {
        const userData = await getUserById(userId);
        if (userData) {
            document.getElementById('firstName').value = userData.FirstName;
            document.getElementById('lastName').value = userData.LastName;
            document.getElementById('gender').value = userData.Gender;
            document.getElementById('email').value = userData.Email;
            document.getElementById('birthplace').value = userData.Birthplace;
            document.getElementById('birthdate').value = userData.DateOfBirth.slice(0, 10); // Assuming it needs to be sliced
            document.getElementById('password').value = userData.Password;

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

    // Handle form submission
    const form = document.getElementById('settingsForm');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        let updatedData = {
            FirstName: document.getElementById('firstName').value,
            LastName: document.getElementById('lastName').value,
            Gender: document.getElementById('gender').value,
            Email: document.getElementById('email').value,
            Birthplace: document.getElementById('birthplace').value,
            DateOfBirth: document.getElementById('birthdate').value,
            Password: document.getElementById('password').value,
        };

        try {
            const updateResponse = await updateUserById(userId, updatedData);
            console.log('User updated successfully.');
            // Refresh the page if update is successful
            location.reload();
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    });
});
