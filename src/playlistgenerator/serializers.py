from rest_framework import serializers
from .models import Item, PlaylistRow, Playlist


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ('id', 'name', 'type', 'artists_as_string')


class PlaylistRowSerializer(serializers.ModelSerializer):
    item = ItemSerializer(read_only=True)

    class Meta:
        model = PlaylistRow
        fields = ('item', 'amount')


class PlaylistSerializer(serializers.ModelSerializer):
    rows = PlaylistRowSerializer(many=True)

    class Meta:
        model = Playlist
        fields = ('user', 'rows')
