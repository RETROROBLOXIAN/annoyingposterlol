// Authentication system
class AuthSystem {
    constructor() {
        this.init();
    }

    init() {
        this.setupLogin();
        this.setupSignup();
    }

    setupLogin() {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.login();
            });
        }
    }

    setupSignup() {
        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.signup();
            });
        }
    }

    login() {
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value.trim();
        const errorElement = document.getElementById('login-error');

        if (!username || !password) {
            this.showError(errorElement, 'Please fill in all fields');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.username === username && u.password === password);

        if (!user) {
            this.showError(errorElement, 'Invalid username or password');
            return;
        }

        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'index.html';
    }

    signup() {
        const username = document.getElementById('signup-username').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const nickname = document.getElementById('signup-nickname').value.trim();
        const password = document.getElementById('signup-password').value.trim();
        const confirmPassword = document.getElementById('signup-confirm-password').value.trim();
        const errorElement = document.getElementById('signup-error');

        // Validation
        if (!username || !email || !nickname || !password || !confirmPassword) {
            this.showError(errorElement, 'Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            this.showError(errorElement, 'Passwords do not match');
            return;
        }

        if (password.length < 6) {
            this.showError(errorElement, 'Password must be at least 6 characters');
            return;
        }

        // Check if username or email exists
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.find(u => u.username === username)) {
            this.showError(errorElement, 'Username already taken');
            return;
        }

        if (users.find(u => u.email === email)) {
            this.showError(errorElement, 'Email already registered');
            return;
        }

        // Create user
        const newUser = {
            id: Date.now().toString(),
            username: username,
            email: email,
            name: nickname,
            pfp: '',
            coins: 1000,
            followers: [],
            following: [],
            posts: [],
            isAdmin: username === 'STEVEN_EXE',
            isVerified: username === 'STEVEN_EXE',
            joinedDate: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        localStorage.setItem('posts', JSON.stringify([]));

        window.location.href = 'index.html';
    }

    showError(element, message) {
        if (element) {
            element.textContent = message;
            element.classList.remove('hidden');
        }
    }
}

// Initialize auth system
new AuthSystem();