import { backend } from 'declarations/backend';

let quill;

document.addEventListener('DOMContentLoaded', async () => {
    quill = new Quill('#editor', {
        theme: 'snow'
    });

    const newPostBtn = document.getElementById('newPostBtn');
    const newPostForm = document.getElementById('newPostForm');
    const postForm = document.getElementById('postForm');

    newPostBtn.addEventListener('click', () => {
        newPostForm.style.display = newPostForm.style.display === 'none' ? 'block' : 'none';
    });

    postForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('postTitle').value;
        const author = document.getElementById('postAuthor').value;
        const body = quill.root.innerHTML;

        await backend.addPost(title, body, author);
        postForm.reset();
        quill.setContents([]);
        newPostForm.style.display = 'none';
        await displayPosts();
    });

    await displayPosts();
});

async function displayPosts() {
    const postsSection = document.getElementById('posts');
    const posts = await backend.getPosts();
    
    postsSection.innerHTML = '';
    posts.reverse().forEach(post => {
        const postElement = document.createElement('article');
        postElement.className = 'post';
        postElement.innerHTML = `
            <h2>${post.title}</h2>
            <p class="author">By ${post.author}</p>
            <div class="post-content">${post.body}</div>
            <p class="timestamp">${new Date(Number(post.timestamp) / 1000000).toLocaleString()}</p>
        `;
        postsSection.appendChild(postElement);
    });
}
