from django.test import TestCase
from ..models import User, Movie


class MovieTestCase(TestCase):
    def setup(self):
        # Create Users
        user_1 = User.objects.create_user(username="USER1", email="user1@example.com", password="0987poiu")
        user_1.save()
        user_2 = User.objects.create_user(username="USER2", email="user2@example.com", password="0987poiu")

        # Create Movies
        Movie.objects.create(list_owner=user_1, name="Movie 1", site_id=1234)
        Movie.objects.create(list_owner=user_2, name="Movie 2", site_id=4321)
        Movie.objects.create(list_owner=user_1, name=f"Movie 3 {'foo' * 70}", site_id=2222)
        Movie.objects.create(list_owner=user_2, name="Testing watch field", site_id=5555, watched=True)
        Movie.objects.create(list_owner=user_1, name="Movie 4", site_id=777, rate=2)
        Movie.objects.create(list_owner=user_1, name="Movie 4", site_id=777, rate=-1)
        Movie.objects.create(list_owner=user_1, name="Movie 4", site_id=777, rate=0)
        Movie.objects.create(list_owner=user_1, name="Movie 4", site_id=777, rate=None)

    def test_valid_movie(self):
        user_case = User.objects.get(username="USER1")
        movie_a = Movie.objects.get(list_owner=user_case, name="Movie 1", site_id=1234)
        self.assertTrue(movie_a)