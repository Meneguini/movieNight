document.addEventListener('DOMContentLoaded', () => {
    // checking when the iframe finish loading
    let iframe = document.querySelector('.iframe');

    iframe.onload = () => {
    console.log("iframe loaded");
    }
    // checking if there is a blank list icon and adding event listener
    if (document.querySelector('.list-blank')) {
        blankList = document.querySelector('.list-blank');
        blankList.addEventListener('click', () => listClicked('blank'));
    }
    // checking if there is a filled list icon and adding event listener
    if (document.querySelector('.list-green')) {
        greenList = document.querySelector('.list-green');
        greenList.addEventListener('click', () => listClicked('green'));
    }

});

function listClicked(list) {
    // when list icon is clicked this function fetchs
    movieId = document.querySelector('.movie-details-id').innerHTML;
    title = document.querySelector('.movie-title').innerHTML;
    const csrfToken = getCookie('csrftoken');    

    fetch('add_remove_list', {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
            id: movieId,
            title: title,
            list: list,
        })
    })
    .then(response => response.json())
    .then(msg => {
        // update icons
        updateIcons(msg);
    })
    .catch(error => console.log(error));
    return false;

}

function updateIcons(msg) {
    if (msg.msg == "added") {
        document.querySelector('.list-blank').style.display = 'none';
        document.querySelector('.list-green').style.display = 'block';
        document.querySelector('.alert-success').style.display = "block";
        document.querySelector('.alert-success').innerHTML = 'Movie added to your list.';  
    }
    else {
        document.querySelector('.list-green').style.display = 'none';
        document.querySelector('.list-blank').style.display = 'block';
        document.querySelector('.alert-success').style.display = "block";
        document.querySelector('.alert-success').innerHTML = 'Movie removed from your list.';
    }
}

// Function provided by Django to acquire the token
// https://docs.djangoproject.com/en/3.1/ref/csrf/

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}