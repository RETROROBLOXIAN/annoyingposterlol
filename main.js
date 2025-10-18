// Main site initialization
class SiteManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.checkAuth();
        this.updateNavigation();
    }

    checkAuth() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const currentPage = window.location.pathname.split('/').pop();

        // Redirect logic
        if (!this.currentUser && !['login.html', 'signup.html', 'about.html'].includes(currentPage)) {
            window.location.href = 'login.html';
            return;
        }

        if (this.currentUser && ['login.html', 'signup.html'].includes(currentPage)) {
            window.location.href = 'index.html';
            return;
        }
    }

    updateNavigation() {
        // Remove login/signup links if logged in
        if (this.currentUser) {
            document.querySelectorAll('a[href="login.html"], a[href="signup.html"]').forEach(el => el.remove());
            
            // Update coins display
            const coinsDisplay = document.getElementById('coins-display');
            if (coinsDisplay) {
                coinsDisplay.textContent = `${this.currentUser.coins} AL`;
            }
        }
    }

    logout() {
        if (confirm('Are you sure you want to log out?')) {
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        }
    }
}

// Initialize site
const site = new SiteManager();

// Global logout function
window.logout = function() {
    site.logout();
};