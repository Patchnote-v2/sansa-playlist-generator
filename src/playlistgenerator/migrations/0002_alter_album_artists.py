# Generated by Django 4.2.6 on 2023-10-04 22:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('playlistgenerator', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='album',
            name='artists',
            field=models.ManyToManyField(related_name='artists', related_query_name='artist', to='playlistgenerator.artist'),
        ),
    ]
