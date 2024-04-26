import './settings.css'
import { getUserById } from './controller.js';


// Simulating a user ID for demonstration
const currentUserId = '1'; // This would be dynamically set in a real application

document.addEventListener('submit', async () => {
    try {
        const userData = await getUserById(currentUserId);
        if (userData) {
            document.getElementById('firstName').value = userData.FirstName;
            document.getElementById('lastName').value = userData.LastName;
            document.getElementById('gender').value = userData.Gender;
            document.getElementById('email').value = userData.Email;
            document.getElementById('birthplace').value = userData.Birthplace;
            document.getElementById('birthdate').value = userData.DateOfBirth.slice(0, 10); // Adjusting the date format
            document.getElementById('password').value = userData.Password;
        } else {
            console.log('No user data found');
        }
    } catch (error) {
        console.error('Error in loading user data:', error);
    }
});

console.log(getUserById(currentUserId));