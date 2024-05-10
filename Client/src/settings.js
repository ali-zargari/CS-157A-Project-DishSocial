import './settings.css'
import {deleteUser, getUserById, updateUserById} from './controller.js';


function getUserIDFromQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('userID');
}


document.addEventListener('DOMContentLoaded', async () => {
    const userId = getUserIDFromQuery();
    const messageBox = document.getElementById('messageBox');
    const userData = await getUserById(userId);
    try {
        if (userData) {
            document.getElementById('firstName').value = userData.FirstName;
            document.getElementById('lastName').value = userData.LastName;
            document.getElementById('gender').value = userData.Gender;
            //document.getElementById('email').value = userData.Email;
            document.getElementById('birthplace').value = userData.Birthplace;
            document.getElementById('birthdate').value = userData.DateOfBirth.slice(0, 10);

            const userInfoWrapper = document.getElementById('user-info-wrapper');
            userInfoWrapper.innerHTML = '<h2>User Information</h2>';

            Object.keys(userData).forEach(key => {
                const para = document.createElement('p');

                if (key === 'DateOfBirth') {
                    const dob = formatDate(userData.DateOfBirth.slice(0, 10));
                    para.textContent = `${key}: ${dob}`;
                    userInfoWrapper.appendChild(para);
                    return;
                }

                para.textContent = `${key}: ${userData[key]}`;
                userInfoWrapper.appendChild(para);
            });

            const deleteUserButton = document.createElement('button');
            deleteUserButton.textContent = 'Delete User';
            deleteUserButton.className = 'delete-user-button';
            deleteUserButton.style.backgroundColor = 'red';
            deleteUserButton.style.borderRadius = '5px';
            deleteUserButton.style.color = 'white';
            deleteUserButton.style.width = '100px';
            deleteUserButton.style.height = '30px';
            deleteUserButton.addEventListener('click', async() => {
                try {
                    alert('User Deleted Successfully!');
                    await deleteUser(userId);
                    window.location.href = 'index.html';

                } catch (error) {
                    console.error('Error deleting user:', error);
                    alert('Error deleting user');
                }

            })
            userInfoWrapper.appendChild(deleteUserButton);
        }else {
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
            Email: userData.Email,
            Birthplace: document.getElementById('birthplace').value,
            DateOfBirth: document.getElementById('birthdate').value
        };

        const passwordValue = document.getElementById('password').value;
        if (passwordValue) {
            updatedData.Password = passwordValue;
        }

        try {
            const updateResponse = await updateUserById(userId, updatedData);
            messageBox.textContent = 'User updated successfully.';
            messageBox.className = 'message-box success';
            messageBox.style.display = 'block';

            setTimeout(() => {
                messageBox.style.display = 'none';
                location.reload();
            }, 4000);
        } catch (error) {
            console.error('Error updating user data:', error);
            messageBox.textContent = 'Error updating user data.';
            messageBox.className = 'message-box error';
            messageBox.style.display = 'block';
        }
    });
});


const logoutButton = document.getElementById('logoutButton');

logoutButton.addEventListener('click', function () {
    try {
       
        document.cookie = "userID=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        console.log("Logged out successfully.");
        window.location.href = 'index.html';

    } catch (error) {
        console.error('There was an error trying to log out:', error);
    }
});


const dashbordButton = document.getElementById('dashbordButton');

dashbordButton.addEventListener('click', function () {
    try {
       
        window.location.href = 'mainpage.html';

    } catch (error) {
        console.error('There was an error:', error);
    }
});

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}/
                          ${(date.getDate() + 1).toString().padStart(2, '0')}/
                          ${date.getFullYear().toString()}`;
};