import os
import argparse

CONFIG_FILENAME = "config.json"
INTERNAL_FOLDER = "/<microSD1>"

CONFIG_FILE_TEMPLATE = {"albums": {"": 0, "": 0}, "artists": {"": 0, "": 0}}

parser = argparse.ArgumentParser(
    description='Randomize (or not) a list of albums and create a RockBox playlist file.')
parser.add_argument('todo',
                    choices=('scan_folder', 'create_playlist'),
                    help='Which action to perform.  Allowed options: generate_config, create_playlist',  # noqa
                    metavar='ACTION')

parser.add_argument('-r',
                    dest='root_folder',
                    help='Only for use with `create_playlist`.  Specifies the root music folder to scan.')  # noqa

parser.add_argument('-c',
                    dest='config_file',
                    help='Specifies the config file name and location.')

args = parser.parse_args()

if args.todo == "create_playlist" and not args.root_folder:
    parser.error("A root music folder must be specified with -r")
if args.todo == "create_playlist" and not args.config_file:
    parser.error("A config file must be specified with -c")

if args.todo == "scan_folder" and not args.root_folder:
    parser.error("A root music folder must be specified with -r")
if args.todo == "scan_folder" and not args.config_file:
    parser.error("A config file must be specified with -c")

if args.todo == "create_playlist":
    pass
elif args.todo == "scan_folder":
    found_albums_list = []

    for currentpath, folders, files in os.walk(args.root_folder, topdown=False):
        # print(currentpath)
        if files:
            print(os.path.basename(currentpath))
        # print(folders)
        # print(files)
        # if folders:
        #     for each in folders:
        #         if each not in found_albums_list:
        #             found_albums_list.append(each)
print(found_albums_list)
# print(files)
# for file in files:
#     print(os.path.join(currentpath, file))
