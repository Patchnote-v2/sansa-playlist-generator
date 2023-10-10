from rest_framework import viewsets
from .serializers import PlaylistRowSerializer
from .models import PlaylistRow


class PlaylistRowView(viewsets.ModelViewSet):
    serializer_class = PlaylistRowSerializer
    queryset = PlaylistRow.objects.all()
