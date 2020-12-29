from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('register/', views.register, name="register"),
    path('signin/', views.sign_in, name="sign_in"),
    path('signout/', views.sign_out, name="sign_out"),
    path('movie/<int:id>', views.movie, name="movie"),
    path('my_list/movie/<int:id>', views.movie, name="movie"),
    path('my_list/<str:username>', views.my_list, name="my_list/"),

    # Api Routes
    path('latest/<int:page>', views.latest, name="latest"),
    path('search_title/<str:title>', views.search_title, name="search_title"),
    path('my_list/movie/add_remove_list', views.add_remove_list, name="add_remove_list"),
    path('add_remove_list', views.add_remove_list, name="add_remove_list"),
    path('delete_movie', views.delete_movie, name="delete_movie"),
    path('update_star', views.update_star, name="update_star")

]