let songList = [];
let guessCount = 0, maxGuess = 3, guessLength = [0.5, 1, 2.5, 5];
let songAnswer, albumAnswer, songPlayer, songProgress, progressBackground, searchBox, playButton, 
    resultTable, dropDown, sidePanel, panelButton, cdImage, cdCentre, cdCentreContainer, gameOver = false,
    audioPlaying = false, currentMax = 0;
let rafID;

document.addEventListener('DOMContentLoaded', function(){
    // Plays song when button is clicked
    playButton = document.getElementById('play_button');
    songPlayer = document.getElementById('music_player');
    songProgress = document.getElementById('audio_bar');
    searchBox = document.getElementById('nameInput');
    dropDown = document.getElementById('drop_down');
    resultTable = document.getElementById('results_table');
    progressBackground = document.getElementById('audio_limit');
    progressBackground.style.width = (100 * guessLength[guessCount] / guessLength[maxGuess]) + '%';
    sidePanel = document.getElementById('side_panel');
    panelButton = document.querySelector('.panel_button');
    cdCentreContainer = document.getElementById('cd_center_container');
    cdCentre = document.getElementById('cd_centre');
    cdImage = document.getElementById('cd');
    fetch('/get_answer')
        .then(response => response.json())
        .then(data => {
            // Load song
            songAnswer = data.song_name; 
            albumAnswer = data.album_name;
            cdImage.src = `/static/ye_assets/album_covers/${replaceSpace(albumAnswer)}.jpg`;
            console.log('Answer', songAnswer, albumAnswer);
            songPlayer.src = `/static/ye_assets/music/${replaceSpace(songAnswer)}.mp3`;
    })
    .catch(error => console.error('Error fetching song', error));

    playButton.addEventListener('click', function(){
        currentMax = guessLength[guessCount];
        play_pause(guessLength[maxGuess]);
    });

// Manage Search bar
    searchBox.addEventListener('input', function(){
        const searchValue = searchBox.value.toLowerCase();
        dropDown.innerHTML = '';
        if(searchValue){
            dropDown.style.display = 'block';
            let count = 0;
            songList.forEach(item =>{
                if(item.name.toLowerCase().includes(searchValue) && count < 5){
                    const element = document.createElement('div');
                    element.textContent = item.name;
                    element.addEventListener('click', function(){
                        searchBox.value = item.name;
                        dropDown.style.display = 'none';
                    });
                    dropDown.appendChild(element);
                    count++;
                }
            });
        }
    });
    document.addEventListener('click', function(event){
        if(event.target !== searchBox && event.target.parentNode !== dropDown){
            dropDown.style.display = 'none';
        }
    });

// Guess button
    document.getElementById('guess_button').addEventListener('click', function(){
        const songGuess = searchBox.value;
        songList.forEach(song =>{
            if(song.name == songGuess){
                submit_guess(song.name, song.album);
            }
        })
    });
    // Call the function to populate the datalist
    populate_song_list();
});

// Playing audio
function play_pause(maxTime){
    console.log("maxtime:", maxTime, "current time", currentMax)
    // Manage Button
    playButton.classList.remove('play');
    playButton.classList.add('pause');
    playButton.disabled = true;
    // Stops audio afte 'maxGuess' seconds
    songProgress.style.transition = 'none';
    songProgress.style.width = '0%';
    void songProgress.offsetWidth;
    songProgress.style.transition = 'width 0.5s linear'
    songProgress.style.transitionDuration = `${currentMax}s`
    songProgress.style.width = (100 * currentMax / maxTime) + '%';
    songPlayer.currentTime = 0;
    songPlayer.play();
    audioPlaying = true;
    songPlayer.addEventListener('play', function() {
        requestAnimationFrame(updateProgress);
    });
}
// Update Progress Bar
function updateProgress() {
    if(songPlayer.currentTime >= currentMax){
        songPlayer.pause();
        audioPlaying = false;
        playButton.classList.remove('pause');
        playButton.classList.add('play');
        playButton.disabled = false;
        cancelAnimationFrame(rafID);
    }
    else{
        rafID = requestAnimationFrame(updateProgress);
    }
}

