// ═══════════════════════════════════
// MUSIC.JS – Rw_9 Bio-Link Player
// ═══════════════════════════════════

const PLAYLIST = [
  {
    title:  'willpower',
    artist: 'Slowed',
    src:    'willpower.mp3',
    cover:  'willpowerr.png',
  },
  {
    title:  'english or spanish',
    artist: 'english or spanish ptasinski, RJ Pasin',
    src:    'english or spanish.mp3',
    cover:  'english or spanish.png',
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
  {
    title:  'GLORY',
    artist: 'Ogryzek (Phonk)',
    src:    'glory_phonk.mp3',
    cover:  'glory_phonk.png',
  },
  {
    title:  'Montagem Lunar Celestia',
    artist: 'Slowed',
    src:    'montagem_lunar.mp3',
    cover:  'montagem_lunar.png',
  },
  {
    title:  'Sprinter',
    artist: 'Dave & Central Cee',
    src:    'sprinter.mp3',
    cover:  'sprinter.png',
  },
];

let currentIndex = 0;
let isPlaying    = false;
const audio      = new Audio();
audio.volume     = 0.45;

let playerEl, coverEl, titleEl, artistEl, btnPlay, btnPrev, btnNext, bgBlurEl;

function loadTrack(index) {
  const track = PLAYLIST[index];
  audio.src   = track.src;
  coverEl.src = track.cover;
  titleEl.textContent  = track.title;
  artistEl.textContent = track.artist;
  if (bgBlurEl) bgBlurEl.style.backgroundImage = `url('${track.cover}')`;
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
  requestAnimationFrame(() => playerEl.classList.add('visible'));
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
  play();

  audio.addEventListener('ended', nextTrack);
  btnPlay.addEventListener('click', () => isPlaying ? pause() : play());
  btnNext.addEventListener('click', nextTrack);
  btnPrev.addEventListener('click', prevTrack);

  const volSlider = document.getElementById('volumeSlider');
  if (volSlider) volSlider.addEventListener('input', () => { audio.volume = volSlider.value / 100; });

  document.addEventListener('click', () => { if (!isPlaying) play(); }, { once: true });
}

window.initMusic = initMusic;
