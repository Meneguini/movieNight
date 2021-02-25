from django.test import TestCase
from .models import User, Movie


class MovieTestCase(TestCase):
    def setup(self):
        # Create Users
        user_1 = User.objects.create_user(
            username="USER-1", email="user-1@example.com", password="0987poiu"
        )
        user_2 = User.objects.create_user(
            username="USER-2", email="user-2@example.com", password="0987poiu"
        )

        # Create Movies
        Movie.objects.create(list_owner=user_1, name="Testing Movie 1", site_id=1234)
        Movie.objects.create(list_owner=user_2, name="Testing Movie 2", site_id=4321)
