// Game states
let gameState = 'house';  // 'house' = Zain walking, 'car' = Driving, 'wajiha' = Wajiha chase, 'gameOver' = crashed, 'caught' = success

// Timer for the driving segment (in seconds)
let timeRemaining = 40;  // 40 seconds for the driving segment

// Zain's object (x, y position, speed, etc.)
let zain = { x: 50, y: 300, width: 30, height: 50, speed: 0.8 };

// Car object (stationary blue car)
let car = { x: 600, y: 300, width: 50, height: 30, color: 'blue' };

// Wajiha object (chase)
let wajiha = { x: 700, y: 200, width: 30, height: 50, speed: 0.7 };

// Game canvas and context setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 1000;
canvas.height = 400;

// Controls setup
let keys = {};

// Listen for key events
window.addEventListener('keydown', (e) => { keys[e.key] = true; });
window.addEventListener('keyup', (e) => { keys[e.key] = false; });

// Flag for starting the transition to the car segment
let transitioningToCar = false;

// Car driving variables
let carX = 0;  // Start at the left of the screen
let carSpeed = 5;  // Speed of the car during the driving segment
let obstacles = [];  // Array to hold obstacles

// Timer function to count down the driving time
function startDrivingTimer() {
    if (timeRemaining > 0 && gameState === 'car') {
        setTimeout(() => {
            timeRemaining--;
            startDrivingTimer();  // Call the timer function again
        }, 1000);
    } else if (timeRemaining === 0 && gameState === 'car') {
        gameState = 'wajiha';  // Transition to Wajiha chase after time runs out
    }
}

// Function to draw Zain (red rectangle)
function drawZain() {
    ctx.fillStyle = "red";
    ctx.fillRect(zain.x, zain.y, zain.width, zain.height);
}

// Function to draw Wajiha (green rectangle)
function drawWajiha() {
    ctx.fillStyle = "pink"; // Wajiha as a pink rectangle
    ctx.fillRect(wajiha.x, wajiha.y, wajiha.width, wajiha.height);
}

// Function to update Zain's movement (up, down, left, right)
function updateZainMovement() {
    if (keys['ArrowRight'] && zain.x < canvas.width - zain.width) zain.x += zain.speed;
    if (keys['ArrowLeft'] && zain.x > 0) zain.x -= zain.speed;
    if (keys['ArrowUp'] && zain.y > 0) zain.y -= zain.speed;
    if (keys['ArrowDown'] && zain.y < canvas.height - zain.height) zain.y += zain.speed;
}

// Function to draw the stationary car
function drawCar() {
    ctx.fillStyle = car.color;
    ctx.fillRect(car.x, car.y, car.width, car.height);
}

// Function to drive the car (stationary car)
function driveCar() {
    if (keys['ArrowRight']) carX += carSpeed;
    if (keys['ArrowLeft']) carX -= carSpeed;
    if (carX < 0) carX = 0;
    if (carX > canvas.width - 50) carX = canvas.width - 50;

    // Draw the player's car on the road
    ctx.fillStyle = 'blue';
    ctx.fillRect(carX, canvas.height - 60, 50, 30);
    drawObstacles();  // Draw obstacles
}

// Function to generate obstacles
function generateObstacles() {
    if (Math.random() < 0.02) {
        let obstacleX = Math.random() * (canvas.width - 50);
        obstacles.push({ x: obstacleX, y: -30, width: 50, height: 30 });
    }
}

// Function to draw obstacles
function drawObstacles() {
    ctx.fillStyle = 'red';
    obstacles.forEach(obstacle => {
        obstacle.y += 3;  // Move obstacle downwards
        ctx.drawImage(assets.obstacleImage, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
    obstacles = obstacles.filter(obstacle => obstacle.y < canvas.height);  // Remove obstacles off the screen
}

// Function to check if car hits an obstacle
function checkCollision() {
    obstacles.forEach(obstacle => {
        if (
            carX < obstacle.x + obstacle.width &&
            carX + 50 > obstacle.x &&
            canvas.height - 60 < obstacle.y + obstacle.height &&
            canvas.height - 30 > obstacle.y
        ) {
            gameState = 'gameOver';  // Crash occurred
            alert("You crashed! Game over.");
        }
    });
}

// Function to update Wajiha's movement (copy Zain's movement)
function updateWajihaMovement() {
    if (keys['ArrowRight'] && wajiha.x < canvas.width - wajiha.width) wajiha.x += wajiha.speed;
    if (keys['ArrowLeft'] && wajiha.x > 0) wajiha.x -= wajiha.speed;
    if (keys['ArrowUp'] && wajiha.y > 0) wajiha.y -= wajiha.speed;
    if (keys['ArrowDown'] && wajiha.y < canvas.height - wajiha.height) wajiha.y += wajiha.speed;
}

// Function to check if Zain catches Wajiha
function checkCatch() {
    if (
        zain.x < wajiha.x + wajiha.width &&
        zain.x + zain.width > wajiha.x &&
        zain.y < wajiha.y + wajiha.height &&
        zain.y + zain.height > wajiha.y
    ) {
        gameState = 'caught';  // Transition to success
        alert("Zain gave Wajiha the flowers!");
    }
}

// Game update function (called every frame)
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas

    if (gameState === 'house') {
        // Zain walking to the car
        ctx.fillStyle = "#E0BBE4";  // Background color for this segment
        ctx.fillRect(0, 0, canvas.width, canvas.height);  // Draw background
        drawCar();  // Draw stationary car
        drawZain();  // Draw Zain
        updateZainMovement();  // Update Zain's movement

        // Check if Zain reaches the car (simple collision detection)
        if (zain.x + zain.width >= car.x && zain.y + zain.height >= car.y) {
            gameState = 'car';  // Transition to the car driving segment
            startDrivingTimer();  // Start the driving timer
        }

        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText("Walk to the car!", 350, 30);
    } else if (gameState === 'car') {
        // Car driving segment (40 seconds timer)
        generateObstacles();  // Generate obstacles
        ctx.fillStyle = "#8B4513";  // Road color (brown)
        ctx.fillRect(0, canvas.height - 100, canvas.width, 100);  // Road section
        driveCar();  // Draw and move the car
        checkCollision();  // Check if the car hits an obstacle
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.fillText(`Time Left: ${timeRemaining}s`, 20, 30);
    } else if (gameState === 'wajiha') {
        // Wajiha chase segment
        ctx.fillStyle = "#E0BBE4";  // Background color for this segment
        ctx.fillRect(0, 0, canvas.width, canvas.height);  // Draw background
        drawZain();
        drawWajiha();  // Draw Wajiha
        updateZainMovement();  // Update Zain's movement
        updateWajihaMovement();  // Update Wajiha's movement
        checkCatch();  // Check if Zain catches Wajiha
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText("Catch Wajiha!", 350, 30);
    } else if (gameState === 'gameOver') {
        ctx.fillStyle = "black";
        ctx.font = "40px Arial";
        ctx.fillText("Game Over! You crashed.", 300, 200);
    } else if (gameState === 'caught') {
        ctx.fillStyle = "green";
        ctx.font = "40px Arial";
        ctx.fillText("You caught Wajiha! Success!", 300, 200);
    }

    requestAnimationFrame(update);  // Keep the game loop running
}

// Start the game loop
update();