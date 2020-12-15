import requests
import json
from .models import User, Movie
from django.conf import settings

# get api key from settings
key = settings.MOVIE_KEY

def lookup_trailer(id):
    # Query The movie db for the path for youtube videos
    url = ' https://api.themoviedb.org/3/movie/{}/videos?api_key={}&language=en-US'
    response = requests.get(url.format(id, key)).json()
    result = response['results']
    if result == []:
        trailer_site = False
        trailer_id = False
        return trailer_id, trailer_site

    trailer_site = result[0]['site']
    trailer_id = result[0]['key']

    return trailer_id, trailer_site


def movie_list(list, user):
    # Getting the movie list of user logged
    final_list = []

    for movie in list:
        # Getting all details of the movie with this function that will query from the movie api
        details = lookup_movie_detail(movie.site_id)
        # Getting details from our db, such as if it was watched and how many stars
        try:
            movie_check = Movie.objects.filter(list_owner=user, site_id=details['id'])
        except:
            movie_check = "error"
            return movie_check
        # organizing all information in this dict
        temp_details = {
            "id": details['id'],
            "poster_path": details['poster_path'],
            "title": details['title'],
            "genres": details['genres'],
            "release_date": details['release_date'],
            "stars": movie_check[0].rate,
            "watched": movie_check[0].watched,
            "eye": "block"
        }

        final_list.append(temp_details)

    return final_list


def lookup_movie_detail(id):
    # This function lookup movie details querying from The movie db
    url = 'https://api.themoviedb.org/3/movie/{}?api_key={}&language=en-US'
    response = requests.get(url.format(id, key)).json()

    return response
    

def lookup_latest_movies(page):
    # Getting latest movies from The movie db
    url = 'https://api.themoviedb.org/3/movie/now_playing?api_key={}&language=en-US&page={}'

    response = requests.get(url.format(key, page)).json()
        
    movies = response['results']
    
    # If more than one page the request came from js. So the results need to be in json string before giving back to the view
    if page > 1:
        movies = json.dumps(movies)
        # print("movies in utils ", movies)

    return movies


# api request for a specific title
def search_movie(title):
    # Searching for a specific title in The movie db api
    url = 'https://api.themoviedb.org/3/search/movie?api_key={}&query={}&language=en-US&page=1&include_adult=false'
    response = requests.get(url.format(key, title)).json()

    movie = response['results']
    movie = json.dumps(movie)

    return movie