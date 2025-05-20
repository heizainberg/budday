const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let zainFrame = 0;
let wajihaFrame = 0;
const zainFrameWidth = 64;  // Width of a single frame in Zain's sprite sheet
const zainFrameHeight = 64;  // Height of a single frame in Zain's sprite sheet
const zainNumFrames = 4;  // Number of frames in Zain's sprite sheet

const wajihaFrameWidth = 64;  // Width of a single frame in Wajiha's sprite sheet
const wajihaFrameHeight = 64;  // Height of a single frame in Wajiha's sprite sheet
const wajihaNumFrames = 8;  // Number of frames in Wajiha's sprite sheet

let zainAnimationTimer = 0;
let wajihaAnimationTimer = 0;
const animationInterval = 125;  // Time in milliseconds between frames (8 FPS)

function updateAnimationTimers(deltaTime) {
    zainAnimationTimer += deltaTime;
    wajihaAnimationTimer += deltaTime;

    if (zainAnimationTimer >= animationInterval) {
        zainFrame = (zainFrame + 1) % zainNumFrames;
        zainAnimationTimer = 0;
    }

    if (wajihaAnimationTimer >= animationInterval) {
        wajihaFrame = (wajihaFrame + 1) % wajihaNumFrames;
        wajihaAnimationTimer = 0;
    }
}

function drawZainSprite() {
    ctx.drawImage(
        assets.zainSprite,
        zainFrame * zainFrameWidth, 0, zainFrameWidth, zainFrameHeight,
        zain.x, zain.y, zain.width, zain.height
    );
}

function drawWajihaSprite() {
    const row = assets.wajihaRows[wajiha.direction];
    const frameIndex = wajihaFrame % 8;
    const wajihaFrameX = frameIndex * wajihaFrameWidth;  // Calculate the x-coordinate of the frame

    if (row) {
        ctx.drawImage(
            row,
            wajihaFrameX, 0, wajihaFrameWidth, wajihaFrameHeight,
            wajiha.x, wajiha.y, wajiha.width, wajiha.height
        );
    }
}

// Example usage: Call this function with the appropriate direction based on the key pressed
function updateWajihaDirection(direction) {
    wajiha.direction = direction;
}

// Handle keydown events to update Wajiha's direction
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowDown':
            updateWajihaDirection('down');
            break;
        case 'ArrowRight':
            updateWajihaDirection('right');
            break;
        case 'ArrowLeft':
            updateWajihaDirection('left');
            break;
        case 'ArrowUp':
            updateWajihaDirection('up');
            break;
    }
});