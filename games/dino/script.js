const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startOverlay = document.getElementById('start-overlay');
const gameOverOverlay = document.getElementById('game-over-overlay');
const restartBtn = document.getElementById('restart-btn');
const scoreEl = document.getElementById('score');
const bestScoreEl = document.getElementById('best-score');

// Assets - Embedded Base64 to ensure immediate loading in local file environments
const dinoImg = new Image();
dinoImg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFmElEQVR4nO2by08TfRTHv7/fT6m0tMBQUCmiID5AwiOoiUvBDRtjXJm4MkaNOTFxZ+LChRvXLv0XunPtxpVrY2KMicvExEei8REfIKAgD1veQKXzfgeGtjN0ptAptPZ8k06TzvzunPP9nXPv70whUilMo76+Pj+RSOQHAgH/4ODgt6GhobfDw8Nve3p6XvX09LxuamravXv37p07d+7cuXPnzp07d+7cuXPnzp07d+7cuf+fO3fu3Pl/8W8vLCzMTE9PT01PT09PT09PT09PT09PT09PX7p06dLly5cvX758+fLly5cvX758+fLly5cvX74AALv37du3b88AAGwGg8HoMAwGisFisBjq6uryAoHA7v7+/r0fM09PT09NT09PX7p06dLly5cvX758+fLlNzc3734YDAZDRkdH/wAA+A99fX1+m80Wi8XjcZfL5bbZbhg/Zqampi4BAAgEAn7D0NDQ287Ozt6Ojo7eAABga2tr271z5869+7du3bp95eP69eurL1++fOnLly9ffvnypXpXV9ernp6e1z09Pa+bmpp2A8Cw2WwOBofDYHAYDAbD/8Wv6uvr89vtdvudO3fu3Llz586dO3fu3LmfOnfu3Llz586dO3fue8fGxmaAERERXre7iIiICABEREREfPTo0SMCAAIhIuLjY8eOHSMiXne7ERHxcUREBICIiIgAABEREQHh0aNHjwgACA8P7x8eHt6PiIiPj46Ofo+IiO8/e/bs96/bXf9YvH//fkREfHz//v2I8O3bt/+OiIiI8PTp098fEREREfHOnTt3iAiPHTt2hInrExMTnuPHjz8hIjx58uS3ExMTnhMTE57jx48/Ia4vLi5OHDt27Ahx7fTp048TE54Tx48fP0IsDA0NeU6fPv04MTnhOTEx4Tl9+vTjxMK5c+e+P378+BNifUNDQ57a2tq6uro6v76+Pj86Ovr92bNnvxMBAQBAQABARERERERERERERETExERERERERERERERExAsAwADAzAAAIyMjI8MAMHw4cODAgaGhIc+p06cfJyYGgOEjAHDgwIEhH9fX1tbWMzMzAyMjIwAAAwMDgImB/yAmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiZmeGBgACMjIwMDAwPDhw8fDv8pMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExtbW1dQAA+AAsLS3NAAA4HA6H2263O78B8N/AarXaHT6vP9S7v79/79DQ0NuOjo7eLpfL7XY4HAYAw9DQ0NuhoaG3/v7+vR+2trbeDgBAV1fXKwBAU1PTLgDAZ8DpdLotFovNZrPZ/kXf8OHBgwcHDA0NeTo7O3uvXLmyeufKlf963C6Xy22xWGwOh8vldrv944vExMTUwMAA/yEiIsJz5syZBwCApqammunp6anjx48/vXz5csk3N998880333zzzTfffPPPv+DfvLq6Or++vj4fADA6Ovo9AAB+f39/fygUChmNf6Lp6OjobGtr621paWkGAMBo/LMBg8Gws9Ptdrt9Pq/X5zMaDC6fzxeNRp1R39z8uG9ufp9P8fmcUfC4I987Ojr6fD5X8Lsh3zsa9AWDfndI8Dt8QZ/REwwBf39/vzsajTr9Xn+oz+X07Vv09e1d8HntQe/9eYfPF/O6XMHvPk/U67O9D/ndf8I39M2fW/T17VvwvA8Z/X7Xo94Heo86I74Fh8PptNlsoYWBgc8PBAJBv8vlsv82/G0fMvE+M9G43zM68stA70f/3N9W+7GId7zR6+p3vO1723dvH/C4rY97Xxt+tzn2z7e65rN8fUv/8vWtnT8X/p0IAn63+YvPPffv8r/N/6vfvX0L8P8DqG78Wv59GqIAAAAASUVORK5CYII=';

// Game Vars
let animationId;
let isPlaying = false;
let isGameOver = false;
let score = 0;
let bestScore = localStorage.getItem('dinoBest') || 0;
let gameSpeed = 5;
let frames = 0;

bestScoreEl.innerText = Math.floor(bestScore);

