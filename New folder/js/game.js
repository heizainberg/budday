// Game states
let gameState = 'house';  // 'house' = Zain walking, 'car' = Driving, 'wajiha' = Wajiha chase, 'gameOver' = crashed, 'caught' = success

// Timer for the driving segment (in seconds)
let timeRemaining = 5;  // 40 seconds for the driving segment

// Zain's object (x, y position, speed, etc.)
let zain = { x: 50, y: 200, width: 30, height: 50, speed: 0.6, direction: 'right' };  // Adjusted y position

// Car object (stationary blue car)
let car = { x: 800, y: 200, width: 50, height: 60, color: 'blue' };  // Adjusted dimensions

// Wajiha object (chase)
let wajiha = { x: 700, y: 200, width: 30, height: 50, speed: 0.3 };

// Objects for the third segment
let objects = [];

// Game canvas and context setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 1000;
canvas.height = 400;

// Controls setup
let keys = {};

// Listen for key events
window.addEventListener('keydown', (e) => { keys[e.key] = true; updateZainDirection(e.key); });
window.addEventListener('keyup', (e) => { keys[e.key] = false; });

// Flag for starting the transition to the car segment
let transitioningToCar = false;

// Car driving variables
let carX = canvas.width / 2 - car.width / 2;  // Center the car in the X axis
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
        // Set initial positions for the wajiha segment
        zain.x = 50;  // Zain on the opposite end
        zain.y = 200;
        wajiha.x = canvas.width / 2 - wajiha.width / 2;  // Wajiha in the center
        wajiha.y = 200;
        generateObjects();  // Generate objects for the third segment
    }
}

function drawZain() {
    let zainImage;

    if (isZainIdle) {
        // Use the idle sprite when Zain is not moving
        zainImage = new Image();
        zainImage.src = "C:/Users/Zain/New folder/game assets/Walking1_transparent_cropped.png";
    } else if (zain.direction === 'left') {
        // Use the left-facing sprite when moving left
        zainImage = assets.zainLeftImage;
    } else if (zain.direction === 'right') {
        // Use the right-facing sprite when moving right
        zainImage = assets.zainRightImage;
    }

    // Draw the Zain image
    ctx.drawImage(zainImage, zain.x, zain.y, zain.width, zain.height);
}

// Function to draw Wajiha
function drawWajiha() {
    if (assets.wajihaImage.complete) {
        ctx.drawImage(assets.wajihaImage, wajiha.x, wajiha.y, wajiha.width, wajiha.height);
    }
}

// Function to update Zain's movement (up, down, left, right)
function updateZainMovement() {
    if (keys['ArrowRight'] && zain.x < canvas.width - zain.width) zain.x += zain.speed;
    if (keys['ArrowLeft'] && zain.x > 0) zain.x -= zain.speed;
    if (keys['ArrowUp'] && zain.y > 0) zain.y -= zain.speed;
    if (keys['ArrowDown'] && zain.y < canvas.height - zain.height) zain.y += zain.speed;
}

let isZainIdle = true; // Flag to track if Zain is idle

// Function to update Zain's direction based on key pressed
function updateZainDirection(key) {
    if (key === 'ArrowRight') {
        zain.direction = 'right';
        isZainIdle = false;
    } else if (key === 'ArrowLeft') {
        zain.direction = 'left';
        isZainIdle = false;
    }
}

// Listen for keyup to set Zain as idle
window.addEventListener('keyup', (e) => {
    if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        isZainIdle = true;
    }
});

// Function to draw the car image
function drawCar() {
    ctx.drawImage(assets.carImage, car.x, car.y, car.width, car.height);
}

// Function to drive the car (stationary car)
function driveCar() {
    if (keys['ArrowRight']) carX += carSpeed;
    if (keys['ArrowLeft']) carX -= carSpeed;
    if (carX < 0) carX = 0;
    if (carX > canvas.width - car.width) carX = canvas.width - car.width;

    // Draw the player's car on the road
    ctx.drawImage(assets.carImage, carX, canvas.height - 60, car.width, car.height);
    drawObstacles();  // Draw obstacles
}

