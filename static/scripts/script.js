const incrementLikeCount = (evt) => {
  evt.preventDefault();
  const target = evt.target;
  const postId = target.getAttribute('data-post-id');
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

const fetchPosts = () => {
  const postsList = document.querySelector('#post-list');
  const init = { method: 'GET' };

  fetch('/posts', init).then((response) => {
    return response.json();
  }).then((data) => {
    data.forEach((post) => {
      const [author='Unknown Author', title, body, likes, id] = post;
      const postItem = document.createElement('li');

      postItem.innerHTML = `${title} by ${author}
      ${body}
      <span>${likes}</span> Likes
      <button name='like' data-post-id='${id}'>Like this post!</button>`;

      postsList.appendChild(postItem);

      const likeButton = document.querySelector(`button[data-post-id='${id}']`);
      likeButton.addEventListener('click', incrementLikeCount, false);
    })
  });
};

fetchPosts();
