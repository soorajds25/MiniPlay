const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startOverlay = document.getElementById('start-overlay');
const gameOverOverlay = document.getElementById('game-over-overlay');
const restartBtn = document.getElementById('restart-btn');
const winText = document.getElementById('win-text');

let animationId;
let isPlaying = false;
let isGameOver = false;
const WINNING_SCORE = 5;

// Key tracking for smooth movement
const keys = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false
};

// Player 1 (Left)
const p1 = {
    x: 20,
    y: canvas.height / 2 - 40,
    width: 15,
    height: 80,
    score: 0,
    speed: 6
};

// Player 2 (Right)
const p2 = {
    x: canvas.width - 35,
    y: canvas.height / 2 - 40,
    width: 15,
    height: 80,
    score: 0,
    speed: 6
};

// Ball object
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 12,
    velocityX: 5,
    velocityY: 5,
    speed: 7,
    emoji: '⚽'
};

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;
    ctx.fillRect(x, y, w, h);
    ctx.shadowBlur = 0;
}

function drawText(text, x, y) {
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '40px Orbitron';
    ctx.fillText(text, x, y);
}

function drawNet() {
    for (let i = 0; i <= canvas.height; i += 30) {
        drawRect(canvas.width / 2 - 1, i, 2, 15, 'rgba(255, 255, 255, 0.2)');
    }
}

function drawBall() {
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(ball.emoji, ball.x, ball.y);
    ctx.textAlign = 'left'; // reset
    ctx.textBaseline = 'alphabetic'; // reset
}

function resetBall(scorer) {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    // Server loses the point, so server serves to winner
    ball.velocityX = (scorer === 'p1' ? 1 : -1) * ball.speed;
    ball.velocityY = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 2 + 3);
}

function checkWin() {
    if (p1.score >= WINNING_SCORE || p2.score >= WINNING_SCORE) {
        isPlaying = false;
        isGameOver = true;
        winText.innerText = p1.score >= WINNING_SCORE ? 'Player 1 Wins!' : 'Player 2 Wins!';
        gameOverOverlay.classList.remove('hidden');
    }
}

function update() {
    // Paddle movement
    if (keys.w && p1.y > 0) p1.y -= p1.speed;
    if (keys.s && p1.y < canvas.height - p1.height) p1.y += p1.speed;
    if (keys.ArrowUp && p2.y > 0) p2.y -= p2.speed;
    if (keys.ArrowDown && p2.y < canvas.height - p2.height) p2.y += p2.speed;

    // Ball movement
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Collision with top and bottom walls
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.velocityY = -ball.velocityY;
    }

    // Determine which paddle is being hit
    let player = (ball.x < canvas.width / 2) ? p1 : p2;

    // Paddle collision
    // Using simple AABB math for circle-to-rect
    if (
        ball.x - ball.radius < player.x + player.width &&
        ball.x + ball.radius > player.x &&
        ball.y - ball.radius < player.y + player.height &&
        ball.y + ball.radius > player.y
    ) {
        // Prevent ball getting stuck inside paddle
        if (player === p1) {
            ball.x = p1.x + p1.width + ball.radius;
        } else {
            ball.x = p2.x - ball.radius;
        }

        // Reverse X direction
        ball.velocityX = -ball.velocityX;

        // Add some angle depending on where it hit the paddle
        let hitPoint = ball.y - (player.y + player.height / 2);
        // Normalize hitPoint from -1 to 1
        hitPoint = hitPoint / (player.height / 2);
        // Change Y velocity based on hit point
        ball.velocityY = hitPoint * ball.speed;
        
        // Slightly increase speed
        if (Math.abs(ball.velocityX) < 12) {
            ball.velocityX *= 1.05;
        }
    }

    // Scoring
    if (ball.x - ball.radius < 0) {
        p2.score++;
        checkWin();
        if (isPlaying) resetBall('p2');
    } else if (ball.x + ball.radius > canvas.width) {
        p1.score++;
        checkWin();
        if (isPlaying) resetBall('p1');
    }
}

function render() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw elements
    drawNet();
    drawText(p1.score, canvas.width / 4, 50);
    drawText(p2.score, 3 * canvas.width / 4, 50);
    drawRect(p1.x, p1.y, p1.width, p1.height, '#38bdf8');
    drawRect(p2.x, p2.y, p2.width, p2.height, '#38bdf8');
    drawBall();
}

function loop() {
    if (!isPlaying) return;
    update();
    render();
    animationId = requestAnimationFrame(loop);
}

function startGame() {
    p1.score = 0;
    p2.score = 0;
    p1.y = canvas.height / 2 - 40;
    p2.y = canvas.height / 2 - 40;
    ball.velocityX = ball.speed;
    ball.velocityY = 3;
    isPlaying = true;
    isGameOver = false;

    startOverlay.classList.add('hidden');
    gameOverOverlay.classList.add('hidden');
    
    resetBall('p1');
    loop();
}

// Input Listeners
window.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = true;
        // Prevent default scrolling for arrow keys
        if (['ArrowUp', 'ArrowDown', 'w', 's', 'W', 'S'].includes(e.key)) {
            e.preventDefault();
        }
    }

    if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        if (!isPlaying && !isGameOver) {
            startGame();
        }
    }
});

window.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false;
    }
});

restartBtn.addEventListener('click', () => {
    startGame();
});

// Initial Render
render();
