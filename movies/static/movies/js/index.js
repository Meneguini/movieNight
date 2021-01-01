document.addEventListener('DOMContentLoaded', () => {
    
    window.addEventListener('scroll', loadMore);
    window.addEventListener('scroll', scrollTop);

    document.querySelector('.btn-top').addEventListener('click', backToTop);

    // Add event listener to search btn 
    document.querySelector('.index-btn').addEventListener('click', fetchSearch);
    if (document.querySelector('.green')) {
        document.querySelectorAll('.green').forEach(movie => {
            movie.addEventListener('click', event => addToList(event, 'green'));
        })
    }
    if (document.querySelector('.blank')) {
        document.querySelectorAll('.blank').forEach(movie => {
            movie.addEventListener('click', event => addToList(event, 'blank'));
        })
    }
});

// Global variables 
let pageCounter = 1
let page = 0

// Add movie to list
function addToList(evt, list) {
    movieId = evt.target.id;
    title = evt.target.parentElement.parentElement.children[2].children[0].innerHTML;
    
    const csrfToken = getCookie('csrftoken');    

    fetch('/add_remove_list', {
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
        // update 
        updateMovieStatus(evt, msg);
    })
    .catch(error => console.log(error));
    return false;
}

// Update movie status after adding/deleting from list
function updateMovieStatus(evt, msg) {
    if (msg.msg == 'added') {
        evt.target.style.display = 'none';
        evt.target.parentElement.children[1].style.display = 'block';
    }
    if (msg.msg == 'removed') {
        evt.target.style.display = 'none';
        evt.target.parentElement.children[0].style.display = 'block';
    }
}

// Load more set at what point you will call the function with the fetch and turn off the scroll listener 
function loadMore() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 700) {
        
        if(page<=pageCounter){
           window.removeEventListener('scroll', loadMore);
        }
        fetchNext();
    }
}

// Show/hide scroll to top btn
function scrollTop() {
    btnTop = document.querySelector('.btn-top');
    // Adding event listener
    if (document.documentElement.scrollTop > 500) {
        btnTop.style.display = "block";
    } else {
        btnTop.style.display = "none";
    }
}

// After click back to function
function backToTop() {
    document.documentElement.scrollTop = 0;
}

// Fetch the movies to add in the html 
function fetchNext() {
    
    page = pageCounter + 1
        
    fetch(`/latest/${page}`)
    .then(response => response.json())
    .then(data => {
        // Update the counters and Parse the answer
        pageCounter = page;
        // data = JSON.parse(data)
        // Calling loadMovies and passing data(with movies)
        loadMovies(data);
    })
    .catch(error => console.log(error))

    return false;
}

function loadMovies(data) {
    // for each movie create the elements to add to the html using the same classes from bootstrap
    data.forEach(movieBox => {

        div = document.createElement('div');
        div.className = "col mb-4";

        divCard = document.createElement('div');
        divCard.className = "card";

        divA = document.createElement('a');
        divA.href = `movie/${movieBox.id}`;

        img = document.createElement('img');
        img.className = "card-img-top";
        if(movieBox.poster_path != null){ 
            img.src = `http://image.tmdb.org/t/p/w500//${movieBox.poster_path}`;
            divA.append(img);
        } else {
            img.src = '/static/movies/img/film.jpg';
            noPoster = document.createElement('p');
            noPoster.innerHTML = 'No poster available for this title.';
            noPoster.className = 'no-poster';
            divA.append(img, noPoster);
        }



        img.alt = "No poster";

        listDetail = '';

        if (document.querySelector('#user-logged')) {

            listDetail = document.createElement('div');
            listDetail.className = 'grey-msg';
            listStatus = document.createElement('small');
            listStatus.innerHTML = 'Add to list';
            listStatus.className = 'blank';
            listStatus.id = movieBox.id;
            listStatus.style.display = 'block';
            listStatus.addEventListener('click', event => addToList(event, 'blank'))
    
            listStatus1 = document.createElement('small');
            listStatus1.innerHTML = 'Remove from list';
            listStatus1.className = 'green';
            listStatus1.id = movieBox.id;
            listStatus1.style.display = 'none';
            listStatus1.addEventListener('click', event => addToList(event, 'green'))
    
            if (movieBox.in_list) {
                listStatus1.style.display = 'block';
                listStatus.style.display = 'none';
            }
    
            listDetail.append(listStatus, listStatus1);
        }

        divBody = document.createElement('div');
        divBody.className = "card-body";

        h5 = document.createElement('h5');
        h5.innerHTML = movieBox.title;
        h5.className = "card-title";

        p = document.createElement('p');
        p.className = "card-text";
        p.innerHTML = movieBox.release_date;

        pId = document.createElement('p');
        pId.className = "id";
        pId.innerHTML = movieBox.id;
        pId.hidden = true;

        divBody.append(h5, p, pId);
        divCard.append(divA, listDetail, divBody);
        div.append(divCard);
        document.querySelector('.movies-index').append(div);
    });
    // Add listener again
    window.addEventListener('scroll', loadMore);
}

// Check if input is not empty string
function fetchSearch() {
    inputContent = document.querySelector('.input-index').value;
    
    if (!inputContent) {
        return false;
    }

    // Fetch the content from the input and pass the result to searchedLoad
    fetch(`/search_title/${inputContent}`)
    .then(response => response.json())
    // pass answer to searchedLoad
    .then(content => searchedLoad(content))
    .catch(error => console.log("Error: ", error));
    // Empty the input
    document.querySelector('.input-index').value = '';

    return false;
}


function searchedLoad(content) {
    // Parse content
    content = JSON.parse(content);
    // Check if there is any content
    if (content.length === 0) {
        return false;
    }
    // Empty the movies in the index page to load the searched ones
    document.querySelector('.movies-index').innerHTML = '';
    loadMovies(content);
    // Cancel the infinite scroll
    window.removeEventListener('scroll', loadMore);
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