document.getElementById('register-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const username = this.username.value;
  const password = this.password.value;
  const result = await register(username, password);
  if (result.success) {
    alert('Registration successful! Please log in.');
    window.location.href = 'login.html';
  } else {
    alert('Registration failed: ' + (result.message || 'Error'));
  }
}); 