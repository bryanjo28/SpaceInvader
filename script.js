// game.js

// Get the canvas and its context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.querySelector("#score");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Player object
const player = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    width: 50,
    height: 50,
    speed: 5
};

// Circles array
const circles = [];
const circleRadius = 15;
const maxCircleSpeed = 5;

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
    const x = Math.random() * (canvas.width - circleRadius * 2) + circleRadius;
    const y = -circleRadius;
    const speed = Math.random() * maxCircleSpeed + 1;
    circles.push({ x, y, speed });
}


// Update circles position and check for collision with the bottom of canvas
function updateCircles() {
    for (let i = 0; i < circles.length; i++) {
        const circle = circles[i];
        circle.y += circle.speed;
        if (circle.y > canvas.height + circleRadius) {
            circles.splice(i, 1); // Remove circle if it's beyond canvas height
            i--; // Decrement i since array length has changed
        }
    }
}

// Draw player
function drawPlayer() {
    ctx.beginPath();
    ctx.rect(player.x, player.y, player.width, player.height);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

// Draw circles
function drawCircles() {
    for (const circle of circles) {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circleRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#FF0000';
        ctx.fill();
        ctx.closePath();
    }
}

let score = 0
// Update circles position and check for collision with the player or the bottom of canvas
function updateCircles() {
    for (let i = 0; i < circles.length; i++) {
        const circle = circles[i];
        circle.y += circle.speed;

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
            score += 100
			scoreEl.innerHTML = score
            continue; // Skip further processing for this circle since it's removed
        }

        // Check collision with the bottom of canvas
        if (circle.y > canvas.height + circleRadius) {
            circles.splice(i, 1); // Remove circle if it's beyond canvas height
            i--; // Decrement i since array length has changed
        }
    }
}

// Main game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updatePlayer();
    updateCircles();
    drawPlayer();
    drawCircles();

    // Generate a new circle randomly
    if (Math.random() < 0.02) {
        generateCircle();
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();
