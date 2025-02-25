const map = document.querySelector("body")
const canvas = document.querySelector("canvas");
const cont = canvas.getContext("2d"); //Context

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

cont.fillStyle = 'White';
cont.fillRect(0, 0, canvas.width, canvas.height); //X, Y, Width, Height

const image = new Image();
image.src = './img/PelletTown.png'
image.onload = function(){
    cont.drawImage(image, -550, -550); //Image, X, Y
}