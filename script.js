// game.js

// Get the canvas and its context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.querySelector("#score");
const time = document.querySelector("#timer");
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

const blueCircleSpawnRate = 0.3; // Adjust this value for desired spawn rate
// Load the image for the red circle
const image = new Image();
image.src = 'money.png';

//load bomb image
const image2 = new Image()
image2.src = 'bomb.png'

// Load the image for the player
const playerImage = new Image();
playerImage.src = 'box.png';

//sound
const coinSound = new Audio("/audio/coinsound.mp3");
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
    } else{
        
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
            // Remove the circle and player
            circles.splice(i, 1);
            i--;
            if (!circle.isBlue) {
                score += 100;
            } else {
                score -= 100;
            }
            scoreEl.textContent = score;
            continue; // Skip further processing for this circle since it's removed
        }

        // Check collision with the bottom of canvas
        if (circle.y > canvas.height + circleRadius) {
            circles.splice(i, 1); // Remove circle if it's beyond canvas height
            i--; // Decrement i since array length has changed
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
        if (circle.isBlue) {
            // ctx.beginPath();
            // ctx.arc(circle.x, circle.y, circleRadius, 0, Math.PI * 2);
            // ctx.fillStyle = '#0000FF';
            // ctx.fill();
            // ctx.closePath();
            
            const imageWidth = circleRadius * 8; // Adjust the multiplier as needed
            const imageHeight = circleRadius * 8; // Keep aspect ratio
            ctx.drawImage(circle.image, circle.x - imageWidth / 2, circle.y - imageHeight / 2, imageWidth, imageHeight);
        } else {
             // Adjust the width here (e.g., multiply by 2)
            const imageWidth = circleRadius * 9; // Adjust the multiplier as needed
            const imageHeight = circleRadius * 9; // Keep aspect ratio
            ctx.drawImage(circle.image, circle.x - imageWidth / 2, circle.y - imageHeight / 2, imageWidth, imageHeight);
        }
    }
}

let score = 0

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
            // Remove the circle and player
            circles.splice(i, 1);
            i--;
            if (!circle.isBlue) {
                coinSound.play();
                score += 100;
            } else {
                bombSound.play()
                score -= 100;
            }
            scoreEl.textContent = score;
            continue; // Skip further processing for this circle since it's removed
        }

        // Check collision with the bottom of canvas
        if (circle.y > canvas.height + circleRadius) {
            circles.splice(i, 1); // Remove circle if it's beyond canvas height
            i--; // Decrement i since array length has changed
        }
    }
}

// Timer variables
let gameTimeInSeconds = 60; // 2 minutes
let gameOver = false;
let lastTime = 0;
let timerInterval;


// Function to show game over dialog
function showGameOverDialog() {
    var scoreDisplay = gameOverDialog.querySelector("#scoreDisplay");

    scoreDisplay.textContent = score;

    gameOverDialog.style.display = 'block';

}


// Update timer
function updateTimer(deltaTime) {
    gameTimeInSeconds -= deltaTime / 1000;
    const minutes = Math.floor(gameTimeInSeconds / 60);
    const seconds = Math.floor(gameTimeInSeconds % 60);
    time.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    if (gameTimeInSeconds <= 0) {
        gameOver = true;
        gameOverSound.play()
        clearInterval(timerInterval);
        showGameOverDialog(); // Call function to show game over dialog
    }
}


// Function to restart the game
function restartGame() {
    // Reset game variables
    gameTimeInSeconds = 60;
    gameOver = false;
    score = 0;
    circles.length = 0; // Clear circles array
    scoreEl.textContent = '0'; // Reset score display
    time.textContent = '01:00'; // Reset timer display

    // Hide the game over dialog
    gameOverDialog.style.display = 'none';

    // Restart the game loop
    lastTime = 0;
    requestAnimationFrame(gameLoop);
}

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
