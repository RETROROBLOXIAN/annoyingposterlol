// Posts system
class PostsSystem {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!this.currentUser) return;

        this.init();
    }

    init() {
        this.setupPostCreation();
        this.renderPosts();
    }

    setupPostCreation() {
        const postTextBtn = document.getElementById('post-text-btn');
        const postImageBtn = document.getElementById('post-image-btn');
        const postVideoBtn = document.getElementById('post-video-btn');
        const submitPostBtn = document.getElementById('submit-post-btn');

        if (postTextBtn) postTextBtn.addEventListener('click', () => this.showPostForm('text'));
        if (postImageBtn) postImageBtn.addEventListener('click', () => this.showPostForm('image'));
        if (postVideoBtn) postImageBtn.addEventListener('click', () => this.showPostForm('video'));
        if (submitPostBtn) submitPostBtn.addEventListener('click', () => this.createPost());
    }

    showPostForm(type) {
        const postForm = document.getElementById('post-form');
        const postFileInput = document.getElementById('post-file');

        postForm.classList.remove('hidden');
        
        if (type === 'text') {
            postFileInput.classList.add('hidden');
        } else {
            postFileInput.classList.remove('hidden');
            postFileInput.setAttribute('accept', type === 'image' ? 'image/*' : 'video/*');
        }

        postForm.dataset.type = type;
    }

    createPost() {
        const type = document.getElementById('post-form').dataset.type;
        const title = document.getElementById('post-title').value.trim() || 'No Title';
        const content = document.getElementById('post-text').value.trim();
        const fileInput = document.getElementById('post-file');

        if (type === 'text' && !content) {
            alert('Please enter some text for your post');
            return;
        }

        if ((type === 'image' || type === 'video') && !fileInput.files[0]) {
            alert(`Please select a ${type} file`);
            return;
        }

        const newPost = {
            id: Date.now().toString(),
            type: type,
            title: title,
            content: content,
            userId: this.currentUser.id,
            username: this.currentUser.username,
            name: this.currentUser.name,
            pfp: this.currentUser.pfp || '',
            likes: 0,
            likedBy: [],
            comments: [],
            timestamp: new Date().toISOString()
        };

        if (type === 'image' || type === 'video') {
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                newPost.fileData = e.target.result;
                this.savePost(newPost);
            };
            reader.readAsDataURL(file);
        } else {
            this.savePost(newPost);
        }
    }

    savePost(post) {
        const posts = JSON.parse(localStorage.getItem('posts') || '[]');
        posts.unshift(post);
        localStorage.setItem('posts', JSON.stringify(posts));

        document.getElementById('post-form').classList.add('hidden');
        this.renderPosts();
        alert('Post created successfully!');
    }

    renderPosts() {
        const postsContainer = document.getElementById('posts-container');
        if (!postsContainer) return;

        const posts = JSON.parse(localStorage.getItem('posts') || '[]');
        postsContainer.innerHTML = '';

        if (posts.length === 0) {
            postsContainer.innerHTML = '<p class="text-center">No posts yet. Be the first to post!</p>';
            return;
        }

        posts.forEach(post => {
            const postElement = this.createPostElement(post);
            postsContainer.appendChild(postElement);
        });
    }

    createPostElement(post) {
        const isLiked = post.likedBy.includes(this.currentUser.id);
        const canEdit = post.userId === this.currentUser.id || this.currentUser.isAdmin;

        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <div class="post-header">
                <img src="${post.pfp || this.getDefaultPfp(post.name)}" class="post-pfp" alt="Profile">
                <div class="post-user-info">
                    <div class="post-username">
                        ${post.name} 
                        ${post.isVerified ? '<span class="verified-badge">✓</span>' : ''}
                    </div>
                    <div class="post-nickname">@${post.username}</div>
                    <div class="post-time">${new Date(post.timestamp).toLocaleString()}</div>
                </div>
                ${canEdit ? `
                    <div>
                        <button class="btn-secondary" onclick="postsSystem.editPost('${post.id}')">Edit</button>
                        <button class="btn-secondary" onclick="postsSystem.deletePost('${post.id}')" style="background: #dc3545 !important;">Delete</button>
                    </div>
                ` : ''}
            </div>
            <div class="post-content">
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                ${post.fileData ? 
                    (post.type === "image" ? 
                        `<img src="${post.fileData}" class="post-image" alt="Post image">` : 
                        `<video src="${post.fileData}" class="post-image" controls></video>`) : 
                    ''}
            </div>
            <div class="post-actions">
                <button class="post-action like-btn ${isLiked ? 'liked' : ''}" onclick="postsSystem.toggleLike('${post.id}')">
                    ${post.likes} ❤
                </button>
                <button class="post-action" onclick="postsSystem.toggleComments('${post.id}')">
                    💬 ${post.comments.length}
                </button>
            </div>
            <div class="comments-section hidden" id="comments-${post.id}">
                <div class="add-comment">
                    <input type="text" id="comment-input-${post.id}" placeholder="Write a comment... (@donate AMOUNT to send coins)">
                    <button onclick="postsSystem.addComment('${post.id}')">Post</button>
                </div>
                <div id="comments-list-${post.id}"></div>
            </div>
        `;

        this.renderComments(post.id, post.comments);
        return postElement;
    }

    toggleLike(postId) {
        const posts = JSON.parse(localStorage.getItem('posts') || '[]');
        const postIndex = posts.findIndex(p => p.id === postId);
        
        if (postIndex === -1) return;

        const post = posts[postIndex];
        const userIndex = post.likedBy.indexOf(this.currentUser.id);

        if (userIndex === -1) {
            post.likes++;
            post.likedBy.push(this.currentUser.id);
        } else {
            post.likes--;
            post.likedBy.splice(userIndex, 1);
        }

        localStorage.setItem('posts', JSON.stringify(posts));
        this.renderPosts();
    }

    toggleComments(postId) {
        const commentsSection = document.getElementById(`comments-${postId}`);
        commentsSection.classList.toggle('hidden');
    }

    addComment(postId) {
        const input = document.getElementById(`comment-input-${post.id}`);
        const content = input.value.trim();

        if (!content) return;

        // Check for coin donation
        const coinMatch = content.match(/@donate\s+(\d+)/);
        let donationAmount = 0;
        let cleanContent = content;

        if (coinMatch) {
            donationAmount = parseInt(coinMatch[1]);
            cleanContent = content.replace(/@donate\s+\d+/, '').trim();
            
            if (donationAmount > this.currentUser.coins) {
                alert('Not enough coins for donation');
                return;
            }
        }

        const posts = JSON.parse(localStorage.getItem('posts') || '[]');
        const postIndex = posts.findIndex(p => p.id === postId);
        
        if (postIndex === -1) return;

        const newComment = {
            id: Date.now().toString(),
            userId: this.currentUser.id,
            username: this.currentUser.username,
            name: this.currentUser.name,
            pfp: this.currentUser.pfp || '',
            content: cleanContent,
            donation: donationAmount,
            timestamp: new Date().toISOString()
        };

        posts[postIndex].comments.push(newComment);

        // Process coin donation
        if (donationAmount > 0) {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const senderIndex = users.findIndex(u => u.id === this.currentUser.id);
            const receiverIndex = users.findIndex(u => u.id === posts[postIndex].userId);
            
            if (senderIndex !== -1 && receiverIndex !== -1) {
                users[senderIndex].coins -= donationAmount;
                users[receiverIndex].coins += donationAmount;
                localStorage.setItem('users', JSON.stringify(users));
                
                // Update current user
                if (senderIndex === users.findIndex(u => u.id === this.currentUser.id)) {
                    localStorage.setItem('currentUser', JSON.stringify(users[senderIndex]));
                    this.currentUser.coins = users[senderIndex].coins;
                    
                    // Update coins display
                    const coinsDisplay = document.getElementById('coins-display');
                    if (coinsDisplay) {
                        coinsDisplay.textContent = `${this.currentUser.coins} AL`;
                    }
                }
            }
        }

        localStorage.setItem('posts', JSON.stringify(posts));
        input.value = '';
        this.renderPosts();
    }

    renderComments(postId, comments) {
        const container = document.getElementById(`comments-list-${postId}`);
        if (!container) return;

        container.innerHTML = '';
        
        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.className = 'comment';
            commentElement.innerHTML = `
                <img src="${comment.pfp || this.getDefaultPfp(comment.name)}" class="comment-pfp" alt="Profile">
                <div class="comment-content">
                    <div class="comment-user">
                        ${comment.name}
                        ${comment.donation ? `<span style="color: gold;"> donated ${comment.donation} AL</span>` : ''}
                    </div>
                    <div class="comment-text">${comment.content}</div>
                </div>
            `;
            container.appendChild(commentElement);
        });
    }

    editPost(postId) {
        const posts = JSON.parse(localStorage.getItem('posts') || '[]');
        const postIndex = posts.findIndex(p => p.id === postId);
        
        if (postIndex !== -1) {
            const newTitle = prompt('Edit post title:', posts[postIndex].title);
            if (newTitle !== null) {
                posts[postIndex].title = newTitle;
                localStorage.setItem('posts', JSON.stringify(posts));
                this.renderPosts();
            }
        }
    }

    deletePost(postId) {
        if (confirm('Are you sure you want to delete this post?')) {
            const posts = JSON.parse(localStorage.getItem('posts') || '[]');
            const filteredPosts = posts.filter(p => p.id !== postId);
            localStorage.setItem('posts', JSON.stringify(filteredPosts));
            this.renderPosts();
        }
    }

    getDefaultPfp(name) {
        return `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiNkZGQiLz48dGV4dCB4PSIyMCIgeT0iMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9ImNlbnRyYWwiPiR7bmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKX08L3RleHQ+PC9zdmc+`;
    }
}

// Initialize posts system
let postsSystem;
document.addEventListener('DOMContentLoaded', () => {
    postsSystem = new PostsSystem();
});