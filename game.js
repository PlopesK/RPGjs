const canvas = document.querySelector("canvas");
const cont = canvas.getContext("2d"); //Context

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

cont.fillStyle = 'White';
cont.fillRect(0, 0, canvas.width, canvas.height); //X, Y, Width, Height

const image = new Image();
image.src = './img/PelletTown.png'

const playerImg = new Image();
playerImg.src = './img/playerDown.png'

image.onload = function(){
    cont.drawImage(image, -566, -560); //Image, X, Y
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