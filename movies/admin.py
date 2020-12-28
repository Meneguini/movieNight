from django.contrib import admin
from .models import User, Movie


# Configuring Admin
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'password')


class MovieAdmin(admin.ModelAdmin):
    list_display = ('id', 'list_owner', 'name', 'site_id', 'watched', 'rate')


# Register your models here.
admin.site.register(User, UserAdmin)
admin.site.register(Movie, MovieAdmin)
