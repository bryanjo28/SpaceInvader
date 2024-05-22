const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fingerX = canvas.width / 2;
let fingerY = canvas.height / 2;
let dotX = 20;
let dotY = 20;
const dotRadius = 10;
let gameOver = false;

let blocks = [];
let blockWidth; // Will be set based on the knife image dimensions
let blockHeight; // Will be set based on the knife image dimensions
let blockSpeed = canvas.height * 0.005; // 0.5% of canvas height
let dotSpeed = canvas.height * 0.005; // 0.5% of canvas height
let speedIncrementInterval = 5000; // Increase speed every 5 seconds
let speedIncrementAmount = canvas.height * 0.0005; // Increment amount proportional to canvas height

let score = 0;
let scoreInterval;
let blockSpawnInterval;
let speedIncrement;

// Load the knife texture image
const knifeImage = new Image();
knifeImage.src = 'knive.png'; // Example knife texture URL

knifeImage.onload = function() {
    // Set block dimensions based on the image dimensions
    const scale = canvas.width / 20 / knifeImage.width; 
    blockWidth = knifeImage.width * scale;
    blockHeight = knifeImage.height * scale;

    // Start the game only after the image has loaded
    startGame();
};

function updateFingerPosition(x, y) {
    fingerX = x;
    fingerY = y;
}

canvas.addEventListener('touchmove', (event) => {
    const touch = event.touches[0];
    updateFingerPosition(touch.clientX, touch.clientY);
});

canvas.addEventListener('mousemove', (event) => {
    updateFingerPosition(event.clientX, event.clientY);
});

function spawnBlock() {
    let blockX, blockY, overlap;

    do {
        overlap = false;
        blockX = Math.random() * (canvas.width - blockWidth);
        blockY = -blockHeight;

        // Check for overlap with existing blocks
        for (let block of blocks) {
            if (
                blockX < block.x + blockWidth &&
                blockX + blockWidth > block.x &&
                blockY < block.y + blockHeight &&
                blockY + blockHeight > block.y
            ) {
                overlap = true;
                break;
            }
        }
    } while (overlap);

    blocks.push({ x: blockX, y: blockY });
}

function update() {
    if (gameOver) return;

    // Move the dot towards the finger
    const dx = fingerX - dotX;
    const dy = fingerY - dotY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < dotRadius) {
        endGame();
        return;
    }

    dotX += (dx / distance) * dotSpeed;
    dotY += (dy / distance) * dotSpeed;

    // Update blocks
    for (let block of blocks) {
        block.y += blockSpeed;

        // Check for collision with finger
        if (
            fingerX > block.x &&
            fingerX < block.x + blockWidth &&
            fingerY > block.y &&
            fingerY < block.y + blockHeight
        ) {
            endGame();
            return;
        }
    }

    // Remove blocks that have fallen off the screen
    blocks = blocks.filter(block => block.y < canvas.height);

    draw();
    requestAnimationFrame(update);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the red dot
    ctx.beginPath();
    ctx.arc(dotX, dotY, dotRadius, 0, Math.PI * 2, false);
    ctx.fillStyle = 'red';
    ctx.fill();

    // Draw the falling blocks with knife image
    for (let block of blocks) {
        ctx.drawImage(knifeImage, block.x, block.y, blockWidth, blockHeight);
    }

    // Draw the player's finger position (for debug purposes)
    ctx.beginPath();
    ctx.arc(fingerX, fingerY, 5, 0, Math.PI * 2, false);
    ctx.fillStyle = 'blue';
    ctx.fill();

    // Draw the score
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'right';
    ctx.fillText(`Score: ${score}`, canvas.width - 10, 30);
}

function startGame() {
    gameOver = false;
    dotX = 20;
    dotY = 20;
    fingerX = canvas.width / 2;
    fingerY = canvas.height / 2;
    dotSpeed = canvas.height * 0.005;
    blockSpeed = canvas.height * 0.005;
    score = 0;
    blocks = [];
    
    document.getElementById('retryButton').style.display = 'none';
    document.getElementById('doneButton').style.display = 'none';
    document.getElementById('scoreMessage').style.display = 'none';

    // Increase the speed of the dot over time
    speedIncrement = setInterval(() => {
        dotSpeed += speedIncrementAmount;
        blockSpeed += speedIncrementAmount;
    }, speedIncrementInterval);

    blockSpawnInterval = setInterval(spawnBlock, 200);

    scoreInterval = setInterval(() => {
        if (!gameOver) {
            score++;
        }
    }, 1000);

    update();
}

function endGame() {
    gameOver = true;
    clearInterval(speedIncrement);
    clearInterval(blockSpawnInterval);
    clearInterval(scoreInterval);

    document.getElementById('scoreMessage').innerText = `Your score is: ${score}`;
    document.getElementById('scoreMessage').style.display = 'block';
    document.getElementById('retryButton').style.display = 'block';
    document.getElementById('doneButton').style.display = 'block';
}

function retryGame() {
    startGame();
}

function doneGame() {
    alert('Thank you for playing!');
}

// Don't start the game until the image has loaded
// startGame();
