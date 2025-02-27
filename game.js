//      Canvas      //
const canvas = document.querySelector("canvas");
const cont = canvas.getContext("2d"); //Context

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//      Collisions      //
const collisionsMap = [];
for (let i = 0; i < collisions.length; i+= 70) {
    collisionsMap.push(collisions.slice(i, 70 + i));
}

class Boundary {
    static width = 48;
    static height = 48;

    constructor ({position}) {
        this.position = position;
        this.width = Boundary.width;
        this.height = Boundary.height;
    }

    draw() {
        cont.fillStyle = "rgba(255, 0, 0, 0)";
        cont.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

const boundaries = [];
const offset = {
    x: -566,
    y: -560
}

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025) {
            boundaries.push(new Boundary({
                position: {
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
                }
            }));
        }
    });
})

//      Player Movement      //
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

//      Rendering (In line order)      //
const backImg = new Image();
backImg.src = './img/PelletTown.png'

const playerImg = new Image();
playerImg.src = './img/playerDown.png'

class Sprite {
    constructor({position, image, frames = { max: 1}, velocity}) {
        this.position = position
        this.image = image
        this.frames = frames
        this.velocity = velocity

        this.image.onload = () => {
            this.width = this.image.width / this.frames.max;
            this.height = this.image.height;
        }
    }

    draw () {
        cont.drawImage(
            this.image, 
            0,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height,
        ); //Image, Crop X, Crop Y, Crop Width, Crop Height, 
          // Image X, Image Y, Image Width, Image Height
    }
}

const player = new Sprite ({
    position: {
        x: canvas.width / 2 - (192 / 4) / 2, //Sprite Image Static Width
        y: canvas.height / 2 - 68 / 2, //Sprite Image Static Height
    },
    image: playerImg,
    frames: {
        max: 4 //Number of frames in the sprite
    },
})

const background = new Sprite ({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: backImg,
})

const movables = [background, ...boundaries]; // '...' call all items inside a array

function rectangleCollision({rectangle1, rectangle2}) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x && //Left collision
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width && //Right collision
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height && //Bottom collision
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y //Top collision 
    )
}

function animate() {
    window.requestAnimationFrame(animate);
    background.draw();
    boundaries.forEach((boundary) => {
        boundary.draw();
    });
    player.draw();

    const size = 3;
    const directions = {
        w: { x: 0, y: size },
        s: { x: 0, y: -size },
        a: { x: size, y: 0 },
        d: { x: -size, y: 0 },
    };

    let moving = true;
    if (keys.w.pressed && lastKey === 'w') {
        movePlayer('w');
    } else if (keys.s.pressed && lastKey === 's') {
        movePlayer('s');
    } else if (keys.a.pressed && lastKey === 'a') {
        movePlayer('a');
    } else if (keys.d.pressed && lastKey === 'd') {
        movePlayer('d');
    }

    function movePlayer(direction) {
        const { x, y } = directions[direction];
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (rectangleCollision({
                rectangle1: player,
                rectangle2: { ...boundary, position: 
                    { 
                        x: boundary.position.x + x, 
                        y: boundary.position.y + y 
                    } 
                }
            })) {
                moving = false;
                break;
            }
        }

        if (moving) {
            movables.forEach((movable) => {
            movable.position.x += x;
            movable.position.y += y;
            });
        }
    }
}
animate();