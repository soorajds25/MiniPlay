const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startOverlay = document.getElementById('start-overlay');
const gameOverOverlay = document.getElementById('game-over-overlay');
const restartBtn = document.getElementById('restart-btn');
const finalScoreEl = document.getElementById('final-score');
const bestScoreEl = document.getElementById('best-score');

// Game Vars
let frames = 0;
let animationId;
let isPlaying = false;
let isGameOver = false;
let canRestart = true;
let score = 0;
let bestScore = localStorage.getItem('flappyBest') || 0;

// Bird object
const bird = {
    x: 50,
    y: 150,
    radius: 12,
    velocity: 0,
    gravity: 0.25,
    jump: -6,
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#facc15';
        ctx.fill();
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#facc15';
        ctx.closePath();
        ctx.shadowBlur = 0; // reset
    },
    
    update() {
        this.velocity += this.gravity;
        this.y += this.velocity;
        
        // Floor collision
        if (this.y + this.radius >= canvas.height) {
            this.y = canvas.height - this.radius;
            gameOver();
        }
        // Ceiling collision
        if (this.y - this.radius <= 0) {
            this.y = this.radius;
            this.velocity = 0;
        }
    },
    
    flap() {
        this.velocity = this.jump;
    }
};

// Pipes array
const pipes = [];
const pipeWidth = 50;
const gapY = 140; // Gap height between pipes
const dx = 2.5;   // Pipe speed

function drawPipes() {
    for (let i = 0; i < pipes.length; i++) {
        const p = pipes[i];
        
        ctx.fillStyle = '#38bdf8';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#38bdf8';
        
        // Target rects
        // Top pipe
        ctx.fillRect(p.x, 0, pipeWidth, p.top);
        // Bottom pipe
        ctx.fillRect(p.x, canvas.height - p.bottom, pipeWidth, p.bottom);
        
        ctx.shadowBlur = 0;
        
        p.x -= dx;
        
        // Collision Detection
        // X bounds overlap
        if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + pipeWidth) {
            // Y bounds overlap
            if (bird.y - bird.radius < p.top || bird.y + bird.radius > canvas.height - p.bottom) {
                gameOver();
            }
        }
        
        // Score logic
        if (p.x === bird.x) {
            score++;
        }
        
        // Remove off-screen pipes
        if (p.x + pipeWidth <= 0) {
            pipes.shift();
            i--;
        }
    }
}

function spawnPipe() {
    if (frames % 100 === 0) { // Every 100 frames
        // Random top pipe height
        const minHeight = 50;
        const maxHeight = canvas.height - gapY - minHeight;
        const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        
        pipes.push({
            x: canvas.width,
            top: topHeight,
            bottom: canvas.height - (topHeight + gapY)
        });
    }
}

function drawScore() {
    ctx.fillStyle = '#fff';
    ctx.font = '24px Orbitron';
    ctx.fillText(`Score: ${score}`, 20, 40);
}

function loop() {
    if (!isPlaying) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    bird.draw();
    bird.update();
    
    spawnPipe();
    drawPipes();
    drawScore();
    
    frames++;
    animationId = requestAnimationFrame(loop);
}

function startGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes.length = 0;
    frames = 0;
    score = 0;
    isPlaying = true;
    isGameOver = false;
    canRestart = true;
    
    startOverlay.classList.add('hidden');
    gameOverOverlay.classList.add('hidden');
    
    loop();
}

function gameOver() {
    isPlaying = false;
    isGameOver = true;
    canRestart = false; // Disable restart immediately
    cancelAnimationFrame(animationId);
    
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('flappyBest', bestScore);
    }
    
    finalScoreEl.innerText = score;
    bestScoreEl.innerText = bestScore;
    gameOverOverlay.classList.remove('hidden');

    // Enable restart after 1 second
    setTimeout(() => {
        canRestart = true;
    }, 1000);
}

// Controls
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        if (!isPlaying && !isGameOver) {
            startGame();
            bird.flap();
        } else if (isPlaying) {
            bird.flap();
        } else if (isGameOver && canRestart) {
            startGame();
        }
    }
});

canvas.addEventListener('mousedown', () => {
    if (!isPlaying && !isGameOver) {
        startGame();
        bird.flap();
    } else if (isPlaying) {
        bird.flap();
    } else if (isGameOver && canRestart) {
        startGame();
    }
});

restartBtn.addEventListener('click', (e) => {
    if (canRestart) startGame();
});

// Start draw static initially
bird.draw();
