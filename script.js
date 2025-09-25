const audio = document.getElementById("audioPlayer");
const songTitle = document.getElementById("songTitle");
const songImage = document.getElementById("songImage");
const progress = document.getElementById("progress");
const playBtn = document.getElementById("playBtn");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const volumeControl = document.getElementById("volume");
const searchInput = document.getElementById("searchInput");
const songsContainer = document.getElementById("songsContainer");

let currentSongIndex = 0;
let isPlaying = false;



function playSong(title, image, src, index = 0) {
  const song = songs.find(s => s.title === title) || songs[index];
  
  songTitle.textContent = song.title;
  document.getElementById("songArtist").textContent = song.artist;
  songImage.src = song.image;
  audio.src = song.src;
  
  currentSongIndex = songs.findIndex(s => s.title === song.title);
  
  audio.play().then(() => {
    isPlaying = true;
    playBtn.textContent = "⏸️";
  }).catch(error => {
    console.log("Play error:", error);
  });
}

function togglePlay() {
  if (audio.paused) {
    audio.play();
    isPlaying = true;
    playBtn.textContent = "⏸️";
  } else {
    audio.pause();
    isPlaying = false;
    playBtn.textContent = "▶️";
  }
}

function prevSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  const song = songs[currentSongIndex];
  playSong(song.title, song.image, song.src, currentSongIndex);
}

function nextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  const song = songs[currentSongIndex];
  playSong(song.title, song.image, song.src, currentSongIndex);
}

function toggleMute() {
  audio.muted = !audio.muted;
  volumeControl.value = audio.muted ? 0 : 100;
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

//EventListeners
progress.addEventListener("input", () => {
  const seekTime = (progress.value / 100) * audio.duration;
  audio.currentTime = seekTime;
});

volumeControl.addEventListener("input", () => {
  audio.volume = volumeControl.value / 100;
  audio.muted = volumeControl.value === 0;
});

audio.addEventListener("timeupdate", () => {
  if (!isNaN(audio.duration)) {
    progress.value = (audio.currentTime / audio.duration) * 100;
    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
  }
});

audio.addEventListener("ended", () => {
  nextSong();
});

audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
});

//Searchfunction
searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const songElements = songsContainer.getElementsByClassName('song');
  
  Array.from(songElements).forEach((songEl, index) => {
    const songText = songEl.textContent.toLowerCase();
    if (songText.includes(searchTerm)) {
      songEl.style.display = 'flex';
    } else {
      songEl.style.display = 'none';
    }
  });
});
