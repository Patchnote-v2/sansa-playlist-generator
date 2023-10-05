from django.contrib import admin

# Register your models here.

from .models import Album, Artist, Playlist, Item

admin.site.register(Album, admin.ModelAdmin)
admin.site.register(Artist, admin.ModelAdmin)
admin.site.register(Playlist, admin.ModelAdmin)
admin.site.register(Item, admin.ModelAdmin)