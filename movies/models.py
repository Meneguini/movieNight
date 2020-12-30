from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.
class User(AbstractUser):
    username = models.CharField(max_length=200, unique=True)
    email = models.EmailField(unique=True)

    def __str__(self):
        return f"User: {self.username}."


class Movie(models.Model):
    list_owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="owners")
    name = models.CharField(max_length=200)
    site_id = models.PositiveIntegerField()
    watched = models.BooleanField(default=False)
    rate = models.PositiveIntegerField(blank=True)

    def __str__(self):
        return f"List owner: {self.list_owner}| movie: {self.name}| id from site: {self.site_id}| watched: {self.watched}| rate: {self.rate}."