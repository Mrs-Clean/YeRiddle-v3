from ye_game import utils

class YeGame:
    def __init__(self):
            self.album = utils.pick_album()             # <-- picks album
            self.song = utils.pick_song(self.album)     # <-- picks song

    # checks if guess is correct
    def submit_guess(self): 
        if self.ye_guess.text_value == self.song:
            return True
        else:
            return False