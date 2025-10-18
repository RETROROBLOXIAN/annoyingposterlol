document.addEventListener('DOMContentLoaded', function() {
    const currentUser = Storage.getCurrentUser();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Theme buttons
    document.getElementById('theme-light').addEventListener('click', () => setTheme('light'));
    document.getElementById('theme-dark').addEventListener('click', () => setTheme('dark'));

    // Logout
    document.getElementById('logout-btn').addEventListener('click', () => {
        if (confirm('Are you sure you want to log out?')) {
            Storage.logout();
        }
    });

    function setTheme(theme) {
        Storage.setTheme(theme);
        document.body.classList.toggle('dark-theme', theme === 'dark');
        alert(`Theme changed to ${theme}`);
    }
});