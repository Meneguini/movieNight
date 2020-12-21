document.addEventListener('DOMContentLoaded', () => {
    console.log("loaded");
    // When document is loaded add scroll listener and call loadMore
    window.addEventListener("scroll", () => {
        loadMore();
        // check sytle display of back to top button
        scrollTop();
    });

    document.querySelector('.btn-top').addEventListener('click', backToTop);
    // add event listener to search btn 
    document.querySelector('.index-btn').addEventListener('click', fetchSearch);
});

// Global variables 
let pageCounter = 1
let page = 0

// Load more set at what point you will call the function with the fetch and turn off the scroll listener 
function loadMore() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        
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
        // Parse the answer
        data = JSON.parse(data)
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

        divCard = document.createElement('a');
        divCard.href = `movie/${movieBox.id}`;
        divCard.className = "card";

        img = document.createElement('img');
        if(movieBox.poster_path != null){ 
            img.src = `http://image.tmdb.org/t/p/w500//${movieBox.poster_path}`;
            img.className = "card-img-top";
        } else {
            console.log("img not loaded in creation");
            img.src = '/static/movies/icons/file(1).png';
            img.className = "no-img";
        }

        img.alt = "No poster";

        divBody = document.createElement('div');
        divBody.className = "card-body";

        h5 = document.createElement('h5');
        h5.innerHTML = movieBox.title;
        h5.className = "card-title";

        p = document.createElement('p');
        p.className = "card-text";
        p.innerHTML = 'Released: ' + movieBox.release_date;

        pId = document.createElement('p');
        pId.className = "id";
        pId.innerHTML = movieBox.id;
        pId.hidden = true;

        divBody.append(h5, p, pId);
        divCard.append(img, divBody);
        div.append(divCard);
        document.querySelector('.movies-index').append(div);
    });
    // update pageCounter and add listener for scroll again
    pageCounter = page;
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