// Function to generate obstacles
function generateObstacles() {
    if (Math.random() < 0.02) {
        let obstacleX, obstacleY;
        let minDistance = 150;  // Minimum distance between obstacles
        let isValidPosition;
        let attempts = 0;  // Limit the number of attempts to avoid infinite loop

        do {
            obstacleX = Math.random() * (canvas.width - 50);
            obstacleY = -30;
            isValidPosition = obstacles.every(obstacle => {
                return Math.abs(obstacleX - obstacle.x) > minDistance;
            });
            attempts++;
        } while (!isValidPosition && attempts < 100);  // Limit attempts to 100

        if (isValidPosition) {
            let obstacleType = Math.random() < 0.5 ? 'obstacleImage1' : 'obstacleImage2';  // Randomly choose obstacle type
            obstacles.push({ x: obstacleX, y: obstacleY, width: 50, height: 30, type: obstacleType });
        }
    }
}

// Function to draw obstacles
function drawObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.y += 3;  // Move obstacle downwards
        ctx.drawImage(assets[obstacle.type], obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
    obstacles = obstacles.filter(obstacle => obstacle.y < canvas.height);  // Remove obstacles off the screen
}

// Function to check if car hits an obstacle
function checkCollision() {
    if (gameState === 'car') {
        obstacles.forEach(obstacle => {
            if (
                carX < obstacle.x + obstacle.width &&
                carX + car.width > obstacle.x &&
                canvas.height - 60 < obstacle.y + obstacle.height &&
                canvas.height - 30 > obstacle.y
            ) {
                // Stop the background music
                const backgroundMusic = document.getElementById("backgroundMusic");
                if (backgroundMusic) {
                    backgroundMusic.pause();
                    backgroundMusic.currentTime = 0; // Reset the music
                }

                // Play the "Game Over" sound
                const gameOverSound = new Audio("C:/Users/Zain/New folder/game assets/Game Over (Super Mario) - QuickSounds.com.mp3");
                gameOverSound.play();

                // Set the game state to 'gameOver'
                gameState = 'gameOver';
                alert("You crashed! Game over.");
            }
        });
    }
}

// Function to update Wajiha's movement to follow Zain
function updateWajihaMovement() {
    if (wajiha.x < zain.x) wajiha.x += wajiha.speed;
    if (wajiha.x > zain.x) wajiha.x -= wajiha.speed;
    if (wajiha.y < zain.y) wajiha.y += wajiha.speed;
    if (wajiha.y > zain.y) wajiha.y -= wajiha.speed;
}

// Function to check if Wajiha reaches the car
function checkWajihaReachesCar() {
    if (
        wajiha.x < car.x + car.width &&
        wajiha.x + wajiha.width > car.x &&
        wajiha.y < car.y + car.height &&
        wajiha.y + wajiha.height > car.y
    ) {
        // Stop the background music
        const backgroundMusic = document.getElementById("backgroundMusic");
        if (backgroundMusic) {
            backgroundMusic.pause();
            backgroundMusic.currentTime = 0; // Reset the music
        }

        // Play the "Win" sound
        const winSound = new Audio("C:/Users/Zain/New folder/game assets/8-bit-video-game-win-level-sound-version-1-145827.mp3");
        winSound.play();

        gameState = 'caught';  // Transition to success
        alert("Wajiha reached the car! Success!");
    }
}

// Function to generate objects for the third segment
function generateObjects() {
    objects = [];
    let rows = 2;
    let cols = 5;
    let objectWidth = 50;
    let objectHeight = 50;
    let xSpacing = (canvas.width - cols * objectWidth) / (cols + 1);
    let ySpacing = (canvas.height - rows * objectHeight) / (rows + 1);

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            let objectX = xSpacing + col * (objectWidth + xSpacing);
            let objectY = ySpacing + row * (objectHeight + ySpacing);
            objects.push({ x: objectX, y: objectY, width: objectWidth, height: objectHeight });
        }
    }
}

// Function to draw objects
function drawObjects() {
    objects.forEach(object => {
        ctx.drawImage(assets.objectImage, object.x, object.y, object.width, object.height);
    });
}

// Function to check if Zain or Wajiha hits an object
function checkObjectCollision() {
    objects.forEach(object => {
        if (
            (zain.x < object.x + object.width &&
            zain.x + zain.width > object.x &&
            zain.y < object.y + object.height &&
            zain.y + zain.height > object.y) ||
            (wajiha.x < object.x + object.width &&
            wajiha.x + wajiha.width > object.x &&
            wajiha.y < object.y + object.height &&
            wajiha.y + wajiha.height > object.y)
        ) {
            // Stop the background music
            const backgroundMusic = document.getElementById("backgroundMusic");
            if (backgroundMusic) {
                backgroundMusic.pause();
                backgroundMusic.currentTime = 0; // Reset the music
            }

            // Play the "Game Over" sound
            const gameOverSound = new Audio("C:/Users/Zain/New folder/game assets/Game Over (Super Mario) - QuickSounds.com.mp3");
            gameOverSound.play();

            gameState = 'gameOver';  // Collision occurred
            alert("You hit an object! Game over.");
        }
    });
}

