// ═══════════════════════════════════
// MUSIC.JS – Rw_9 Bio-Link Player
// ═══════════════════════════════════

const PLAYLIST = [
  {
    title:  'Sprinter',
    artist: 'Dave & Central Cee',
    src:    'sprinter.mp3',
    cover:  'sprinter.png',
  },
  {
    title:  'THE SCOTTS',
    artist: 'Travis Scott & Kid Cudi',
    src:    'the_scotts.mp3',
    cover:  'the_scotts.png',
  },
  {
    title:  'Montagem Alucinante',
    artist: 'Rushex & Dj Orbital',
    src:    'montagem.mp3',
    cover:  'montagem.png',
  },
  {
    title:  'ITACHI FLOW',
    artist: 'Reezy',
    src:    'itachi_flow.m4a',
    cover:  'itachi_flow.png',
  },
];

let currentIndex = 0;
let isPlaying    = false;
const audio      = new Audio();
audio.volume     = 0.45;

// DOM refs (resolved after DOMContentLoaded)
let playerEl, coverEl, titleEl, artistEl, btnPlay, btnPrev, btnNext, bgBlurEl;

function loadTrack(index) {
  const track   = PLAYLIST[index];
  audio.src     = track.src;
  coverEl.src   = track.cover;
  titleEl.textContent  = track.title;
  artistEl.textContent = track.artist;

  // Swap blurred background
  if (bgBlurEl) {
    bgBlurEl.style.backgroundImage = `url('${track.cover}')`;
  }
}

function play() {
  audio.play().then(() => {
    isPlaying = true;
    btnPlay.innerHTML = '&#10074;&#10074;';
  }).catch(() => {});
}

function pause() {
  audio.pause();
  isPlaying = false;
  btnPlay.innerHTML = '&#9654;';
}

function nextTrack() {
  currentIndex = (currentIndex + 1) % PLAYLIST.length;
  loadTrack(currentIndex);
  if (isPlaying) play();
}

function prevTrack() {
  // If more than 3s in, restart; otherwise go back
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
  } else {
    currentIndex = (currentIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
    loadTrack(currentIndex);
    if (isPlaying) play();
  }
}

function showPlayer() {
  playerEl.classList.remove('hidden');
  requestAnimationFrame(() => {
    playerEl.classList.add('visible');
  });
}

function initMusic() {
  playerEl  = document.getElementById('player');
  coverEl   = document.getElementById('playerCover');
  titleEl   = document.getElementById('playerTitle');
  artistEl  = document.getElementById('playerArtist');
  btnPlay   = document.getElementById('btnPlay');
  btnPrev   = document.getElementById('btnPrev');
  btnNext   = document.getElementById('btnNext');
  bgBlurEl  = document.getElementById('bgBlur');

  loadTrack(currentIndex);
  showPlayer();

  // Auto-play attempt (may be blocked by browser without user interaction)
  play();

  // Auto-next when track ends
  audio.addEventListener('ended', nextTrack);

  // Controls
  btnPlay.addEventListener('click', () => isPlaying ? pause() : play());
  btnNext.addEventListener('click', nextTrack);
  btnPrev.addEventListener('click', prevTrack);

  // Allow play on first user gesture if autoplay was blocked
  document.addEventListener('click', () => {
    if (!isPlaying) play();
  }, { once: true });
}

// Export so script.js can call after intro
window.initMusic = initMusic;
