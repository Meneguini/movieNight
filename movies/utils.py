import requests
import json
from .models import User, Movie
from django.conf import settings
import time

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
        # Getting all details of the movie with this utils function
        details = lookup_movie_detail(movie.site_id)
        id = details['id']
        # Getting details from our db
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
    url_details = 'https://api.themoviedb.org/3/movie/{}?api_key={}&language=en-US'
    response = requests.get(url_details.format(id, key)).json()
    # print(response['tagline'])
    # Looking for director name
    # url_director = 'https://api.themoviedb.org/3/movie/{}/credits?api_key={}&language=en-US'
    # response_director = requests.get(url_director.format(id, key)).json()
    # print("test", response_director['crew'][7])

    # for person in response_director['crew']:
    #     # print("director?", person['job'])
    #     if person['job'] == 'Director':
    #         # print("directooorr", person['name'])
    #         director = person['name']
    #         break

    return {
        'title': response['title'],
        'id': response['id'],
        'poster_path': response['poster_path'],
        'overview': response['overview'],
        'runtime': response['runtime'],
        'release_date': response['release_date'],
        'genres': response['genres'],
        'director': "Provisory",
        'production_countries': response['production_countries'],
        'tagline': response['tagline'],
    }


def lookup_latest_movies(page):
    start_time = time.time()
    print("[UTILS] - lookup_latest_moviees: START")
    # Getting latest movies from The movie db
    url = 'https://api.themoviedb.org/3/movie/now_playing?api_key={}&language=en-US&page={}'

    response = requests.get(url.format(key, page)).json()
    end_time = time.time()
    print("[UTILS] - lookup_latest_movies: API DONE", start_time - end_time)
    movies = response['results']
    if page > 1:
        movies = json.dumps(movies)
        # print("movies in utils ", movies)
    print("[UTILS] - lookup_latest_moviees: END")
    return movies


# api request for a specific title
def search_movie(title):
    # Searching for a specific title in The movie db api
    url = 'https://api.themoviedb.org/3/search/movie?api_key={}&query={}&language=en-US&page=1&include_adult=false'
    response = requests.get(url.format(key, title)).json()

    movie = response['results']
    movie = json.dumps(movie)

    return movie