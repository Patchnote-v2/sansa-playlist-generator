from rest_framework import serializers
from .models import PlaylistRow


class PlaylistRowSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlaylistRow
        fields = ('id', 'playlist', 'item', 'amount')
