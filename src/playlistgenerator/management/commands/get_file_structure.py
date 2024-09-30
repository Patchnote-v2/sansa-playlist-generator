import json
import os

from pathlib import Path

from natsort import natsorted

from django.core.management.base import BaseCommand

valid_extensions = [
    '3gp',
    'aa',
    'aac',
    'aax',
    'act',
    'aiff',
    'alac',
    'amr',
    'ape',
    'au',
    'awb',
    'dss',
    'dvf',
    'flac',
    'gsm',
    'iklax',
    'ivs',
    'm4a',
    'm4b',
    'm4p',
    'mmf',
    'movpkg',
    'mp3',
    'mpc',
    'msv',
    'nmf',
    'ogg',
    'oga',
    'mogg',
    'opus',
    'ra, .rm',
    'raw',
    'rf64',
    'sln',
    'tta',
    'vox',
    'wav',
    'wma',
    'wv',
    '8svx',
]


class Command(BaseCommand):
    help = "Recursively outputs all files in a given root folder into a given file"
    data = {"ROOT_DIRECTORY_PATH": None}

    def add_arguments(self, parser):
        parser.add_argument("root", nargs=1, type=str)
        parser.add_argument("output", nargs=1, type=str)
        parser.add_argument("--include-extensions", nargs='?', type=str)

    def handle(self, *args, **options):
        # todo: restrict to only valid audio file formats
        self.data["ROOT_DIRECTORY_PATH"] = options["root"]

        if extensions := options["include_extensions"]:
            extensions = extensions.split(',')
            for each in extensions:
                valid_extensions.append(each)

        for root, dirs, files in os.walk(options["root"][0]):
            for file in files:
                # Check if it's a valid extension before proceeding
                extension = file.split('.')
                if extension[-1] not in valid_extensions:
                    continue

                path = Path(f"{root}/{file}")
                # todo: This part might not work if the folder isn't deep enough.
                # Items in the root directory will need a grandparent, but in the example:
                # "C:/artist/file.txt" there is no grandparent
                artist = os.path.basename(path.parents[1])
                album = os.path.basename(path.parents[0])
                song = file

                if artist not in self.data:
                    self.data[artist] = {}
                if album not in self.data[artist]:
                    self.data[artist][album] = []
                self.data[artist][album].append(song)

        for artist in self.data:
            if not isinstance(self.data[artist], dict):
                continue
            for album in self.data[artist]:
                self.data[artist][album] = natsorted(self.data[artist][album])

        with open(options["output"][0], 'w') as file:
            file.write(json.dumps(self.data))
