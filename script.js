const postsContainer = document.getElementById('postsContainer');

const examplePosts = [
    {text: "Hello from user 1", type: "text"},
    {text: "Look at this image!", type: "image", url: "images/example.jpg"},
    {text: "Watch this video!", type: "video", url: "videos/example.mp4"}
];

examplePosts.forEach(post => {
    const postDiv = document.createElement('div');
    postDiv.classList.add('post');

    if(post.type === "text") postDiv.textContent = post.text;
    if(post.type === "image") postDiv.innerHTML = `<img src="${post.url}" alt="Post Image" style="width:100%"><p>${post.text}</p>`;
    if(post.type === "video") postDiv.innerHTML = `<video controls style="width:100%"><source src="${post.url}" type="video/mp4"></video><p>${post.text}</p>`;

    postsContainer.appendChild(postDiv);
});
