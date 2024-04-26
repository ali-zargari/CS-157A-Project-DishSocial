import './mainpage.css';
import { logoutUser, showAllUser } from './controller';

document.getElementById('logoutButton').addEventListener('click', async function (event) {
    event.preventDefault();
    console.log("Log out clicked");

    if (await logoutUser()){
        window.location.href = 'login.html';
    }
});

async function loadFriends() {
    try {
        const friends = await showAllUser(); // Assuming showAllUser returns the list of friends
        const friendsListContainer = document.querySelector('.friend-list');
        friendsListContainer.innerHTML = ''; // Clear the container
        friends.forEach(friend => {
            const friendElement = document.createElement('div');
            friendElement.className = 'friend';
            friendElement.textContent = `${friend.FirstName} ${friend.LastName}`; // Adjust according to the data structure
            friendsListContainer.appendChild(friendElement);
        });
    } catch (error) {
        console.error('Failed to load friends:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadFriends();
});
