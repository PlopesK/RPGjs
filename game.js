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
        cont.drawImage(this.image, this.position.x, this.position.y)
    }
}

const background = new Sprite ({
    position: {
        x: -566,
        y: -560
    },
    image: backImg,
})

const keys = {
    w: {
        pressed: false
    },

    a: {
        pressed: false
    },

    s: {
        pressed: false
    },

    d: {
        pressed: false
    }
}

let lastKey = '';
const keyMap = {
  'ArrowUp': 'w',
  'ArrowLeft': 'a',
  'ArrowDown': 's',
  'ArrowRight': 'd',
  'w': 'w',
  'a': 'a',
  's': 's',
  'd': 'd',
};

window.addEventListener("keydown", (e) => {
    const key = keyMap[e.key.toLowerCase()];
    if (key && !keys[key].pressed) {
        keys[key].pressed = true;
        lastKey = key;
    }
});

window.addEventListener("keyup", (e) => {
    const key = keyMap[e.key.toLowerCase()];
    if (key) {
        keys[key].pressed = false;
    }

    if (key === lastKey) {
        lastKey = Object.keys(keys).find(k => keys[k].pressed) || null;
    }
});

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

      if (keys.w.pressed && lastKey === 'w') background.position.y += 3
      else if (keys.s.pressed && lastKey === 's') background.position.y -= 3
      else if (keys.a.pressed && lastKey === 'a') background.position.x += 3
      else if (keys.d.pressed && lastKey === 'd') background.position.x -= 3
}
animate();