import uuid
from django.db import models
from django.contrib.auth.models import User


class Item(models.Model):
    ARTIST = "ARTIST"
    ALBUM = "ALBUM"
    TYPE_CHOICES = (
        (ARTIST, 'Artist'),
        (ALBUM, 'Album'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=256, blank=False, null=True)

    type = models.CharField(max_length=16,
                            choices=TYPE_CHOICES,
                            blank=False,
                            null=True,
                            default=ALBUM)

    # If type == ARTIST, this must be empty
    artists = models.ManyToManyField("Item",
                                     related_name="artists_set",
                                     related_query_name="artist")

    # If type == ALBUM, this must be empty
    albums = models.ManyToManyField("Item",
                                    related_name="albums_set",
                                    related_query_name="album")

    def __str__(self):
        return self.name


class Playlist(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class PlaylistRow(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    playlist = models.ForeignKey(Playlist,
                                 on_delete=models.CASCADE,
                                 blank=False,
                                 null=True,
                                 related_name="rows",
                                 related_query_name="row")

    item = models.ForeignKey(Item,
                             on_delete=models.CASCADE,
                             blank=False,
                             null=True,
                             related_name="items",
                             related_query_name="item")

    amount = models.IntegerField(default=0, blank=False, null=True)
