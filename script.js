// The Impostor (Pass & Play version)
// Full working version — all categories + random word selection fixed

const qs = s => document.querySelector(s);
const id = s => document.getElementById(s);

const menu = qs('#menu');
const playerView = qs('#playerView');
const endView = qs('#endView');

const categoryEl = id('category');
const numPlayersEl = id('numPlayers');
const roundsEl = id('rounds');
const startBtn = id('startBtn');
const shuffleWordsBtn = id('shuffleWordsBtn');

const playerIndexDisplay = id('playerIndexDisplay');
const playersTotalDisplay = id('playersTotalDisplay');
const roundDisplay = id('roundDisplay');
const roundsTotalDisplay = id('roundsTotalDisplay');

const wordLabel = id('wordLabel');
const showBtn = id('showBtn');
const nextBtn = id('nextBtn');

const revealImpostorBtn = id('revealImpostorBtn');
const playAgainBtn = id('playAgainBtn');
const revealResult = id('revealResult');

// ✅ Fixed: all categories now included
const wordsDB = {
  celebrities: [
    "Beyoncé","Leonardo DiCaprio","Rihanna","Kevin Hart","Jackie Chan",
    "Dwayne Johnson","Zendaya","Chris Hemsworth","Taylor Swift","Angelina Jolie",
    "Brad Pitt","Adele","Johnny Depp","Messi","Michael B. Jordan","Ronaldo","Lebron James",
    "Selena Gomez","Robert Downey Jr.","Kim Kardashian","Morgan Freeman"
  ],
  series: [
    "Stranger Things","Breaking Bad","Game of Thrones","The Office","Friends","SpongBob Squarepants",
    "Squid Game","The Crown","Sherlock","Wednesday","Mpali","Tom & Jerry","Rick & Morty",
    "Money Heist","Family Guy","Loki","Scandle","Peaky Blinders","Prison Break","Avater the Last Airbender"
  ],
  animals: [
    "Lion","Elephant","Whale","Eagle","Snake","Giraffe","Hippo","Cow",
    "Fly","Tiger","Zebra","Cheetah","Monkey","Crocodile","Shark","Owl","Bat","Rat","Dog","Donkey",
  ],
  musicians: [
    "Drake","Ariana Grande","Ed Sheeran","Kendrick Lamar","Billie Eilish","J Cole","Whitnet Housten",
    "Coldplay","Madonna","Bruno Mars","The Weeknd","Post Malone","Frank Ocean","",
    "Burna Boy","Doja Cat","Harry Styles","Rema","Rihanna","Migos","Don Toliver","Micheal Jackson"
  ],
  random: [
    "Imposter","Candle","","Pizza","Moonlight","Chicken","Football","Money","KFC",
    "Marathon","Mystery","Ballon","Clock","Mirror","Banana","Chocolate","Galaxy","Batman","Call of Duty"
  ]
};

// Game state
let game = {
  numPlayers: 4,
  rounds: 1,
  category: 'animals',
  wordForRound: [],
  impostorIndexForRound: [],
  currentRound: 0,
  currentPlayerIndex: 0,
  revealed: false
};

// Helpers
const randInt = n => Math.floor(Math.random() * n);
const shuffle = arr => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
};

// Prepare game setup
function prepareGame() {
  game.numPlayers = Math.max(4, Math.min(20, parseInt(numPlayersEl.value) || 4));
  game.rounds = Math.max(1, Math.min(10, parseInt(roundsEl.value) || 1));
  game.category = categoryEl.value;

  const pool = [...(wordsDB[game.category] || wordsDB.random)];
  shuffle(pool);

  game.wordForRound = [];
  game.impostorIndexForRound = [];

  for (let r = 0; r < game.rounds; r++) {
    game.wordForRound.push(pool[r % pool.length]);
    game.impostorIndexForRound.push(randInt(game.numPlayers));
  }

  game.currentRound = 0;
  game.currentPlayerIndex = 0;
  game.revealed = false;
}

// UI switching
function showMenu() {
  menu.classList.remove('hidden');
  playerView.classList.add('hidden');
  endView.classList.add('hidden');
}
function showPlayerView() {
  menu.classList.add('hidden');
  playerView.classList.remove('hidden');
  endView.classList.add('hidden');
  updatePlayerUI();
}
function showEndView() {
  menu.classList.add('hidden');
  playerView.classList.add('hidden');
  endView.classList.remove('hidden');
}

// Update the player display
function updatePlayerUI() {
  playersTotalDisplay.textContent = game.numPlayers;
  playerIndexDisplay.textContent = game.currentPlayerIndex + 1;
  roundDisplay.textContent = game.currentRound + 1;
  roundsTotalDisplay.textContent = game.rounds;
  wordLabel.textContent = 'Press Show Word to reveal';
  wordLabel.className = 'wordLabel';
  showBtn.disabled = false;
  nextBtn.disabled = true;
  game.revealed = false;
}

// Reveal the word or "IMPOSTOR"
function revealWordToPlayer() {
  const word = game.wordForRound[game.currentRound];
  const impostorIndex = game.impostorIndexForRound[game.currentRound];
  if (game.currentPlayerIndex === impostorIndex) {
    wordLabel.textContent = 'IMPOSTOR';
    wordLabel.className = 'wordLabel impostor';
  } else {
    wordLabel.textContent = word;
    wordLabel.className = 'wordLabel word';
  }
  showBtn.disabled = true;
  nextBtn.disabled = false;
  game.revealed = true;
}

// Move to next player
function nextPlayer() {
  game.currentPlayerIndex++;
  if (game.currentPlayerIndex >= game.numPlayers) {
    game.currentPlayerIndex = 0;
    game.currentRound++;
    if (game.currentRound >= game.rounds) {
      showEndView();
      return;
    }
  }
  updatePlayerUI();
}

// Event listeners
startBtn.addEventListener('click', () => {
  prepareGame();
  showPlayerView();
});

shuffleWordsBtn.addEventListener('click', () => {
  const list = wordsDB[categoryEl.value] || wordsDB.random;
  shuffle(list);
  shuffleWordsBtn.textContent = 'Shuffled!';
  setTimeout(() => (shuffleWordsBtn.textContent = 'Shuffle Words'), 700);
});

showBtn.addEventListener('click', revealWordToPlayer);

nextBtn.addEventListener('click', () => {
  wordLabel.textContent = 'Pass to next player';
  wordLabel.className = 'wordLabel';
  nextBtn.disabled = true;
  showBtn.disabled = true;
  setTimeout(() => nextPlayer(), 350);
});

revealImpostorBtn.addEventListener('click', () => {
  let html = '';
  for (let r = 0; r < game.rounds; r++) {
    html += `Round ${r + 1}: Impostor was <strong>Player ${
      game.impostorIndexForRound[r] + 1
    }</strong> — Word: <em>${game.wordForRound[r]}</em><br>`;
  }
  revealResult.innerHTML = html;
});

playAgainBtn.addEventListener('click', showMenu);

// Start at menu
showMenu();
