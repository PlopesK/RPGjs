const canvas = document.querySelector("canvas");
const cont = canvas.getContext("2d"); //Context

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

cont.fillStyle = 'White';
cont.fillRect(0, 0, canvas.width, canvas.height); //X, Y, Width, Height

const backImg = new Image();
backImg.src = './img/PelletTown.png'

const playerImg = new Image();
playerImg.src = './img/playerDown.png'

class Sprite {
    constructor({position, image, velocity}) {
        this.position = position
        this.image = image
        this.velocity = velocity
    }

    draw () {
        cont.drawImage(this.image, -566, -560)
    }
}

const background = new Sprite ({
    position: {
        x: -566,
        y: -560
    },
    image: backImg,
})

function animate() {
    console.log("loaded");
    window.requestAnimationFrame(animate);
    background.draw() //Image, X, Y
    cont.drawImage(
        playerImg, 
        0,
        0,
        playerImg.width / 4,
        playerImg.height,
        canvas.width / 2 - (playerImg.width / 4) / 2, 
        canvas.height / 2 - playerImg.height / 2,
        playerImg.width / 4,
        playerImg.height,
    ); //Image, Crop X, Crop Y, Crop Width, Crop Height, 
      // Image X, Image Y, Image Width, Image Height
}
animate();

window.addEventListener("keydown", (e) => {
    switch (e.key) {
        case 'ArrowUp' || 'W':
            break;

        case 'ArrowLeft' || 'A':
            break;

        case 'ArrowDown' || 'S':
            break;

        case 'ArrowRight' || 'D':
            break;
    }
})