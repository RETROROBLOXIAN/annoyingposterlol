const Storage = {
    // Users
    getUsers: () => JSON.parse(localStorage.getItem('ap_users') || '[]'),
    saveUsers: (users) => localStorage.setItem('ap_users', JSON.stringify(users)),
    
    // Posts
    getPosts: () => JSON.parse(localStorage.getItem('ap_posts') || '[]'),
    savePosts: (posts) => localStorage.setItem('ap_posts', JSON.stringify(posts)),
    
    // Current User
    getCurrentUser: () => JSON.parse(localStorage.getItem('ap_current_user') || 'null'),
    setCurrentUser: (user) => localStorage.setItem('ap_current_user', JSON.stringify(user)),
    
    // Theme
    getTheme: () => localStorage.getItem('ap_theme') || 'light',
    setTheme: (theme) => localStorage.setItem('ap_theme', theme),
    
    // Logout
    logout: () => {
        localStorage.removeItem('ap_current_user');
        window.location.href = 'login.html';
    }
};