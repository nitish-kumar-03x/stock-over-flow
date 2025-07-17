document.getElementById('login-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const username = this.username.value;
  const password = this.password.value;
  const result = await login(username, password);
  if (result.success) {
    localStorage.setItem('stockoverflow', result.token); // Save token if using JWT
    window.location.href = 'dashboard.html';
  } else {
    alert('Login failed: ' + (result.message || 'Invalid credentials'));
  }
}); 