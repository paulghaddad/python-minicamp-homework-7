const togglePostDetails = (evt) => {
  const target = evt.target;
  const postDetails = target.parentElement.querySelector('.post-details');
  postDetails.classList.toggle('hidden');
};

const incrementLikeCount = (evt) => {
  evt.preventDefault();
  const target = evt.target;
  const postId = target.parentElement.parentElement.getAttribute('data-post-id');
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  const init = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({postId: postId})
  };

  fetch('/like', init)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      const postElement = target.parentElement;
      const likeCount = postElement.querySelector('span');
      likeCount.textContent = data.likeCount;
    })
    .catch((error) => {
      console.log(error);
    });
};

const deletePost = (evt) => {
  evt.preventDefault();
  const target = evt.target;
  const postId = target.parentElement.parentElement.getAttribute('data-post-id');
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  const init = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({postId: postId})
  };

  fetch('/delete', init)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      const postList = document.querySelector('#post-list');
      const postElement = target.parentElement.parentElement;
      postList.removeChild(postElement);
    })
    .catch((error) => {
      console.log(error);
    });
};

const fetchPosts = () => {
  const postsList = document.querySelector('#post-list');
  const init = { method: 'GET' };

  fetch('/posts', init)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      data.forEach((post) => {
        const [author='Unknown Author', title, body, likes, id] = post;
        const postItem = document.createElement('li');
        postItem.setAttribute('data-post-id', id);

        postItem.innerHTML = `<span class='post-header'>${title} by ${author}</span>
        <span class='post-details hidden'>${body}
        <span class='like'>${likes}</span> Likes
        <button name='like'>Like this post!</button>
        <button name='delete'>Delete</button></span>`;

        postsList.appendChild(postItem);

        const currentPost = document.querySelector(`li[data-post-id='${id}']`);
        const postHeader = currentPost.querySelector('.post-header');
        const likeButton = currentPost.querySelector("button[name='like']");
        const deleteButton = currentPost.querySelector("button[name='delete']");
        postHeader.addEventListener('click', togglePostDetails, false);
        likeButton.addEventListener('click', incrementLikeCount, false);
        deleteButton.addEventListener('click', deletePost, false);
      })
    })
    .catch((error) => {
      console.log(error);
    });
};

fetchPosts();
