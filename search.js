document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('search-btn').addEventListener('click', search);
    document.getElementById('search-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') search();
    });

    function search() {
        const term = document.getElementById('search-input').value.toLowerCase().trim();
        const results = document.getElementById('search-results');
        
        if (!term) {
            alert('Enter search term');
            return;
        }

        const users = Storage.getUsers();
        const posts = Storage.getPosts();
        results.innerHTML = '';

        let found = false;

        // SEARCH USERS WORKING
        users.forEach(user => {
            if (user.username.toLowerCase().includes(term) || user.name.toLowerCase().includes(term)) {
                found = true;
                const div = document.createElement('div');
                div.className = 'search-user';
                div.innerHTML = `
                    <img src="${user.pfp || ''}" class="pfp">
                    <b>${user.name}</b> (@${user.username})
                    ${user.isVerified ? '✓' : ''}
                `;
                results.appendChild(div);
            }
        });

        // SEARCH POSTS WORKING
        posts.forEach(post => {
            if (post.title.toLowerCase().includes(term) || post.content.toLowerCase().includes(term)) {
                found = true;
                const div = document.createElement('div');
                div.className = 'search-post';
                div.innerHTML = `
                    <div class="post-header">
                        <img src="${post.pfp || ''}" class="pfp">
                        <b>${post.name}</b> (@${post.username})
                    </div>
                    <p><b>${post.title}</b>: ${post.content}</p>
                `;
                results.appendChild(div);
            }
        });

        if (!found) {
            results.innerHTML = '<p>No results found</p>';
        }
    }
});