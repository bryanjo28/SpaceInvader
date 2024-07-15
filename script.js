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
const maxLives = 3; // Maximum number of lives

// Load images
const images = [
    { src: 'money1.png', points: 1000, spawnRate: 0.06 },
    { src: 'money2.png', points: 500, spawnRate: 0.07 },
    { src: 'money3.png', points: 200, spawnRate: 0.09 },
    { src: 'money4.png', points: 100, spawnRate: 0.09 },
    { src: 'bomb2.png', points: -200, spawnRate: 0.08 } 
];

// Load bomb image
const image2 = new Image();
image2.src = 'bomb2.png';

// Load the image for the player
const playerImage = new Image();
playerImage.src = 'wallet.png';

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

// Variable for storing initial touch position
let touchStartX = null;

// Event listener for handling player movement by holding and swiping touch
canvas.addEventListener("touchstart", (event) => {
    touchStartX = event.touches[0].clientX; // Save initial touch position
});

canvas.addEventListener("touchmove", (event) => {
    // Only continue if there is an initial touch position
    if (touchStartX !== null) {
        // Calculate the change in finger position compared to the initial touch position
        const touchMoveX = event.touches[0].clientX;
        const touchDeltaX = touchMoveX - touchStartX;

        // Adjust player position based on change in finger position
        if (touchDeltaX > 0) {
            // Move to the right
            rightPressed = true;
            leftPressed = false;
        } else {
            // Move to the left
            leftPressed = true;
            rightPressed = false;
        }
    }
});

// Event listener to stop movement when the screen is released
canvas.addEventListener("touchend", () => {
    // Reset movement variables when the screen is released
    leftPressed = false;
    rightPressed = false;

    // Reset initial touch position
    touchStartX = null;
});

// Generate a random circle
function generateCircle() {
    let randomImage;
    while (!randomImage) {
        randomImage = images.find(image => Math.random() < image.spawnRate);
    }
    const x = Math.random() * (canvas.width - circleRadius * 2) + circleRadius;
    const y = -circleRadius;
    const speed = Math.random() * maxCircleSpeed + 1;
    const circle = {
        x,
        y,
        speed,
        image: new Image(),
        points: randomImage.points
    };
    circle.image.src = randomImage.src;
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
            if (circle.image.src !== image2.src) {
                coinSound.play();
                score += circle.points;
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
        const imageWidth = circleRadius * 10; // Adjust the multiplier as needed
        const imageHeight = circleRadius * 10; // Keep aspect ratio
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
