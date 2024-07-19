function checkAuthenticated() {
  fetch('/check-auth')
    .then(response => response.json())
    .then(data => {
      if (!data.isAuthenticated) {
        window.location.href = '/login';
      } else {
        ensureRole(data.userRole);
      }
    })
    .catch(error => {
      console.error('Error checking authentication:', error);
      window.location.href = '/login';
    });
}

function ensureRole(role) {
  const path = window.location.pathname;
  if ((path.startsWith('/admin') && role !== 'admin') ||
      (path.startsWith('/student') && role !== 'student') ||
      (path.startsWith('/committee') && role !== 'committee') ||
      (path.startsWith('/consent') && role !== 'student')) {
        window.history.back();
  }
}

document.addEventListener('DOMContentLoaded', checkAuthenticated);
