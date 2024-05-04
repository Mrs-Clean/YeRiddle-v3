import random
from pathlib import Path

current_directory = Path(__file__).resolve().parent

# picks a name given path to a text file with list of names
def get_name(path):
    try:
        with open(path, 'r', encoding='utf-8') as file:
                names = [name.strip() for name in file if name.strip()]
    except UnicodeDecodeError:
        with open(path, 'r', encoding='utf-16') as file:
            names = [name.strip() for name in file if name.strip()]

    return names

# returns random album name
def pick_album():
    albums = get_name(current_directory / "ye_assets/names/albums.txt")
    album = random.choice(albums)
    return album

# returns random song name
def pick_song(album):
    songs = get_name(current_directory / f"ye_assets/names/{album}.txt")
    song = random.choice(songs)
    return song