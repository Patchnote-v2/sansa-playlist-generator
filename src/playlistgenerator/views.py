from rest_framework import viewsets
from .serializers import PlaylistSerializer
from .models import Playlist


class PlaylistView(viewsets.ModelViewSet):
    serializer_class = PlaylistSerializer
    queryset = Playlist.objects.all()
