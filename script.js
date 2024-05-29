// game.js

// Get the canvas and its context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.querySelector("#score");
const time = document.querySelector("#timer");
const livesContainer = document.querySelector("#lives");
const gameOverDialog = document.querySelector("#gameOverDialog");


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Player object
const player = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    width: 130,
    height: 130,
    speed: 5
};

// Circles array
const circles = [];
const circleRadius = 15;
const maxCircleSpeed = 5;
const blueCircleSpawnRate = 0.4;
const maxLives = 3; // Maximum number of lives

// Load the image for the red circle
const image = new Image();
image.src = 'money.png';

// Load bomb image
const image2 = new Image()
image2.src = 'bomb.png'

// Load the image for the player
const playerImage = new Image();
playerImage.src = 'box.png';

// Load heart image
const heartImage = new Image();
heartImage.src = 'heart.png';

// Sound
const coinSound = new Audio("/audio/coinsoundmin.mp3");
const bombSound = new Audio("/audio/explode.wav");
const gameOverSound = new Audio("/audio/gameover.mp3");

// Keyboard event listeners
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

let rightPressed = false;
let leftPressed = false;

function keyDownHandler(event) {
    if (event.key === 'd' || event.key === 'D') {
        rightPressed = true;
    } else if (event.key === 'a' || event.key === 'A') {
        leftPressed = true;
    }
}

function keyUpHandler(event) {
    if (event.key === 'd' || event.key === 'D') {
        rightPressed = false;
    } else if (event.key === 'a' || event.key === 'A') {
        leftPressed = false;
    }
}

// Update player position
function updatePlayer() {
    if (rightPressed && player.x < canvas.width - player.width) {
        player.x += player.speed;
    } else if (leftPressed && player.x > 0) {
        player.x -= player.speed;
    }
}

// Player movement variables
let touchStartX = null;

// Touch event listeners
canvas.addEventListener('touchstart', handleTouchStart, false);
canvas.addEventListener('touchmove', handleTouchMove, false);
canvas.addEventListener('touchend', handleTouchEnd, false);

// Handle touch start event
function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
}

// Handle touch move event
function handleTouchMove(event) {
    event.preventDefault(); // Prevent scrolling while swiping
}

// Handle touch end event
function handleTouchEnd(event) {
    if (!touchStartX) return;

    const touchEndX = event.changedTouches[0].clientX;
    const swipeDistance = touchEndX - touchStartX;

    // Determine if swipe is significant enough
    if (Math.abs(swipeDistance) > 50) {
        if (swipeDistance > 0) {
            // Swipe right
            rightPressed = true;
            leftPressed = false;
        } else {
            // Swipe left
            rightPressed = false;
            leftPressed = true;
        }
    }

    // Reset touch start position
    touchStartX = null;
}

// Generate a random circle
function generateCircle() {
    const isBlue = Math.random() < blueCircleSpawnRate;
    const x = Math.random() * (canvas.width - circleRadius * 2) + circleRadius;
    const y = -circleRadius;
    const speed = Math.random() * maxCircleSpeed + 1;
    const circle = {
        x,
        y,
        speed,
        isBlue
    };
    if (isBlue) {
        circle.image = image2;
    } else {
        circle.image = image;
    }
    circles.push(circle);
}

// Update circles position and check for collision with the player or the bottom of canvas
function updateCircles(deltaTime) {
    for (let i = 0; i < circles.length; i++) {
        const circle = circles[i];
        circle.y += circle.speed * deltaTime / 15;

        // Check collision with the player
        if (
            circle.x > player.x &&
            circle.x < player.x + player.width &&
            circle.y > player.y &&
            circle.y < player.y + player.height
        ) {
            circles.splice(i, 1);
            i--;
            if (!circle.isBlue) {
                coinSound.play();
                score += 100;
            } else {
                bombSound.play();
                lives--; // Reduce lives if hit a bomb
                updateLivesDisplay(); // Update lives display
                if (lives === 0) {
                    gameOver = true;
                    gameOverSound.play();
                    clearInterval(timerInterval);
                    showGameOverDialog(); // Call function to show game over dialog
                }
            }
            scoreEl.textContent = score;
            continue;
        }

        // Check collision with the bottom of canvas
        if (circle.y > canvas.height + circleRadius) {
            circles.splice(i, 1);
            i--;
        }
    }
}

// Draw player
function drawPlayer() {
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

// Draw circles
function drawCircles() {
    for (const circle of circles) {
        const imageWidth = circleRadius * 8; // Adjust the multiplier as needed
        const imageHeight = circleRadius * 8; // Keep aspect ratio
        ctx.drawImage(circle.image, circle.x - imageWidth / 2, circle.y - imageHeight / 2, imageWidth, imageHeight);
    }
}

let score = 0;
let lives = maxLives; // Initial number of lives
let gameOver = false;
let lastTime = 0;
let timerInterval;

// Function to show game over dialog
function showGameOverDialog() {
    var scoreDisplay = gameOverDialog.querySelector("#scoreDisplay");
    scoreDisplay.textContent = score;
    gameOverDialog.style.display = 'block';
}

// Function to restart the game
function restartGame() {
    // Reset game variables
    gameOver = false;
    score = 0;
    lives = maxLives;
    circles.length = 0; // Clear circles array
    scoreEl.textContent = '0'; // Reset score display
    updateLivesDisplay(); // Reset lives display

    // Hide the game over dialog
    gameOverDialog.style.display = 'none';

    // Restart the game loop
    lastTime = 0;
    requestAnimationFrame(gameLoop);
}

// Update timer
function updateTimer(deltaTime) {
    // Time is unlimited, no need to update timer
}

// Function to update lives display
function updateLivesDisplay() {
    livesContainer.innerHTML = '';
    for (let i = 0; i < lives; i++) {
        livesContainer.innerHTML += '<span class="life-icon"><img src="heart.png" alt="Heart"></span>';
    }
}

updateLivesDisplay(); // Call the function to display initial lives

// Main game loop
function gameLoop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    if (!gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        updatePlayer();
        updateCircles(deltaTime);
        drawPlayer();
        drawCircles();
        updateTimer(deltaTime);

        // Generate a new circle randomly
        if (Math.random() < 0.02) {
            generateCircle();
        }

        requestAnimationFrame(gameLoop);
    }
}

requestAnimationFrame(gameLoop);
