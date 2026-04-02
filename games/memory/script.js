const board = document.getElementById('game-board');
const movesEl = document.getElementById('moves');
const matchesEl = document.getElementById('matches');
const restartBtn = document.getElementById('restart-btn');
const modal = document.getElementById('win-screen');
const playAgainBtn = document.getElementById('play-again-btn');
const finalMovesEl = document.getElementById('final-moves');

const emojis = ['🍎', '🍌', '🍇', '🍉', '🍓', '🍒', '🍍', '🥥'];
let cardsArray = [...emojis, ...emojis];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let lockBoard = false;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createBoard() {
    board.innerHTML = '';
    shuffle(cardsArray);
    
    cardsArray.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.name = emoji;
        card.dataset.index = index;

        card.innerHTML = `
            <div class="card-inner">
                <div class="card-back">❓</div>
                <div class="card-front">${emoji}</div>
            </div>
        `;
        
        card.addEventListener('click', flipCard);
        board.appendChild(card);
    });
}

function flipCard() {
    if (lockBoard) return;
    if (this === flippedCards[0]) return;
    if (this.classList.contains('match')) return;

    this.classList.add('flip');
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        moves++;
        movesEl.innerText = moves;
        checkForMatch();
    }
}

function checkForMatch() {
    const isMatch = flippedCards[0].dataset.name === flippedCards[1].dataset.name;

    if (isMatch) {
        disableCards();
    } else {
        unflipCards();
    }
}

function disableCards() {
    flippedCards[0].classList.add('match');
    flippedCards[1].classList.add('match');
    
    matchedPairs++;
    matchesEl.innerText = matchedPairs;
    flippedCards = [];

    if (matchedPairs === emojis.length) {
        setTimeout(showWinScreen, 500);
    }
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        flippedCards[0].classList.remove('flip');
        flippedCards[1].classList.remove('flip');
        flippedCards = [];
        lockBoard = false;
    }, 1000);
}

function showWinScreen() {
    finalMovesEl.innerText = moves;
    modal.classList.remove('hidden');
}

function initGame() {
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    lockBoard = false;
    movesEl.innerText = moves;
    matchesEl.innerText = matchedPairs;
    modal.classList.add('hidden');
    createBoard();
}

restartBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', initGame);

// Start game
initGame();
