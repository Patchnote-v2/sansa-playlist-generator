import uuid
from django.db import models


class Artist(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    artist_name = models.CharField(max_length=256, blank=False, null=False)

    def __str__(self):
        return self.artist_name


class Album(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    album_name = models.CharField(max_length=256, blank=False, null=False)
    artists = models.ManyToManyField(Artist,
                                     related_name="albums",
                                     related_query_name="album")

    def __str__(self):
        return self.album_name


class Item(models.Model):
    ARTIST = "ARTIST"
    ALBUM = "ALBUM"
    TYPE_CHOICES = (
        (ARTIST, 'Artist'),
        (ALBUM, 'Album'),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    type = models.CharField(max_length=16,
                            choices=TYPE_CHOICES,
                            blank=False,
                            null=True,
                            default=ALBUM)

    amount = models.IntegerField(default=0, blank=False, null=True)
