const audio = document.getElementById("audioPlayer");
const songTitle = document.getElementById("songTitle");
const songArtist = document.getElementById("songArtist");
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

const songs = [
  { title: "Song 1", artist: "Artist 1", src: "song1.mp3", image: "img1.jpg" },
  { title: "Song 2", artist: "Artist 2", src: "song2.mp3", image: "img2.jpg" },
  { title: "Song 3", artist: "Artist 3", src: "song3.mp3", image: "img3.jpg" }
];

function playSong(title, image, src, index = 0) {
  const song = songs[index];
  songTitle.textContent = song.title;
  songArtist.textContent = song.artist;
  songImage.src = song.image;
  audio.src = song.src;
  currentSongIndex = index;

  audio.play().then(() => {
    isPlaying = true;
    playBtn.querySelector('i').classList.remove('fa-play');
    playBtn.querySelector('i').classList.add('fa-pause');
  }).catch(() => {});
}


function togglePlay() {
  const icon = playBtn.querySelector('i');
  if (audio.paused || audio.ended) {
    audio.play()
      .then(() => {
        isPlaying = true;
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
      })
      .catch(() => {
        isPlaying = false;
      });
  } else {
    audio.pause();
    isPlaying = false;
    icon.classList.remove('fa-pause');
    icon.classList.add('fa-play');
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
  volumeControl.value = audio.muted ? 0 : audio.volume * 100;
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

progress.addEventListener("input", () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});

volumeControl.addEventListener("input", () => {
  audio.volume = volumeControl.value / 100;
  audio.muted = audio.volume === 0;
});

audio.addEventListener("timeupdate", () => {
  if (!isNaN(audio.duration)) {
    progress.value = (audio.currentTime / audio.duration) * 100;
    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
  }
});

audio.addEventListener("ended", nextSong);
audio.addEventListener("loadedmetadata", () => durationEl.textContent = formatTime(audio.duration));

searchInput.addEventListener("input", e => {
  const searchTerm = e.target.value.toLowerCase();
  Array.from(songsContainer.getElementsByClassName('song')).forEach(songEl => {
    songEl.style.display = songEl.textContent.toLowerCase().includes(searchTerm) ? 'flex' : 'none';
  });
});

playSong(songs[0].title, songs[0].image, songs[0].src, 0);
