// Game states
let gameState = 'house';  // 'house' = Zain walking, 'car' = Driving, 'wajiha' = Wajiha chase, 'gameOver' = crashed, 'caught' = success

// Timer for the driving segment (in seconds)
let timeRemaining = 75;  // 75 seconds for the driving segment

// Zain's object (x, y position, speed, etc.)
let zain = { x: 50, y: 200, width: 30, height: 50, speed: 0.45, direction: 'right' };

// Car object (stationary blue car)
let car = { x: 800, y: 200, width: 50, height: 60, color: 'blue' };

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
window.addEventListener('keyup', (e) => { keys[e.key] = false; if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key)) isZainIdle = true; });

// Flag for starting the transition to the car segment
let transitioningToCar = false;

// Car driving variables
let carX = canvas.width / 2 - car.width / 2;
let carSpeed = 5;
let obstacles = [];

// Timer function to count down the driving time
function startDrivingTimer() {
    if (timeRemaining > 0 && gameState === 'car') {
        setTimeout(() => {
            timeRemaining--;
            startDrivingTimer();
        }, 1000);
    } else if (timeRemaining === 0 && gameState === 'car') {
        gameState = 'wajiha';
        // Set initial positions for the wajiha segment
        zain.x = 50;
        zain.y = 200;
        wajiha.x = canvas.width / 2 - wajiha.width / 2;
        wajiha.y = 200;
        generateObjects(); // Generate objects for the third segment

        // Reset movement keys and idle flag
        keys['ArrowRight'] = false;
        keys['ArrowLeft'] = false;
        keys['ArrowUp'] = false;
        keys['ArrowDown'] = false;
        isZainIdle = true;
    }
}

function drawZain() {
    let zainImage;
    if (isZainIdle) {
        zainImage = new Image();
        zainImage.src = "C:/Users/Zain/New folder/game assets/Walking1_transparent_cropped.png";
    } else if (zain.direction === 'left') {
        zainImage = assets.zainLeftImage;
    } else if (zain.direction === 'right') {
        zainImage = assets.zainRightImage;
    }
    ctx.drawImage(zainImage, zain.x, zain.y, zain.width, zain.height);
}

function drawWajiha() {
    if (assets.wajihaImage.complete) {
        ctx.drawImage(assets.wajihaImage, wajiha.x, wajiha.y, wajiha.width, wajiha.height);
    }
}

function updateZainMovement() {
    if (keys['ArrowRight'] && zain.x < canvas.width - zain.width) { zain.x += zain.speed; isZainIdle = false; }
    if (keys['ArrowLeft'] && zain.x > 0) { zain.x -= zain.speed; isZainIdle = false; }
    if (keys['ArrowUp'] && zain.y > 0) { zain.y -= zain.speed; isZainIdle = false; }
    if (keys['ArrowDown'] && zain.y < canvas.height - zain.height) { zain.y += zain.speed; isZainIdle = false; }
}

let isZainIdle = true;

function updateZainDirection(key) {
    if (key === 'ArrowRight') {
        zain.direction = 'right';
        isZainIdle = false;
    } else if (key === 'ArrowLeft') {
        zain.direction = 'left';
        isZainIdle = false;
    }
}

function drawCar() {
    ctx.drawImage(assets.carImage, car.x, car.y, car.width, car.height);
}

function driveCar() {
    if (keys['ArrowRight']) carX += carSpeed;
    if (keys['ArrowLeft']) carX -= carSpeed;
    if (carX < 0) carX = 0;
    if (carX > canvas.width - car.width) carX = canvas.width - car.width;
    ctx.drawImage(assets.carImage, carX, canvas.height - 60, car.width, car.height);
    drawObstacles();
}

