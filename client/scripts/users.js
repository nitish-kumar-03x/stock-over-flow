document.addEventListener('DOMContentLoaded', async () => {
  if (!localStorage.getItem('token')) {
    window.location.href = 'login.html';
    return;
  }
  const usersContainer = document.getElementById('users-container');
  const users = await getUsers();
  usersContainer.innerHTML = '<ul>' + users.map(user => `
    <li>${user.username} <button onclick="deleteUserHandler('${user._id}')">Delete</button></li>
  `).join('') + '</ul>';
});

async function deleteUserHandler(id) {
  if (confirm('Delete this user?')) {
    await deleteUser(id);
    location.reload();
  }
} 