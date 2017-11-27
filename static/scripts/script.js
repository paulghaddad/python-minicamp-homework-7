const incrementLikeCount = (evt) => {
  evt.preventDefault();
  const target = evt.target;
  const postId = target.parentElement.getAttribute('data-post-id');
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  const init = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({postId: postId})
  };

  fetch('/like', init).then((response) => {
    return response.json();
  }).then((data) => {
    const postElement = target.parentElement;
    const likeCount = postElement.querySelector('span');
    likeCount.textContent = data.likeCount;
  });
};

const deletePost = (evt) => {
  evt.preventDefault();
  const target = evt.target;
  const postId = target.parentElement.getAttribute('data-post-id');
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  const init = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({postId: postId})
  };

  fetch('/delete', init).then((response) => {
    return response.json();
  }).then((data) => {
    const postList = document.querySelector('#post-list');
    const postElement = target.parentElement;
    postList.removeChild(postElement);
  });
};

const fetchPosts = () => {
  const postsList = document.querySelector('#post-list');
  const init = { method: 'GET' };

  fetch('/posts', init).then((response) => {
    return response.json();
  }).then((data) => {
    data.forEach((post) => {
      const [author='Unknown Author', title, body, likes, id] = post;
      const postItem = document.createElement('li');
      postItem.setAttribute('data-post-id', id);

      postItem.innerHTML = `${title} by ${author}
      ${body}
      <span>${likes}</span> Likes
      <button name='like'>Like this post!</button>
      <button name='delete'>Delete</button>`;

      postsList.appendChild(postItem);

      const currentPost = document.querySelector(`li[data-post-id='${id}']`);
      const likeButton = currentPost.querySelector("button[name='like']");
      const deleteButton = currentPost.querySelector("button[name='delete']");
      likeButton.addEventListener('click', incrementLikeCount, false);
      deleteButton.addEventListener('click', deletePost, false);
    })
  });
};

fetchPosts();
