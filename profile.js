// Profile system
class ProfileSystem {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!this.currentUser) {
            window.location.href = 'login.html';
            return;
        }

        this.init();
    }

    init() {
        this.loadProfile();
        this.setupEventListeners();
    }

    loadProfile() {
        // Update profile display
        document.getElementById('profile-name').textContent = this.currentUser.name;
        document.getElementById('profile-username').textContent = `@${this.currentUser.username}`;
        document.getElementById('profile-email').textContent = this.currentUser.email;
        document.getElementById('profile-join-date').textContent = new Date(this.currentUser.joinedDate).toLocaleDateString();
        document.getElementById('profile-coins').textContent = this.currentUser.coins;
        
        // Calculate stats
        const posts = JSON.parse(localStorage.getItem('posts') || '[]');
        const userPosts = posts.filter(p => p.userId === this.currentUser.id);
        
        document.getElementById('profile-followers').textContent = this.currentUser.followers.length;
        document.getElementById('profile-following').textContent = this.currentUser.following.length;
        document.getElementById('profile-posts').textContent = userPosts.length;

        // Update coins display in header
        const coinsDisplay = document.getElementById('coins-display');
        if (coinsDisplay) {
            coinsDisplay.textContent = `${this.currentUser.coins} AL`;
        }

        // Load profile picture
        const profilePfp = document.getElementById('profile-pfp');
        if (profilePfp) {
            profilePfp.src = this.currentUser.pfp || this.getDefaultPfp(this.currentUser.name);
        }

        // Set edit name input
        const editNameInput = document.getElementById('edit-name');
        if (editNameInput) {
            editNameInput.value = this.currentUser.name;
        }
    }

    setupEventListeners() {
        const editPfpBtn = document.getElementById('edit-pfp-btn');
        const pfpInput = document.getElementById('pfp-input');
        const saveProfileBtn = document.getElementById('save-profile-btn');

        if (editPfpBtn) {
            editPfpBtn.addEventListener('click', () => pfpInput.click());
        }

        if (pfpInput) {
            pfpInput.addEventListener('change', (e) => this.handlePfpUpload(e));
        }

        if (saveProfileBtn) {
            saveProfileBtn.addEventListener('click', () => this.saveProfile());
        }
    }

    handlePfpUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Check if image
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Resize image to 450x450
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Set canvas size to 450x450
                canvas.width = 450;
                canvas.height = 450;
                
                // Draw image resized to 450x450
                ctx.drawImage(img, 0, 0, 450, 450);
                
                // Convert to data URL
                const resizedImage = canvas.toDataURL('image/jpeg', 0.9);
                
                // Update profile picture display
                const profilePfp = document.getElementById('profile-pfp');
                if (profilePfp) {
                    profilePfp.src = resizedImage;
                }
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    saveProfile() {
        const newName = document.getElementById('edit-name').value.trim();
        if (!newName) {
            alert('Please enter a display name');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        
        if (userIndex === -1) {
            alert('User not found');
            return;
        }

        // Get current profile picture
        const profilePfp = document.getElementById('profile-pfp');
        const newPfp = profilePfp ? profilePfp.src : this.currentUser.pfp;

        // Update user data
        users[userIndex].name = newName;
        users[userIndex].pfp = newPfp;

        // Update posts with new name and pfp
        const posts = JSON.parse(localStorage.getItem('posts') || '[]');
        posts.forEach(post => {
            if (post.userId === this.currentUser.id) {
                post.name = newName;
                post.pfp = newPfp;
            }
        });

        // Update comments with new name and pfp
        posts.forEach(post => {
            post.comments.forEach(comment => {
                if (comment.userId === this.currentUser.id) {
                    comment.name = newName;
                    comment.pfp = newPfp;
                }
            });
        });

        // Save everything
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('posts', JSON.stringify(posts));
        localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));

        // Update current user reference
        this.currentUser = users[userIndex];

        alert('Profile updated successfully!');
        this.loadProfile();
    }

    getDefaultPfp(name) {
        return `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjE1MCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiNkZGQiLz48dGV4dCB4PSI3NSIgeT0iNzUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0MCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9ImNlbnRyYWwiPiR7bmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKX08L3RleHQ+PC9zdmc+`;
    }
}

// Initialize profile system
let profileSystem;
document.addEventListener('DOMContentLoaded', () => {
    profileSystem = new ProfileSystem();
});