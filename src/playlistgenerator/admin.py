from django.contrib import admin

# Register your models here.

from .models import Item, Playlist, PlaylistRow

admin.site.register(Item, admin.ModelAdmin)
admin.site.register(Playlist, admin.ModelAdmin)
admin.site.register(PlaylistRow, admin.ModelAdmin)
