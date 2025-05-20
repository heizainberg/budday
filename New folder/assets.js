// assets.js

const assets = {
    carImage: new Image(),
    obstacleImage: new Image(),
};

function loadAssets() {
    assets.carImage.src = "game assets/prius.png";       // Car image
    assets.obstacleImage.src = "game assets/char_a_p1_0bas_humn_v01.png";  // Obstacle image

    // Add event listeners to ensure images are loaded
    assets.carImage.onload = () => {
        console.log("Car image loaded");
    };
    assets.obstacleImage.onload = () => {
        console.log("Obstacle image loaded");
    };
}

loadAssets();