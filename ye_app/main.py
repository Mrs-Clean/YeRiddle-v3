from flask import Flask, render_template, jsonify, json
import sys
from os.path import join
from pathlib import Path
sys.path.insert(1, str(Path(__file__).resolve().parent.parent))     #fixes path to import game
from ye_game import game
from dotenv import load_dotenv
load_dotenv()                                                       # Take environment variables from .env.

app = Flask(__name__, static_folder='static')                       # creates Flask instance

ye_game = game.YeGame()                                             # creates ye_game instance

@app.route('/')                                                     # entry point to the game, displaying html webpage
def index():
    return render_template('index.html')                            # renders html

@app.route('/get_answer', methods=['GET'])                          # route to get answer song name
def get_song():
    return jsonify(song_name = f"{ye_game.song}", album_name = f"{ye_game.album}")

# -- add song list route here --
@app.route('/get_song_list')
def get_song_list():
    with open(join('ye_app', 'static', 'ye_assets', 'song_list.json'), 'r') as file:
    # with open('/static/ye_assets/song_list.json', 'r') as file:
        data_list = json.load(file)
    return jsonify(data_list)

if __name__ == '__main__':
    import os
    if os.environ.get('FLASK_ENV') == 'development':
        app.run(debug=True)