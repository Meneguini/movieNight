from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.shortcuts import render, reverse
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.contrib.auth.decorators import login_required
import json

from . import utils
# from django.contrib.auth.models import User
from .models import Movie, User


@login_required
def update_star(request):
    if request.method != 'PUT':
        return JsonResponse({"error": "Not a PUT request"}, status=405)
    # Getting the data from frontend
    data = json.loads(request.body)
    num = int(data.get("num"))
    id = data.get("id")
    # Trying to query the specific movie in the list of the logged user
    try:
        movie = Movie.objects.get(list_owner=request.user, site_id=id)
        # If the actual rate in the db is the same as the one comming from
        # the user it means that you need to update to 0
        if movie.rate == 1 and num == 1:
            num = 0
        movie.rate = num
        movie.save()
    except Exception:
        return JsonResponse({"error": "Stars not updated."}, status=500)

    return JsonResponse({"msg": movie.rate}, status=200)


@login_required
def eye_update(request):
    if request.method != 'PUT':
        return JsonResponse({"error": "Not a PUT request"}, status=405)

    data = json.loads(request.body)
    id = data.get("id")
    try:
        movie = Movie.objects.get(list_owner=request.user, site_id=id)

        if movie.watched is False:
            movie.watched = True
            movie.save()
            return JsonResponse({"msg": "watched"}, status=200)
    except Exception:
        return JsonResponse({"error": "Not able to update eye!"}, status=500)

    movie.watched = False
    movie.save()
    return JsonResponse({"msg": "not watched"}, status=200)


@login_required
def delete_movie(request):
    if request.method != 'PUT':
        return JsonResponse({"error": "Method not PUT"}, status=405)

    data = json.loads(request.body)
    id = data.get("movie_id")
    try:
        Movie.objects.filter(list_owner=request.user, site_id=id).delete()
    except Exception:
        return JsonResponse({"error": "movie not deleted"}, status=500)

    return JsonResponse({"msg": "deleted"}, status=200)


def my_list(request, username):
    # Getting the list from the username
    try:
        user = User.objects.get(username=username)
    except Exception:
        return JsonResponse({"error": "User not found"}, status=400)

    try:
        my_list = Movie.objects.filter(list_owner=user)
        # Use utils function to get movie details
        movies_details = utils.movie_list(my_list, user)
    except Exception:
        return JsonResponse({"error": "query doens't succed."}, status=400)

    return render(request, "movies/mylist.html", {
        "movies": movies_details,
        "user_logged": request.user.username,
        "user_list": username
    })


@login_required
def add_remove_list(request):
    if request.method != "POST":
        return JsonResponse({"error": "Request must be POST"}, status=405)

    data = json.loads(request.body)
    id = data.get("id")
    title = data.get("title")
    list_icon = data.get("list")

    if not id or not title:
        return JsonResponse({"error": "Movie not added/removed"}, status=400)

    if list_icon == 'blank':
        try:
            new_list = Movie.objects.create(list_owner=request.user, name=title, site_id=id, watched=False, rate=0)
            new_list.save()
        except Exception:
            return JsonResponse({"error": "Movie not added to the list"}, status=400)

        return JsonResponse({"msg": "added"}, status=200)

    # If not blank means it is green I we need to remove it
    try:
        remove_list = Movie.objects.filter(list_owner=request.user, site_id=id)
        remove_list.delete()
    except Exception:
        return JsonResponse({"error": "Movie not removed."}, status=400)

    return JsonResponse({"msg": "removed"}, status=200)


def movie(request, id):
    # looking up a specific movie details including its trailer
    details = utils.lookup_movie_detail(id)
    trailer_id, trailer_site = utils.lookup_trailer(id)
    movie_id = details['id']

    try:
        movie = Movie.objects.filter(list_owner=request.user, site_id=movie_id)
        list_movie = True

        if len(movie) == 0:
            list_movie = False
    except Exception:
        list_movie = False

    return render(request, "movies/movie.html", {
        "details": details,
        "trailer_site": trailer_site,
        "trailer_id": trailer_id,
        "list_movie": list_movie
    })


def index(request):
    # getting all movies from page 1 from The movie db using this utils
    print("entered index view")
    movies = utils.lookup_latest_movies(1)
    print("returning index view")
    return render(request, 'movies/index.html', {
        'movies': movies
    })


def latest(request, page):
    # looking up the latest movies with specific page for javascript fetch
    next_movies = utils.lookup_latest_movies(int(page))
    return JsonResponse(next_movies, safe=False)


def search_title(request, title):
    # getting the details from a specific movie
    movie_searched = utils.search_movie(title)

    return JsonResponse(movie_searched, safe=False)


def sign_in(request):

    if request.method != "POST":
        return render(request, "movies/login.html")

    username = request.POST["username"]
    password = request.POST["password"]
    print("[SIGIN] username", username)
    print("[SIGIN] password", password)

    user = authenticate(request, username=username, password=password)
    print("[SIGIN] user", user)
    if user is None:
        return render(request, "movies/login.html", {
            "msg": "Incorrect username or password. Please, try again!"
        }, status=401)

    login(request, user)
    return HttpResponseRedirect(reverse("index"))


def sign_out(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):

    if request.method != "POST":
        return render(request, 'movies/register.html', status=405)

    username = request.POST["username"]
    password = request.POST["password"]
    email = None
    confirmation = request.POST["confirmation"]
    print("[REGISTER] username", username)
    print("[REGISTER] password", password)

    if password != confirmation or len(password) < 6:
        return render(request, "movies/register.html", {
            "msg": "Password and confirmation do not match or password doesn't have 6 min characters!"
        }, status=401)

    # Trying to create new user
    try:
        user = User.objects.create_user(username, email, password)
        user.save()
    except IntegrityError:
        return render(request, "movies/register.html", {
            "msg": "Please, provide another username!"
        }, status=401)

    login(request, user)
    return HttpResponseRedirect(reverse('index'))
