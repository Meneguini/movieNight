document.addEventListener('DOMContentLoaded', () => {
    
    getMoviesList();
});

function getMoviesList() {
    listOwner = document.querySelector('.user-list-name').innerHTML;
      
    fetch(`/list_movies/${listOwner}`)
    .then(response => response.json())
    .then(data => {
        loadMovies(data);
    })
    .catch(error => console.log(error));

    return false;
}

function loadMovies(list) {
    document.querySelector('.spinner-box').remove();

    if (list.movies.length < 1) {
        textEmpty = document.createElement('h3');
        textEmpty.innerHTML = 'Your list is empty!';
        document.querySelector('.empty-list-div').append(textEmpty);
        document.querySelector('.empty-list-div').style.display = 'block';
        return 
    }

    list.movies.forEach(movie => {
        aPoster = document.createElement('a');
        aPoster.href = `movie/${movie.id}`;

        imgPoster = document.createElement('img');
        imgPoster.className = 'card-img-top';
        if (movie.poster_path) {
            imgPoster.src = `https://image.tmdb.org/t/p/w500//${movie.poster_path}`;
            imgPoster.alt = 'Poster';
            aPoster.append(imgPoster);
        }
        else {
            imgPoster = document.createElement('img');
            imgPoster.src = `/static/movies/img/film.jpg`;
            imgPoster.alt = 'No Poster';
            imgPoster.className = 'card-img-top';
            noPoster = document.createElement('p');
            noPoster.innerHTML = 'No poster available for this title.';
            noPoster.className = 'no-poster';
            aPoster.append(imgPoster, noPoster);
        }


        
        divStarBox = document.createElement('div');
        divStarBox.className = 'star-box';

        // first star
        imgOneEmpty = document.createElement('img');
        imgOneEmpty.src = '/static/movies/icons/star.png';
        imgOneEmpty.alt = 'star';
        imgOneEmpty.className = 'star';

        imgOneFilled = document.createElement('img');
        imgOneFilled.src = '/static/movies/icons/star(1).png';
        imgOneFilled.alt = 'star';
        imgOneFilled.className = 'star';

        if (movie.stars == 0) {
            imgOneFilled.style.display = 'none';  
        }
        else if(movie.stars >= 1) {
            imgOneEmpty.style.display = 'none';
            imgOneFilled.style.display = 'block';
        }

        if (list.user_list == list.user_logged) {
            imgOneEmpty.className = 'star 1 mylist-hover';
            imgOneEmpty.id = `${movie.id}`;
            imgOneEmpty.addEventListener('click', event => clickedStar(event));
            imgOneFilled.className = 'star 1 mylist-hover';
            imgOneFilled.id = `${movie.id}`;
            imgOneFilled.addEventListener('click', event => clickedStar(event));
        }

        // second star
        imgTwoEmpty = document.createElement('img');
        imgTwoEmpty.src = '/static/movies/icons/star.png';
        imgTwoEmpty.alt = 'star';
        imgTwoEmpty.className = 'star';

        imgTwoFilled = document.createElement('img');
        imgTwoFilled.src = '/static/movies/icons/star(1).png';
        imgTwoFilled.alt = 'star';
        imgTwoFilled.className = 'star';

        if (movie.stars < 2) {
            imgTwoFilled.style.display = 'none';
        }
        else if(movie.stars > 1) {
            imgTwoEmpty.style.display = 'none';
            imgTwoFilled.style.display = 'block';
        }

        if (list.user_list == list.user_logged) {
            imgTwoEmpty.className = 'star 2 mylist-hover';
            imgTwoEmpty.id = `${movie.id}`;
            imgTwoEmpty.addEventListener('click', event => clickedStar(event));
            imgTwoFilled.className = 'star 2 mylist-hover';
            imgTwoFilled.id = `${movie.id}`;
            imgTwoFilled.addEventListener('click', event => clickedStar(event));
        }

        // third star
        imgThreeEmpty = document.createElement('img');
        imgThreeEmpty.src = '/static/movies/icons/star.png';
        imgThreeEmpty.alt = 'star';
        imgThreeEmpty.className = 'star';

        imgThreeFilled = document.createElement('img');
        imgThreeFilled.src = '/static/movies/icons/star(1).png';
        imgThreeFilled.alt = 'star';
        imgThreeFilled.className = 'star';

        if (movie.stars < 3) {
            imgThreeFilled.style.display = 'none';
        }
        else if(movie.stars > 2) {
            imgThreeEmpty.style.display = 'none';
            imgThreeFilled.style.display = 'block';
        }

        if (list.user_list == list.user_logged) {
            imgThreeEmpty.className = 'star 3 mylist-hover';
            imgThreeEmpty.id = `${movie.id}`;
            imgThreeEmpty.addEventListener('click', event => clickedStar(event));
            imgThreeFilled.className = 'star 3 mylist-hover';
            imgThreeFilled.id = `${movie.id}`;
            imgThreeFilled.addEventListener('click', event => clickedStar(event));
        }

        // Fourth star
        imgFourEmpty = document.createElement('img');
        imgFourEmpty.src = '/static/movies/icons/star.png';
        imgFourEmpty.alt = 'star';
        imgFourEmpty.className = 'star';

        imgFourFilled = document.createElement('img');
        imgFourFilled.src = '/static/movies/icons/star(1).png';
        imgFourFilled.alt = 'star';
        imgFourFilled.className = 'star';

        if (movie.stars < 4) {
            imgFourFilled.style.display = 'none';
        }
        else if(movie.stars > 3) {
            imgFourEmpty.style.display = 'none';
            imgFourFilled.style.display = 'block';
        }

        if (list.user_list == list.user_logged) {
            imgFourEmpty.className = 'star 4 mylist-hover';
            imgFourEmpty.id = `${movie.id}`;
            imgFourEmpty.addEventListener('click', event => clickedStar(event));
            imgFourFilled.className = 'star 4 mylist-hover';
            imgFourFilled.id = `${movie.id}`;
            imgFourFilled.addEventListener('click', event => clickedStar(event));
        }

        // Fifth star

        imgFiveEmpty = document.createElement('img');
        imgFiveEmpty.src = '/static/movies/icons/star.png';
        imgFiveEmpty.alt = 'star';
        imgFiveEmpty.className = 'star';

        imgFiveFilled = document.createElement('img');
        imgFiveFilled.src = '/static/movies/icons/star(1).png';
        imgFiveFilled.alt = 'star';
        imgFiveFilled.className = 'star';

        if (movie.stars < 5) {
            imgFiveFilled.style.display = 'none';
        }
        else if(movie.stars == 5) {
            imgFiveEmpty.style.display = 'none';
            imgFiveFilled.style.display = 'block';
        }

        if (list.user_list == list.user_logged) {
            imgFiveEmpty.className = 'star 5 mylist-hover';
            imgFiveEmpty.id = `${movie.id}`;
            imgFiveEmpty.addEventListener('click', event => clickedStar(event));
            imgFiveFilled.className = 'star 5 mylist-hover';
            imgFiveFilled.id = `${movie.id}`;
            imgFiveFilled.addEventListener('click', event => clickedStar(event));
        }

        if (list.user_list == list.user_logged) {
            spanTip = document.createElement('span');
            spanTip.innerHTML = 'Rate';
            spanTip.className = 'tip-del';
            divStarBox.append(imgOneEmpty, imgOneFilled, imgTwoEmpty, imgTwoFilled, imgThreeEmpty, imgThreeFilled, imgFourEmpty, imgFourFilled, imgFiveEmpty, imgFiveFilled, spanTip);
        }
        else {
            divStarBox.append(imgOneEmpty, imgOneFilled, imgTwoEmpty, imgTwoFilled, imgThreeEmpty, imgThreeFilled, imgFourEmpty, imgFourFilled, imgFiveEmpty, imgFiveFilled);
        }




        divDelTip = document.createElement('div');
        divDelTip.className = 'del-tip';

        imgDel = document.createElement('img');
        imgDel.alt = 'Delete movie from list';
        imgDel.src = '/static/movies/icons/remove.png';
        imgDel.className = 'list-mylist';
        imgDel.id = `${movie.id}`;
        imgDel.addEventListener('click', event => deleteMovie(event))

        if (list.user_list == list.user_logged) {
            imgDel.className = 'list-mylist mylist-hover';
            spantip2 = document.createElement('span');
            spantip2.innerHTML = 'Delete movie';
            spantip2.className = 'tip-del';
            divDelTip.append(imgDel, spantip2);
        }

        divStarDel = document.createElement('div');
        divStarDel.className = 'stars-del';

        divStarDel.append( divStarBox, divDelTip);

        divCardBody = document.createElement('div');
        divCardBody.className = 'card-body-mylist';

        divCardBody.append(divStarDel);

        divCard = document.createElement('div');
        divCard.className = 'card card-mylist h-100';

        divCard.append(aPoster, divCardBody);

        divCol = document.createElement('div');
        divCol.className = 'col mb-4';

        divCol.append(divCard);

        document.querySelector('.add-movies-list').append(divCol);

    });
}



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
    // let id = event.target.parentElement.parentElement.children[0].innerHTML;
    let id = event.target.id;
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
    // Receive new rating and update stars
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


function deleteMovie(event) {
    // delete movie from user list with fetch
    const csrfToken = getCookie('csrftoken');

    fetch('/delete_movie', {
        method: 'PUT',
        headers: {
            'X-CSRFToken': csrfToken, 
        },
        body: JSON.stringify({
            movie_id: event.target.id,
        })
    })
    .then(response => response.json())
    .then(msg => {
        // update list
        updateList(msg, event.target.parentElement.parentElement.parentElement.parentElement.parentElement);
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