function generateObstacles() {
    if (Math.random() < 0.02) {
        let obstacleX, obstacleY;
        let minDistance = 150;
        let isValidPosition;
        let attempts = 0;
        do {
            obstacleX = Math.random() * (canvas.width - 50);
            obstacleY = -30;
            isValidPosition = obstacles.every(obstacle => {
                return Math.abs(obstacleX - obstacle.x) > minDistance;
            });
            attempts++;
        } while (!isValidPosition && attempts < 100);
        if (isValidPosition) {
            let obstacleType = Math.random() < 0.5 ? 'obstacleImage1' : 'obstacleImage2';
            obstacles.push({ x: obstacleX, y: obstacleY, width: 50, height: 30, type: obstacleType });
        }
    }
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.y += 3;
        ctx.drawImage(assets[obstacle.type], obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
    obstacles = obstacles.filter(obstacle => obstacle.y < canvas.height);
}

function checkCollision() {
    if (gameState === 'car' && timeRemaining > 0) {
        obstacles.forEach(obstacle => {
            if (
                carX < obstacle.x + obstacle.width &&
                carX + car.width > obstacle.x &&
                canvas.height - 60 < obstacle.y + obstacle.height &&
                canvas.height - 30 > obstacle.y
            ) {
                const backgroundMusic = document.getElementById("backgroundMusic");
                if (backgroundMusic) {
                    backgroundMusic.pause();
                    backgroundMusic.currentTime = 0;
                }
                const gameOverSound = new Audio("C:/Users/Zain/New folder/game assets/Game Over (Super Mario) - QuickSounds.com.mp3");
                gameOverSound.play();
                gameState = 'gameOver';
                alert("You crashed! Game over.");
            }
        });
    }
}

function updateWajihaMovement() {
    if (wajiha.x < zain.x) wajiha.x += wajiha.speed;
    if (wajiha.x > zain.x) wajiha.x -= wajiha.speed;
    if (wajiha.y < zain.y) wajiha.y += wajiha.speed;
    if (wajiha.y > zain.y) wajiha.y -= wajiha.speed;
}

function checkWajihaReachesCar() {
    if (
        wajiha.x < car.x + car.width &&
        wajiha.x + wajiha.width > car.x &&
        wajiha.y < car.y + car.height &&
        wajiha.y + wajiha.height > car.y
    ) {
        const backgroundMusic = document.getElementById("backgroundMusic");
        if (backgroundMusic) {
            backgroundMusic.pause();
            backgroundMusic.currentTime = 0;
        }
        const winSound = new Audio("C:/Users/Zain/New folder/game assets/8-bit-video-game-win-level-sound-version-1-145827.mp3");
        winSound.play();
        gameState = 'caught';
        alert("Wajiha reached the car! Success!");
    }
}

// RANDOMIZED OBJECTS FOR THIRD SEGMENT
function generateObjects() {
    objects = [];
    const objectWidth = 50;
    const objectHeight = 50;
    const numObjects = 10; // Adjust as you like

    let tries = 0;
    while (objects.length < numObjects && tries < 1000) {
        let x = Math.random() * (canvas.width - objectWidth - 40) + 20;
        let y = Math.random() * (canvas.height - objectHeight - 80) + 60;
        let overlapping = objects.some(obj =>
            Math.abs(obj.x - x) < objectWidth + 10 && Math.abs(obj.y - y) < objectHeight + 10
        );
        if (!overlapping) {
            objects.push({ x, y, width: objectWidth, height: objectHeight });
        }
        tries++;
    }
}

function drawObjects() {
    objects.forEach(object => {
        ctx.drawImage(assets.objectImage, object.x, object.y, object.width, object.height);
    });
}

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
            const backgroundMusic = document.getElementById("backgroundMusic");
            if (backgroundMusic) {
                backgroundMusic.pause();
                backgroundMusic.currentTime = 0;
            }
            const gameOverSound = new Audio("C:/Users/Zain/New folder/game assets/Game Over (Super Mario) - QuickSounds.com.mp3");
            gameOverSound.play();
            gameState = 'gameOver';
            alert("You hit an object! Game over.");
        }
    });
}

function displayTransitionScreen() {
    ctx.fillStyle = "pink";
    ctx.font = "40px 'Press Start 2P'";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("GET TO WAJIHA'S HOUSE", canvas.width / 2, canvas.height / 2);
}

function startBackgroundMusic() {
    const backgroundMusic = document.getElementById("backgroundMusic");
    backgroundMusic.playbackRate = 1.75;
    backgroundMusic.play();
}

function update(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (gameState === 'house') {
        ctx.drawImage(assets.townMapImage, 0, 0, canvas.width, canvas.height);
        drawCar();
        drawZain();
        updateZainMovement();
        if (zain.x + zain.width >= car.x && zain.y + zain.height >= car.y) {
            gameState = 'transition';
            setTimeout(() => {
                gameState = 'car';
                startDrivingTimer();
            }, 4000);
        }
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText("Walk to the car!", 350, 30);
    } else if (gameState === 'transition') {
        displayTransitionScreen();
    } else if (gameState === 'car') {
        generateObstacles();
        ctx.drawImage(assets.roadImage, 0, 0, canvas.width, canvas.height);
        driveCar();
        checkCollision();
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText(`Time Left: ${timeRemaining}s`, canvas.width / 2 - 50, 30);
        ctx.fillStyle = "darkpink";
        ctx.font = "20px 'Press Start 2P'";
        ctx.textAlign = "center";
        ctx.fillText("AVOID THE SIRAIKIS AND MEOWS!!!", canvas.width / 2, 60);
    } else if (gameState === 'wajiha') {
        ctx.drawImage(assets.wajihaBackgroundImage, 0, 0, canvas.width, canvas.height);
        drawCar();
        ctx.drawImage(assets.houseImage, canvas.width / 2 - 25, 200, 50, 50);
        drawZain();
        drawWajiha();
        drawObjects();
        updateZainMovement();
        updateWajihaMovement();
        checkWajihaReachesCar();
        checkObjectCollision();
        ctx.fillStyle = "white";
        ctx.font = "20px 'Press Start 2P'";
        ctx.textAlign = "center";
        ctx.fillText("LEAD WAJIHA TO THE CAR!!!", canvas.width / 2, 30);
    } else if (gameState === 'gameOver') {
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Game Over! You crashed.", canvas.width / 2, canvas.height / 2);
    } else if (gameState === 'caught') {
        ctx.fillStyle = "lightpink";
        ctx.font = "20px 'Press Start 2P'";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("YAYY WAJIHA AND ZAIN KISS IN THE CAR!!", canvas.width / 2, canvas.height / 2);
    }

    requestAnimationFrame(update);
}

document.getElementById("startButton").addEventListener("click", () => {
    document.getElementById("startButton").style.display = 'none';
    startBackgroundMusic();
    update();
});