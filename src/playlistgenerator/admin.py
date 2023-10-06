from django.contrib import admin

# Register your models here.

from .models import Item, Playlist, PlaylistRow


class ItemAdmin(admin.ModelAdmin):
    list_display = ["name", "type", "artists_as_string", "id"]
    fields = ["id", "name", "type", "artists"]
    readonly_fields = ['id']


class PlaylistAdmin(admin.ModelAdmin):
    list_display = ["__str__", "user", "id"]
    fields = ["id", "user"]
    readonly_fields = ['id']


class PlaylistRowAdmin(admin.ModelAdmin):
    list_display = ["__str__", "playlist", "item", "amount", "id"]
    fields = ["id", "playlist", "item", "amount"]
    readonly_fields = ['id']


admin.site.register(Item, ItemAdmin)
admin.site.register(Playlist, PlaylistAdmin)
admin.site.register(PlaylistRow, PlaylistRowAdmin)