// Function to display the transition screen
function displayTransitionScreen() {
    ctx.fillStyle = "pink";
    ctx.font = "40px 'Press Start 2P'";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("GET TO WAJIHA'S HOUSE", canvas.width / 2, canvas.height / 2);
}

// Function to start background music
function startBackgroundMusic() {
    const backgroundMusic = document.getElementById("backgroundMusic");
    backgroundMusic.playbackRate = 1.75;  // Set playback speed to 1.75x
    backgroundMusic.play();
}

// Game update function (called every frame)
function update(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas

    // Draw a white background on the canvas
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (gameState === 'house') {
        // Zain walking to the car
        ctx.drawImage(assets.townMapImage, 0, 0, canvas.width, canvas.height);  // Draw town map background
        drawCar();  // Draw car image
        drawZain();  // Draw Zain
        updateZainMovement();  // Update Zain's movement

        // Check if Zain reaches the car (simple collision detection)
        if (zain.x + zain.width >= car.x && zain.y + zain.height >= car.y) {
            gameState = 'transition';  // Transition to the transition screen
            setTimeout(() => {
                gameState = 'car';  // Transition to the car driving segment after 4 seconds
                startDrivingTimer();  // Start the driving timer
            }, 4000);
        }

        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText("Walk to the car!", 350, 30);
    } else if (gameState === 'transition') {
        // Display transition screen
        displayTransitionScreen();
    } else if (gameState === 'car') {
        // Car driving segment (40 seconds timer)
        generateObstacles();  // Generate obstacles
        ctx.drawImage(assets.roadImage, 0, 0, canvas.width, canvas.height);  // Draw road background
        driveCar();  // Draw and move the car
        checkCollision();  // Check if the car hits an obstacle
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText(`Time Left: ${timeRemaining}s`, canvas.width / 2 - 50, 30);  // Move the timer closer to the center
        ctx.fillStyle = "darkpink";
        ctx.font = "20px 'Press Start 2P'";
        ctx.textAlign = "center";
        ctx.fillText("AVOID THE SIRAIKIS AND MEOWS!!!", canvas.width / 2, 60);  // Move the text down
    } else if (gameState === 'wajiha') {
        // Wajiha chase segment
        ctx.drawImage(assets.wajihaBackgroundImage, 0, 0, canvas.width, canvas.height);  // Draw background image for this segment
        drawCar();  // Draw car image
        ctx.drawImage(assets.houseImage, canvas.width / 2 - 25, 200, 50, 50);  // Draw house image at a fixed position
        drawZain();
        drawWajiha();  // Draw Wajiha
        drawObjects();  // Draw objects
        updateZainMovement();  // Update Zain's movement
        updateWajihaMovement();  // Update Wajiha's movement
        checkWajihaReachesCar();  // Check if Wajiha reaches the car
        checkObjectCollision();  // Check if Zain or Wajiha hits an object
        ctx.fillStyle = "white";
        ctx.font = "20px 'Press Start 2P'";
        ctx.textAlign = "center";
        ctx.fillText("LEAD WAJIHA TO THE CAR!!!", canvas.width / 2, 30);  // Center the text
    } else if (gameState === 'gameOver') {
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";  // Adjusted font size
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Game Over! You crashed.", canvas.width / 2, canvas.height / 2);
    } else if (gameState === 'caught') {
        ctx.fillStyle = "lightpink";
        ctx.font = "20px 'Press Start 2P'";  // Adjusted font size
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("YAYY WAJIHA AND ZAIN KISS IN THE CAR!!", canvas.width / 2, canvas.height / 2);
    }

    requestAnimationFrame(update);  // Keep the game loop running
}

// Start the game loop and background music
document.getElementById("startButton").addEventListener("click", () => {
    document.getElementById("startButton").style.display = 'none';  // Hide the button after it is clicked
    startBackgroundMusic();
    update();
});