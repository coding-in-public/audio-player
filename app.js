/// / QUERY SELECTORS ////

// Music Player
const musicPlayer = document.querySelector('.music__player');
const playBtn = document.querySelector('#play');
const prevBtn = document.querySelector('#prev');
const nextBtn = document.querySelector('#next');
const audio = document.querySelector('#audio');

// Speed Adjustments
const speedIndicator = document.querySelector('.speed');
const speedNumber = document.querySelector('.speed p');
const speedOptions = [1.0, 1.5, 2.0, 0.75];
let speedIndex = 0;

// Progress Bar
const progressContainer = document.querySelector('.music__player--progress');
const progress = document.querySelector('.progress');

// Title and Image
const audioTitle = document.querySelector('.music__title');
const audioImage = document.querySelector('.music__img');

// Songs
let songs;
let songIndex = 0;

/// / FUNCTIONS ////

// update UI with current song
function loadSong(song) {
    audioTitle.innerText = song.title;
    audio.src = `${song.audio}`;
    audioImage.style.backgroundImage = `url('${song.cover}')`;
}

// check if song is playing
function isAudioPlaying() {
    return musicPlayer.classList.contains('playing');
}

// play audio of current song
function playAudio() {
    musicPlayer.classList.add('playing');
    playBtn.querySelector('i').classList.remove('ph-play-circle');
    playBtn.querySelector('i').classList.add('ph-pause-circle');
    audio.playbackRate = `${speedOptions[speedIndex]}`;
    audio.play();
}

// pause audio of current song
function pauseAudio() {
    musicPlayer.classList.remove('playing');
    playBtn.querySelector('i').classList.add('ph-play-circle');
    playBtn.querySelector('i').classList.remove('ph-pause-circle');
    audio.pause();
}

// Load songs from "server"
async function retrieveSongsFromServer() {
    await fetch('audio.json')
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            songs = data.songs;
            loadSong(songs[songIndex]);
        })
        .catch((error) => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}
retrieveSongsFromServer();

// load up previous song
function prevSong() {
    songIndex -= 1;
    if (songIndex < 0) {
        songIndex = songs.length - 1;
    }
    loadSong(songs[songIndex]);
    progress.style.width = '0%';
    isAudioPlaying() === true ? playAudio() : pauseAudio();
}

// load up next song
function nextSong() {
    songIndex += 1;
    if (songIndex > songs.length - 1) {
        songIndex = 0;
    }
    loadSong(songs[songIndex]);
    progress.style.width = '0%';
    isAudioPlaying() === true ? playAudio() : pauseAudio();
}

// update progress bar width
function updateProgressBar(e) {
    const { duration, currentTime } = e.srcElement;
    const progressPercentage = (currentTime / duration) * 100;
    progress.style.width = `${progressPercentage}%`;
}

// move audio to where you click on playing audio track
function updateProgressBarPlayPosition(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const { duration } = audio;
    audio.currentTime = (clickX / width) * duration;
}

// update speed indicator
function updateSpeedIndicator() {
    speedIndex += 1;
    if (speedIndex > speedIndex.length - 1) {
        speedIndex = 0;
    }
    speedNumber.textContent = `${speedOptions[speedIndex]}x`;
    playAudio();
}

/// / EVENT LISTENERS ////
// Play, prev, next btns
playBtn.addEventListener('click', () => {
    isAudioPlaying() ? pauseAudio() : playAudio();
});
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

// update speed indicator
speedIndicator.addEventListener('click', updateSpeedIndicator);

// progress bar updates
audio.addEventListener('timeupdate', updateProgressBar);
progressContainer.addEventListener('click', updateProgressBarPlayPosition);
// move to next song when song finishes
