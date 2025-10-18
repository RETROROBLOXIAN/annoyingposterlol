function followUser(username) {
    const currentUser = Storage.getCurrentUser();
    if (!currentUser) {
        alert('Please login to follow users');
        return;
    }

    if (currentUser.username === username) {
        alert("You can't follow yourself");
        return;
    }

    const users = Storage.getUsers();
    const currentUserIndex = users.findIndex(u => u.username === currentUser.username);
    const targetUserIndex = users.findIndex(u => u.username === username);

    if (currentUserIndex === -1 || targetUserIndex === -1) return;

    const isFollowing = users[currentUserIndex].following.includes(username);

    if (isFollowing) {
        // Unfollow
        users[currentUserIndex].following = users[currentUserIndex].following.filter(u => u !== username);
        users[targetUserIndex].followers = users[targetUserIndex].followers.filter(u => u !== currentUser.username);
        alert(`Unfollowed ${username}`);
    } else {
        // Follow
        users[currentUserIndex].following.push(username);
        users[targetUserIndex].followers.push(currentUser.username);
        alert(`Following ${username}`);
    }

    Storage.saveUsers(users);
    Storage.setCurrentUser(users[currentUserIndex]);
    window.location.reload();
}