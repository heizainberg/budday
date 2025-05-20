// assets.js

const assets = {
    carImage: new Image(),
    obstacleImage1: new Image(),
    obstacleImage2: new Image(),
    roadImage: new Image(),
    townMapImage: new Image(),
    houseImage: new Image(),
    wajihaBackgroundImage: new Image(),
    zainLeftImage: new Image(),
    zainRightImage: new Image(),
    wajihaImage: new Image(),
    objectImage: new Image()  // Add object image
};

function loadAssets() {
    assets.carImage.src = "game assets/prius2.png";
    assets.obstacleImage1.src = "game assets/char_a_p1_0bas_humn_v01.png";
    assets.obstacleImage2.src = "game assets/e8353c00d9f0c8a4ed621c48d96eb568.png";
    assets.roadImage.src = "game assets/511d14022b37a744099f0ab0ddead5e4.jpg";
    assets.townMapImage.src = "game assets/CCity_mockup.png";
    assets.houseImage.src = "game assets/Trailer Assets.png";
    assets.wajihaBackgroundImage.src = "game assets/d781039a-8d2e-4113-aa93-316bd42fb325.jpg";
    assets.zainLeftImage.src = "C:/Users/Zain/New folder/game assets/Walking10_transparent_cropped.png"; // Updated left arrow key asset
    assets.zainRightImage.src = "C:/Users/Zain/New folder/game assets/Walking8_transparent_cropped.png"; // Updated right arrow key asset
    assets.wajihaImage.src = "C:/Users/Zain/New folder/game assets/row1.png";
    assets.objectImage.src = "C:/Users/Zain/New folder/game assets/e8353c00d9f0c8a4ed621c48d96eb568.png";  // Load object image
}

loadAssets();