// Submit guess
function submit_guess(guess_song, guess_album){
    console.log('Guess:', guess_song);
    guessCount++;
    searchBox.value = '';
    searchBox.removeAttribute('list');
    progressBackground.style.width = (100 * guessLength[guessCount] / guessLength[maxGuess]) + '%';

    //processing the guess
    const guess = document.getElementById('guess_results');
    const row = resultTable.insertRow();
    const cell1 = row.insertCell(0);
    var albumCover = document.createElement('img');
    albumCover.src = `/static/ye_assets/album_covers/${replaceSpace(guess_album)}.jpg`
    cell1.appendChild(albumCover);
    const cell2 = row.insertCell(1);
    cell2.textContent = guess_album;
    if(guess_album == albumAnswer){
        cell2.style.backgroundColor = "#4daa31";
    }
    const cell3 = row.insertCell(2);
    cell3.textContent = guess_song;
    if(songAnswer == guess_song){
        cell3.style.backgroundColor = "#4daa31";
        win();
    }
    else if(guessCount > maxGuess){
        lose();
    }
    else{
        searchBox.placeholder = 'Guess ' + (guessCount + 1) + '/' + (maxGuess + 1);
    }
}

// Search bar to select a song
function populate_song_list() {
    fetch('/get_song_list')
        .then(response => response.json())
        .then(data => {
            songList = data;
        })
        .catch(error => console.error('Error fetching song names:', error));
}

// Open/close results panel
function togglePanel(){
    if(sidePanel.style.transform === "translate(50%, -50%)"){
        sidePanel.style.transform = "translate(100%, -50%)";
        sidePanel.style.right = "0";
    }
    else{
        sidePanel.style.transform = "translate(50%, -50%)";
        sidePanel.style.right = "50%";
    }
}

function diskSpin(){
    cd.style.animation = 'spin 2.5s cubic-bezier(0.0, 0.0, 0.2, 1)';
    cdCentre.style.animation = 'spin 2.5s cubic-bezier(0.0, 0.0, 0.2, 1)';
    setTimeout(() => {
        finishSpin();
    }, 2500); 
}
function finishSpin(){
    sidePanel.style.transitionDuration = "1s"
    cd.style.transition = 'all 1s ease';
    cd.style.boxShadow = 'none';
    cd.style.borderRadius = '0';
    cd.style.border = 'none';
    cdCentreContainer.style.opacity = '0';
}

function finishGame(){
    gameOver = true;
    document.getElementById('guess_button').disabled = true;
    songProgress.style.width = '100%';
    // playButton.disabled = true;
    playButton.style.cursor = "default";
    searchBox.disabled = true;
    sidePanel.style.visibility = "visible";
    diskSpin();
    togglePanel();
    document.getElementById('result_song').innerHTML = songAnswer;
    document.getElementById('result_album').innerHTML = albumAnswer;
    currentMax = songPlayer.duration;
    progressBackground.style.width = "100%";
    play_pause(songPlayer.duration);
}
function win(){
    console.log("win");
    document.getElementById('correct').innerHTML = "You a<br>jeen-yuhs!";
    document.getElementById('score').innerHTML = guessCount + '/' + (maxGuess + 1) + ' guesses';
    searchBox.placeholder = "You a jeen-yuhs!";
    finishGame();
}
function lose(){
    console.log('lose');
    document.getElementById('correct').innerHTML = "You a<br>dum-dum";
    document.getElementById('score').innerHTML = "GAME OVER"
    searchBox.placeholder = "You a dum-dum!";
    finishGame();
}

function replaceSpace(inputString) {
    return inputString.replace(/ /g, '_');
}