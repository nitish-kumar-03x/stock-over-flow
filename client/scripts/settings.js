document.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('token')) {
    window.location.href = 'login.html';
    return;
  }
  document.getElementById('settings-container').textContent = 'Settings page coming soon.';
}); 