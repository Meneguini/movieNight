import requests
import json
from .models import Movie
from django.conf import settings


# get api key from settings
key = settings.MOVIE_KEY


def movie_list(list, user):
    # Getting the movie list of user logged
    final_list = []
    for movie in list:
        # Getting all details of the movie with this utils function

        url = 'https://api.themoviedb.org/3/movie/{}?api_key={}&language=en-US'
        details = requests.get(url.format(movie.site_id, key)).json()
        id = details['id']
        # Getting stars from our db
        try:
            movie_check = Movie.objects.filter(list_owner=user, site_id=id)
        except Exception:
            movie_check = "error"
            return movie_check
        # organizing all information in this dict
        temp_details = {
            "id": details['id'],
            "poster_path": details['poster_path'],
            "title": details['title'],
            "stars": movie_check[0].rate,
        }

        final_list.append(temp_details)

    return final_list


def lookup_movie_detail(id):
    # Querying The movie db, subqueries included

    url_details = 'https://api.themoviedb.org/3/movie/{}?api_key={}&append_to_response=credits,videos&language=en-US'
    response = requests.get(url_details.format(id, key)).json()

    director = []

    for person in response['credits']['crew']:
        if person['job'] == 'Director':
            director.append(person['name'])

    return {
        'title': response['title'],
        'id': response['id'],
        'poster_path': response['poster_path'],
        'overview': response['overview'],
        'runtime': response['runtime'],
        'release_date': response['release_date'],
        'genres': response['genres'],
        'director': director,
        'production_countries': response['production_countries'],
        'tagline': response['tagline'],
        'trailer_site': response['videos']['results'][0]['site'],
        'trailer_id': response['videos']['results'][0]['key']
    }


def lookup_latest_movies(page, user):

    # Getting latest movies from The movie db
    url = 'https://api.themoviedb.org/3/movie/now_playing?api_key={}&language=en-US&page={}'

    response = requests.get(url.format(key, page)).json()

    movies = []
    for movie in response['results']:

        try:
            in_list = Movie.objects.get(list_owner=user, site_id=movie['id'])
            in_list = True
        except Exception:
            in_list = False

        movie_data = {
            "id": movie['id'],
            "title": movie['title'],
            "poster_path": movie['poster_path'],
            "release_date": movie['release_date'],
            "in_list": in_list
        }
        movies.append(movie_data)

    return movies


# api request for a specific title
def search_movie(title):
    # Searching for a specific title in The movie db api
    url = 'https://api.themoviedb.org/3/search/movie?api_key={}&query={}&language=en-US&page=1&include_adult=false'
    response = requests.get(url.format(key, title)).json()

    movie = response['results']
    movie = json.dumps(movie)

    return movie