const dino = {
    x: 50,
    y: 200,
    width: 60,  // Slightly larger for the image
    height: 60,
    dy: 0,
    jumpForce: 13,
    gravity: 0.7,
    grounded: false,

    draw() {
        try {
            ctx.drawImage(dinoImg, this.x, this.y, this.width, this.height);
        } catch (e) {
            // Final fallback if drawImage fails
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    },

    update() {
        if (this.y + this.height < canvas.height - 20) {
            this.dy += this.gravity;
            this.grounded = false;
        } else {
            this.dy = 0;
            this.grounded = true;
            this.y = canvas.height - 20 - this.height;
        }

        this.y += this.dy;
        this.draw();
    },

    jump() {
        if (this.grounded) {
            this.dy = -this.jumpForce;
            this.grounded = false;
        }
    }
};

const obstacles = [];
const obstacleTypes = ['rect', 'triangle', 'wide'];

function spawnObstacle() {
    const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
    let width = 30;
    let height = 30 + Math.random() * 20;
    
    if (type === 'wide') {
        width = 60;
        height = 30;
    }

    let obs = {
        x: canvas.width,
        y: canvas.height - 20 - height,
        width: width,
        height: height,
        type: type
    };
    obstacles.push(obs);
}

function drawObstacle(obs) {
    ctx.fillStyle = '#facc15';

    if (obs.type === 'triangle') {
        ctx.beginPath();
        ctx.moveTo(obs.x, obs.y + obs.height);
        ctx.lineTo(obs.x + obs.width / 2, obs.y);
        ctx.lineTo(obs.x + obs.width, obs.y + obs.height);
        ctx.closePath();
        ctx.fill();
    } else if (obs.type === 'wide') {
        // Draw two small rects close together to look like a cluster
        ctx.fillRect(obs.x, obs.y, obs.width / 3, obs.height);
        ctx.fillRect(obs.x + obs.width / 1.5, obs.y + obs.height * 0.2, obs.width / 3, obs.height * 0.8);
    } else {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    }
}

function handleObstacles() {
    let spawnTimer = Math.max(40, 100 - (gameSpeed * 5));
    
    if (frames % Math.floor(spawnTimer) === 0) {
        spawnObstacle();
    }

    for (let i = 0; i < obstacles.length; i++) {
        let obs = obstacles[i];
        obs.x -= gameSpeed;

        drawObstacle(obs);

        // Collision Check (AABB with slightly more padding for a pixel Dino)
        const padding = 12;
        if (
            dino.x + padding < obs.x + obs.width &&
            dino.x + dino.width - padding > obs.x &&
            dino.y + padding < obs.y + obs.height &&
            dino.y + dino.height - padding > obs.y
        ) {
            console.log('Collision with', obs.type);
            gameOver();
        }

        // Remove off-screen
        if (obs.x + obs.width < -100) {
            obstacles.splice(i, 1);
            i--;
        }
    }
}

function drawGround() {
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 20);
    ctx.lineTo(canvas.width, canvas.height - 20);
    ctx.stroke();
    
    // Add some ground detail
    ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
    for(let i = 0; i < canvas.width; i += 100) {
        ctx.fillRect(i + (frames % 100), canvas.height - 18, 20, 2);
    }
}

function loop() {
    if (!isPlaying) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawGround();
    dino.update();
    handleObstacles();
    
    // Update Score
    score += 0.1;
    scoreEl.innerText = Math.floor(score);
    
    // Increase difficulty
    gameSpeed += 0.0015;

    frames++;
    animationId = requestAnimationFrame(loop);
}

function startGame() {
    isPlaying = true;
    isGameOver = false;
    score = 0;
    gameSpeed = 6;
    frames = 0;
    obstacles.length = 0;
    dino.y = canvas.height - 20 - dino.height;
    dino.dy = 0;
    
    scoreEl.innerText = 0;
    bestScoreEl.innerText = Math.floor(bestScore);
    
    startOverlay.classList.add('hidden');
    gameOverOverlay.classList.add('hidden');
    
    loop();
}

function gameOver() {
    isPlaying = false;
    isGameOver = true;
    cancelAnimationFrame(animationId);
    
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('dinoBest', bestScore);
    }
    bestScoreEl.innerText = Math.floor(bestScore);
    gameOverOverlay.classList.remove('hidden');
}

// Input listeners - Using window for better focus reliability
window.addEventListener('keydown', (e) => {
    console.log('Key pressed:', e.key, e.code);
    if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault(); // Prevent scrolling
        handleAction();
    }
});

// Click/Touch support for mobile and better robustness
window.addEventListener('mousedown', (e) => {
    // Only jump if clicking inside the game area or buttons handled it
    if (e.target === canvas || !isPlaying) {
        handleAction();
    }
});

function handleAction() {
    if (!isPlaying && !isGameOver) {
        console.log('Starting game...');
        startGame();
        dino.jump();
    } else if (isPlaying) {
        dino.jump();
    } else if (isGameOver) {
        console.log('Restarting game...');
        startGame();
    }
}

restartBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    startGame();
});

// Initial draw
dinoImg.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGround();
    dino.draw();
};
