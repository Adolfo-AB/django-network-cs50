document.addEventListener('DOMContentLoaded', function() {

    console.log("DOM Content Loaded Successfully")
    // Toggle between views when clicking on the links
    
    // By default, load the all posts view
    load_all_posts_view(1);

    document.querySelector('#all-posts').addEventListener('click', () => load_all_posts_view(1));

    // These 2 views are only available when the user is logged in
    try {
        document.querySelector('#following').addEventListener('click', () => load_following_posts_view(1));
        const userProfileLink = document.querySelector('#user-profile')
        const username = userProfileLink.innerHTML;
        console.log(username);
        userProfileLink.addEventListener('click', () => load_profile_view(username, 1));
    } catch (error) {
        console.log(error);
    }
  });

  async function load_all_posts_view(page_number) {
  
    // Load all posts view
    document.querySelector('#all-posts-view').style.display = 'block';
    // Hide other views
    document.querySelector('#following-posts-view').style.display = 'none';
    document.querySelector('#profile-view').style.display = 'none';

    const parentAll = document.querySelector("#all-posts-container")
    while (parentAll.firstChild) {
      parentAll.removeChild(parentAll.lastChild);
    }

    const parentFollowing = document.querySelector("#following-posts-container")
    while (parentFollowing.firstChild) {
      parentFollowing.removeChild(parentFollowing.lastChild);
    }

    const parentProfile = document.querySelector("#profile-posts-container")
    while (parentProfile.firstChild) {
      parentProfile.removeChild(parentProfile.lastChild);
    }

    // If the user is logged in, create the New Post components
    if (document.getElementById('log-out')) {
      console.log("User logged in.")
      create_new_post_components();

      document.querySelector('#submit-post-btn').disabled = true;
      document.querySelector('#new-post-content').onkeyup = () => {
        if (document.querySelector('#new-post-content').value.length >0) {
            document.querySelector('#submit-post-btn').disabled = false;
        } else {
            document.querySelector('#submit-post-btn').disabled = true
        }
      }

      submitBtn = document.getElementById("submit-post-btn");
      submitBtn.addEventListener('click', () => {
        console.log("New Post button clicked.")
        const content = document.getElementById("new-post-content").value;
        console.log(content)
        fetch('/add', {
          method: 'POST',
          body: JSON.stringify({
            content: content
          })
        })
      })
    }
    await get_posts("all",page_number);

    const nav = document.createElement('nav');
    nav.ariaLabel = "Page navigation";
    nav.className = "navi";

    const ulPagination = document.createElement('ul');
    ulPagination.className = "pagination";
    nav.append(ulPagination);

    const number_posts = document.querySelectorAll(".card-body").length
    if (number_posts == 10) {
      const liNext = document.createElement('li');
      liNext.className = "page-link";
      liNext.innerHTML = "Next";
      ulPagination.append(liNext);
      liNext.addEventListener('click', () => load_all_posts_view(page_number+1));
    }

    if (page_number != 1) {
      const liPrev = document.createElement('li');
      liPrev.className = "page-link";
      liPrev.innerHTML = "Previous";
      ulPagination.append(liPrev);
      liPrev.addEventListener('click', () => load_all_posts_view(page_number-1));
    }

    document.querySelector('#all-posts-container').append(nav);

}

  async function load_following_posts_view(page_number) {
    // Hide other views
    document.querySelector('#all-posts-view').style.display = 'none';
    document.querySelector('#profile-view').style.display = 'none';
  
    // Load following posts view
    document.querySelector('#following-posts-view').style.display = 'block';

    const parentAll = document.querySelector("#all-posts-container")
    while (parentAll.firstChild) {
      parentAll.removeChild(parentAll.lastChild);
    }

    const parentFollowing = document.querySelector("#following-posts-container")
    while (parentFollowing.firstChild) {
      parentFollowing.removeChild(parentFollowing.lastChild);
    }

    const parentProfile = document.querySelector("#profile-posts-container")
    while (parentProfile.firstChild) {
      parentProfile.removeChild(parentProfile.lastChild);
    }

    await get_posts("following", page_number);

    const nav = document.createElement('nav');
    nav.ariaLabel = "Page navigation";
    nav.className = "navi";

    const ulPagination = document.createElement('ul');
    ulPagination.className = "pagination";
    nav.append(ulPagination);

    const number_posts = document.querySelectorAll(".card-body").length
    console.log(`aksjajhsa: ${number_posts}`)
    if (number_posts >= 10) {
      const liNext = document.createElement('li');
      liNext.className = "page-link";
      liNext.innerHTML = "Next";
      ulPagination.append(liNext);
      liNext.addEventListener('click', () => load_following_posts_view(page_number+1));
    }


    if (page_number != 1) {
      const liPrev = document.createElement('li');
      liPrev.className = "page-link";
      liPrev.innerHTML = "Previous";
      ulPagination.append(liPrev);
      liPrev.addEventListener('click', () => load_following_posts_view(page_number-1));
    }

    document.querySelector('#following-posts-container').append(nav);
    
  }

  async function load_profile_view(username, page_number) {
    // Load profile view
    document.querySelector('#profile-view').style.display = 'block';

    // Hide other views
    document.querySelector('#following-posts-view').style.display = 'none';
    document.querySelector('#all-posts-view').style.display = 'none';
    
    console.log("Profile loaded successfully")
    

    document.querySelector('#profile-header').innerHTML = `User Profile: <strong>${username}</strong>`;

    console.log("Before generating posts.")
    const parentAll = document.querySelector("#all-posts-container")
    while (parentAll.firstChild) {
      parentAll.removeChild(parentAll.lastChild);
    }

    const parentFollowing = document.querySelector("#following-posts-container")
    while (parentFollowing.firstChild) {
      parentFollowing.removeChild(parentFollowing.lastChild);
    }

    const parentProfile = document.querySelector("#profile-posts-container")
    while (parentProfile.firstChild) {
      parentProfile.removeChild(parentProfile.lastChild);
    }

    await get_profile_posts(username, page_number);

    if ((document.querySelector("#follow-btn") == null) && (document.querySelector("#followers-p") == null)) {
      const followBtn = document.createElement('button');
      followBtn.id = "follow-btn";
      followBtn.className = "btn btn-primary";

      const numberFollowers = document.createElement('p');
      numberFollowers.id = "followers-p";
      const numberFollowing = document.createElement('p');
      numberFollowing.id = "following-p";
      
      fetch(`/profile/${username}/getprofiledata`)
      .then(response => response.json())
      .then(response => {
        numberFollowers.innerHTML = `Followers: ${response.followers}`;
        numberFollowing.innerHTML = `Following: ${response.following}`;
        console.log(response)
      })


      fetch(`/profile/${username}/getstatus`)
      .then(response => response.json())
      .then(response => {
        if (response.follower) {
          followBtn.innerHTML = "Unfollow"
        } else {
          followBtn.innerHTML = "Follow"
        }
        
      })

      if ((document.getElementById('log-out')) 
      && (document.querySelector("#user-profile").innerHTML != document.querySelector(`#post-author-${username}`).innerHTML)) {
        document.querySelector('#follow-container').append(followBtn);
      }

      document.querySelector('#follow-container').append(numberFollowers);
      document.querySelector('#follow-container').append(numberFollowing);

      followBtn.addEventListener('click', () => update_follow_status(username))
    }

    const nav = document.createElement('nav');
    nav.ariaLabel = "Page navigation";
    nav.className = "navi";

    const ulPagination = document.createElement('ul');
    ulPagination.className = "pagination";
    nav.append(ulPagination);

    const number_posts = document.querySelectorAll(".card-body").length
    if (number_posts >= 10) {
      const liNext = document.createElement('li');
      liNext.className = "page-link";
      liNext.innerHTML = "Next";
      ulPagination.append(liNext);
      liNext.addEventListener('click', () => load_profile_view(username, page_number+1));
    }

    if (page_number != 1) {
      const liPrev = document.createElement('li');
      liPrev.className = "page-link";
      liPrev.innerHTML = "Previous";
      ulPagination.append(liPrev);
      liPrev.addEventListener('click', () => load_profile_view(username, page_number-1));
    }

    document.querySelector("#profile-posts-container").append(nav);
  }

  async function update_follow_status(username) {
    fetch(`/profile/${username}/follow`)
    .then(response => response.json())
    .then(response => {
        console.log("Follow status updated successfully.");
        console.log(response);
        })
    .then(() => {
      const followBtn = document.querySelector("#follow-btn");
      fetch(`/profile/${username}/getstatus`)
    .then(response => response.json())
    .then(response => {
      if (response.follower) {
        followBtn.innerHTML = "Unfollow"
      } else {
        followBtn.innerHTML = "Follow"
      }
    })
    .then(() => {
      const numberFollowers = document.querySelector("#followers-p");
      const numberFollowing = document.querySelector("#following-p");
      fetch(`/profile/${username}/getprofiledata`)
      .then(response => response.json())
      .then(response => {
        numberFollowers.innerHTML = `Followers: ${response.followers}`;
        numberFollowing.innerHTML = `Following: ${response.following}`;
        console.log(response)
      })
    })
  })
}

  function create_new_post_components() {

    const parent = document.querySelector("#new-post")
    while (parent.firstChild) {
      parent.removeChild(parent.lastChild);
    }

    const container = document.createElement('div');
    container.className = "container";

    const header = document.createElement('h4');
    header.innerHTML = "New Post";
    container.append(header);

    const form = document.createElement('form');
    container.append(form);

    const formGroup = document.createElement('div');
    formGroup.className = "form-group";
    form.append(formGroup);

    const textArea = document.createElement('textarea');
    textArea.id = "new-post-content";
    textArea.className = "form-control";
    textArea.autofocus = "autofocus";
    textArea.cols = "20";
    textArea.rows = "4";
    textArea.placeholder = "What are you thinking about?";
    textArea.maxLength = "280";
    formGroup.append(textArea);

    const submit = document.createElement('input');
    submit.id = "submit-post-btn";
    submit.className = "btn btn-primary";
    submit.type = "submit";
    submit.value = "Post";
    form.append(submit);

    document.querySelector('#new-post').append(container);
  }

  async function get_number_posts(page) {
    await fetch(`/getposts/${page}`)
    .then(response => response.json())
    .then(posts => {
        return posts.length;
        });
  }

  async function get_number_posts_profile(username) {
    await fetch(`/getpostsprofile/${username}`)
    .then(response => response.json())
    .then(posts => {
        return posts.length;
        });
  }

  async function get_posts(page, page_number) {
    await fetch(`/posts/${page}/${page_number}`)
    .then(response => response.json())
    .then(posts => {
        console.log("All posts fetched successfully.");
        console.log(posts);
        posts.forEach(post => load(post, page));
        });
  }

  async function get_profile_posts(username, page_number) {
    console.log("Getting posts...")
    await fetch(`/profile/${username}/${page_number}`)
    .then(response => response.json())
    .then(posts => {
        console.log("Profile posts fetched successfully.");
        console.log(posts);
        posts.forEach(post => load(post, "profile"));
        });
  }

  function load(post, page) {
    const cardDiv = document.createElement('div')
    cardDiv.className = "card mb-1"

    const rowDiv = document.createElement('div')
    rowDiv.className = "row no-gutter"
    cardDiv.append(rowDiv)

    const colDiv = document.createElement('div')
    colDiv.className = "col-md-11"
    rowDiv.append(colDiv)

    const cardBodyDiv = document.createElement('div')
    cardBodyDiv.className = "card-body"
    colDiv.append(cardBodyDiv)

    const postAuthor = document.createElement('a')
    postAuthor.id = `post-author-${post.author_username}`;
    postAuthor.className = "card-author";
    postAuthor.href = "#";
    postAuthor.innerHTML = post.author_username;
    postAuthor.addEventListener('click', () => load_profile_view(post.author_username,1));
    cardBodyDiv.append(postAuthor)

    const postContent = document.createElement('p')
    postContent.id = `post-content-${post.id}`
    postContent.className = "card-content"
    postContent.innerHTML = post.content
    cardBodyDiv.append(postContent)

    const postDateTime = document.createElement('p')
    postDateTime.className = "card-datetime"
    postDateTime.innerHTML = post.datetime
    cardBodyDiv.append(postDateTime)

    const numberOfLikes = document.createElement('a')
    numberOfLikes.id = `number-likes-${post.id}`
    numberOfLikes.innerHTML = `${post.likes}  `
    cardBodyDiv.append(numberOfLikes)

    const likeIcon = document.createElement('i')
    likeIcon.id = `like-icon-${post.id}`
    get_like_status(post, likeIcon)
    if (document.getElementById('following')) {
      likeIcon.addEventListener('click', () => update_like(post, likeIcon));
    }
    cardBodyDiv.append(likeIcon)

    const hr = document.createElement('hr')
    cardBodyDiv.append(hr)

    if ((document.getElementById('log-out')) 
      && (document.querySelector("#user-profile").innerHTML == post.author_username)) {
        const editPost = document.createElement('a')
        editPost.id = `edit-post-${post.id}`;
        editPost.className = "card-edit";
        editPost.href = "#";
        editPost.innerHTML = "Edit";
        editPost.addEventListener('click', () => edit_post(post, page, cardBodyDiv));
        cardBodyDiv.append(editPost)
      }

    if (page === "all") {
      document.querySelector('#all-posts-container').append(cardDiv);
    } else if (page === "profile") {
      document.querySelector('#profile-posts-container').append(cardDiv);
    } else if (page === "following") {
      document.querySelector('#following-posts-container').append(cardDiv);
    }

  }

  async function edit_post(post, page, cardBodyDiv) {
    while (cardBodyDiv.firstChild) {
      cardBodyDiv.removeChild(cardBodyDiv.lastChild);
    }

    const postAuthor = document.createElement('a')
    postAuthor.id = `post-author-${post.author_username}`;
    postAuthor.className = "card-author";
    postAuthor.href = "#";
    postAuthor.innerHTML = post.author_username;
    postAuthor.addEventListener('click', () => load_profile_view(post.author_username,1));
    cardBodyDiv.append(postAuthor)

    const textArea = document.createElement('textarea');
    textArea.id = `edit-post-content-${post.id}`;
    textArea.className = "form-control";
    textArea.autofocus = "autofocus";
    textArea.cols = "10";
    textArea.style.border = "none";
    textArea.rows = "4";
    textArea.maxLength = "280";
    textArea.value = post.content
    cardBodyDiv.append(textArea)

    const postDateTime = document.createElement('p')
    postDateTime.className = "card-datetime"
    postDateTime.innerHTML = post.datetime
    cardBodyDiv.append(postDateTime)

    const numberOfLikes = document.createElement('a')
    numberOfLikes.id = `number-likes-${post.id}`
    numberOfLikes.innerHTML = `${post.likes}  `
    cardBodyDiv.append(numberOfLikes)

    const likeIcon = document.createElement('i')
    likeIcon.id = `like-icon-${post.id}`
    get_like_status(post, likeIcon)
    if (document.getElementById('following')) {
      likeIcon.addEventListener('click', () => update_like(post, likeIcon));
    }
    cardBodyDiv.append(likeIcon)

    const hr = document.createElement('hr')
    cardBodyDiv.append(hr)

    const saveEdit = document.createElement('a')
    saveEdit.id = `save-edit-post-${post.id}`;
    saveEdit.className = "card-save-edit";
    saveEdit.href = "#";
    saveEdit.innerHTML = "Save";
    saveEdit.addEventListener('click', () => save_edit(post, page, cardBodyDiv));
    cardBodyDiv.append(saveEdit)
  }

  async function save_edit(post, page, cardBodyDiv) {
    const content = document.querySelector(`#edit-post-content-${post.id}`).value;
    await fetch(`/saveedit/${post.id}`, {
      method: 'PUT',
      body: body = JSON.stringify({
          content: content
      })})
      .then(response => response.json())
      .then(response => {
        while (cardBodyDiv.firstChild) {
          cardBodyDiv.removeChild(cardBodyDiv.lastChild);
        }

      const postAuthor = document.createElement('a')
      postAuthor.id = `post-author-${post.author_username}`;
      postAuthor.className = "card-author";
      postAuthor.href = "#";
      postAuthor.innerHTML = post.author_username;
      postAuthor.addEventListener('click', () => load_profile_view(post.author_username,1));
      cardBodyDiv.append(postAuthor)

      const postContent = document.createElement('p')
      postContent.id = `post-content-${post.id}`
      postContent.className = "card-content"
      postContent.innerHTML = content
      cardBodyDiv.append(postContent)

      const postDateTime = document.createElement('p')
      postDateTime.className = "card-datetime"
      postDateTime.innerHTML = post.datetime
      cardBodyDiv.append(postDateTime)

      const numberOfLikes = document.createElement('a')
      numberOfLikes.id = `number-likes-${post.id}`
      numberOfLikes.innerHTML = `${post.likes}  `
      cardBodyDiv.append(numberOfLikes)

      const likeIcon = document.createElement('i')
      likeIcon.id = `like-icon-${post.id}`
      get_like_status(post, likeIcon)
      if (document.getElementById('following')) {
        likeIcon.addEventListener('click', () => update_like(post, likeIcon));
      }
      cardBodyDiv.append(likeIcon)

      const hr = document.createElement('hr')
      cardBodyDiv.append(hr)

      if ((document.getElementById('log-out')) 
      && (document.querySelector("#user-profile").innerHTML == post.author_username)) {
        const editPost = document.createElement('a')
        editPost.id = `edit-post-${post.id}`;
        editPost.className = "card-edit";
        editPost.href = "#";
        editPost.innerHTML = "Edit";
        editPost.addEventListener('click', () => edit_post(post, page, cardBodyDiv));
        cardBodyDiv.append(editPost)
      }

      })
  }

  async function get_like_status(post, likeIcon) {
    console.log("Getting posts like status...")
    await fetch(`/getlikestatus/${post.id}`)
    .then(response => response.json())
    .then(response => {
      if (response.likes) {
        likeIcon.className = `bi bi-suit-heart-fill`;
      } else {
        likeIcon.className = `bi bi-suit-heart`;
      }
      });
  }

  async function update_like(post, likeIcon) {
    const numberOfLikes = document.querySelector(`#number-likes-${post.id}`)
    console.log("Getting posts like status...")
    await fetch(`/updatelike/${post.id}`)
    .then(response => response.json())
    .then(response => {
      if (likeIcon.className == `bi bi-suit-heart-fill`) {
        likeIcon.className = `bi bi-suit-heart`;
        post.likes = post.likes-1
        numberOfLikes.innerHTML = `${post.likes}  `
      } else {
        likeIcon.className = `bi bi-suit-heart-fill`;
        post.likes = post.likes+1
        numberOfLikes.innerHTML = `${post.likes}  `
      }
      });
  }