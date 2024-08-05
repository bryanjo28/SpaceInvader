let car = document.getElementById('car');
let obstacles = document.querySelectorAll('.obstacle');
let gameContainer = document.getElementById('game-container');
let road = document.getElementById('road');
let scoreElement = document.getElementById('score');
let timeElement = document.getElementById('time');
let livesElement = document.getElementById('lives');
let gameOverDialog = document.getElementById('game-over-dialog');
let finalScoreElement = document.getElementById('final-score');
let restartButton = document.getElementById('restart-button');

let carSpeed = 20;
let obstacleSpeed = 3;
let gameRunning = true;
let moveLeft = false;
let moveRight = false;
let score = 0;
let timeLeft = 60;
let lives = 3;

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') moveLeft = true;
    if (e.key === 'ArrowRight') moveRight = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') moveLeft = false;
    if (e.key === 'ArrowRight') moveRight = false;
});

document.addEventListener('touchstart', handleTouchStart);
document.addEventListener('touchmove', handleTouchMove);

function handleTouchStart(e) {
    let touchX = e.touches[0].clientX;
    let containerRect = gameContainer.getBoundingClientRect();
    if (touchX < containerRect.width / 2) {
        moveLeft = true;
    } else {
        moveRight = true;
    }
}

function handleTouchMove(e) {
    let touchX = e.touches[0].clientX;
    let containerRect = gameContainer.getBoundingClientRect();
    if (touchX < containerRect.width / 2) {
        moveLeft = true;
        moveRight = false;
    } else {
        moveLeft = false;
        moveRight = true;
    }
}

document.addEventListener('touchend', () => {
    moveLeft = false;
    moveRight = false;
});

function moveCar() {
    if (!gameRunning) return;

    let carRect = car.getBoundingClientRect();
    let containerRect = gameContainer.getBoundingClientRect();

    if (moveLeft && carRect.left > containerRect.left) {
        car.style.left = car.offsetLeft - carSpeed + 'px';
    }
    if (moveRight && carRect.right < containerRect.right) {
        car.style.left = car.offsetLeft + carSpeed + 'px';
    }
}

function moveObstacles() {
    if (!gameRunning) return;

    obstacles.forEach(obstacle => {
        let obstacleRect = obstacle.getBoundingClientRect();

        if (obstacleRect.top > window.innerHeight) {
            resetObstacle(obstacle);
            score += 10;
            scoreElement.innerText = `Score: ${score}`;
        } else {
            obstacle.style.top = obstacle.offsetTop + obstacleSpeed + 'px';
        }

        checkCollision(obstacle);
    });
}

function resetObstacle(obstacle) {
    let validPosition = false;
    while (!validPosition) {
        obstacle.style.top = '-100px';
        obstacle.style.left = Math.random() * (road.offsetWidth - obstacle.offsetWidth) + 'px';

        validPosition = true;
        obstacles.forEach(otherObstacle => {
            if (otherObstacle !== obstacle) {
                let otherRect = otherObstacle.getBoundingClientRect();
                let thisRect = obstacle.getBoundingClientRect();

                if (!(thisRect.right < otherRect.left ||
                      thisRect.left > otherRect.right ||
                      thisRect.bottom < otherRect.top ||
                      thisRect.top > otherRect.bottom)) {
                    validPosition = false;
                }
            }
        });
    }
}

function checkCollision(obstacle) {
    let carRect = car.getBoundingClientRect();
    let obstacleRect = obstacle.getBoundingClientRect();

    if (!(carRect.right < obstacleRect.left ||
          carRect.left > obstacleRect.right ||
          carRect.bottom < obstacleRect.top ||
          carRect.top > obstacleRect.bottom)) {
        reduceLife(obstacle);
    }
}

function reduceLife(obstacle) {
    if (lives > 0) {
        lives--;
        livesElement.removeChild(livesElement.lastElementChild);
    }

    if (lives === 0) {
        gameRunning = false;
        showGameOver();
    } else {
        resetObstacle(obstacle);  // Reset the obstacle to avoid multiple collisions with the same obstacle
    }
}

function startGame() {
    obstacles.forEach(resetObstacle);
    setInterval(() => {
        moveCar();
        moveObstacles();
    }, 16);
    setInterval(() => {
        if (gameRunning) {
            timeLeft--;
            timeElement.innerText = `Time: ${timeLeft}s`;
            if (timeLeft === 0) {
                gameRunning = false;
                showGameOver();
            }
        }
    }, 1000);
}

function showGameOver() {
    finalScoreElement.innerText = score;
    gameOverDialog.style.display = 'block';
}

function restartGame() {
    score = 0;
    timeLeft = 60;
    lives = 3;
    gameRunning = true;
    scoreElement.innerText = 'Score: 0';
    timeElement.innerText = 'Time: 60s';
    livesElement.innerHTML = '<i class="fas fa-heart"></i><i class="fas fa-heart"></i><i class="fas fa-heart"></i>';
    obstacles.forEach(resetObstacle);
    gameOverDialog.style.display = 'none';
}

restartButton.addEventListener('click', restartGame);

startGame();
