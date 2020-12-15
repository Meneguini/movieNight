document.addEventListener('DOMContentLoaded', () => {
    // adding event listener for each list icon
    document.querySelectorAll('.list-mylist').forEach(movie => {
        movie.addEventListener('click', event => deleteMovie(event))
    })
    // adding event listener for eye 
    document.querySelectorAll('.eye').forEach(eye => {
        eye.addEventListener('click', event => fetchEye(event))
    })
    // adding event listener for all stars
    document.querySelectorAll('.star').forEach(star => {
        star.addEventListener('click', event => clickedStar(event))
    })
});

function clickedStar(event) {
    // after a star is clicked check wich one was clicked
    let star = event.target.className;
    let num = 0;
    if (star == "star 1 mylist-hover") {
        num = 1;
    }
    else if (star == "star 2 mylist-hover") {
        num = 2;
    }
    else if (star == "star 3 mylist-hover") {
        num = 3;
    }
    else if (star == "star 4 mylist-hover") {
        num = 4;
    }
    else {
        num = 5;
    }
    fetchStar(num, event);
}

function fetchStar(num, event) {
    // fetch data from backend
    let id = event.target.parentElement.parentElement.children[0].innerHTML;
    const csrfToken = getCookie('csrftoken');
    fetch('/update_star', {
        method: "PUT",
        headers: {
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
            num: num,
            id: id,
        })
    })
    .then(response => response.json())
    .then(msg => {
        // update stars
        updateStar(msg.msg, event);
    })
    .catch(error => console.log(error));

    return false;
}

function updateStar(rate, event) {
    // receve new rating and update stars
    star = event.target.parentElement;

    if (rate >= 1) {
        star.children[0].style.display = 'none';
        star.children[1].style.display = 'block';
    }
    else {
        star.children[0].style.display = 'block';
        star.children[1].style.display = 'none';
    }

    if (rate >= 2) {
        star.children[2].style.display = 'none';
        star.children[3].style.display = 'block';
    }
    else {
        star.children[2].style.display = 'block';
        star.children[3].style.display = 'none';
    }

    if (rate >= 3) {
        star.children[4].style.display = 'none';
        star.children[5].style.display = 'block';
    }
    else {
        star.children[4].style.display = 'block';
        star.children[5].style.display = 'none';
    }

    if (rate >= 4) {
        star.children[6].style.display = 'none';
        star.children[7].style.display = 'block';
    }
    else {
        star.children[6].style.display = 'block';
        star.children[7].style.display = 'none';
    }

    if (rate == 5) {
        star.children[8].style.display = 'none';
        star.children[9].style.display = 'block';
    }
    else {
        star.children[8].style.display = 'block';
        star.children[9].style.display = 'none';
    }

}

function watchUnwatch(answer, event) {
    // update eye
    if (answer == "not watched") {
        event.target.style.display = 'none';
        event.target.parentElement.children[1].style.display = 'block';  
    }
    else {
        event.target.style.display = 'none';
        event.target.parentElement.children[0].style.display = 'block';  
    }
}

function fetchEye(event) {
    // fetch eye to mark if the movie was watched or not
    let id = event.target.parentElement.parentElement.children[0].innerHTML;
    const csrfToken = getCookie('csrftoken');
    fetch('/eye_update', {
        method: 'PUT',
        headers: {
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
            id: id
        })
    })
    .then(response => response.json())
    .then(msg => {
        // update eye
        watchUnwatch(msg.msg, event);
    })
    .catch(error => console.log(error));
    return false;
}

function deleteMovie(event) {
    // delete movie from user list with fetch
    const csrfToken = getCookie('csrftoken');

    fetch('/delete_movie', {
        method: 'PUT',
        headers: {
            'X-CSRFToken': csrfToken, 
        },
        body: JSON.stringify({
            movie_id: event.target.parentElement.children[0].innerHTML
        })
    })
    .then(response => response.json())
    .then(msg => {
        // update list
        updateList(msg, event.target.parentElement.parentElement);
    })
    .catch(error => console.log(error));
    return false;
}

function updateList(msg, movie) {
    // simply remove the div of the movie to update
    movie.remove();
}

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