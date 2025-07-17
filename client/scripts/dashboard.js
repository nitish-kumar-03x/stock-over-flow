document.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('stockoverflow')) {
    window.location.href = 'login.html';
  }
  document.getElementById('logout-link').addEventListener('click', function(e) {
    localStorage.removeItem('stockoverflow');
  });
}); 