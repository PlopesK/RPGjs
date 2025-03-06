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

const battleZonesMap = [];
for (let i = 0; i < battleZonesData.length; i+= 70) {
    battleZonesMap.push(battleZonesData.slice(i, 70 + i));
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

const battleZones = []
battleZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025) {
            battleZones.push(new Boundary({
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
    const key = keyMap[e.key];
    if (key && !keys[key].pressed) {
        keys[key].pressed = true;
        lastKey = key;
    }
});

window.addEventListener("keyup", (e) => {
    const key = keyMap[e.key];
    if (key) {
        keys[key].pressed = false;
    }

    if (key === lastKey) {
        lastKey = Object.keys(keys).find(k => keys[k].pressed) || null;
    }

    player.frames.val = 0;
});

//      Rendering (In line order)      //
const backImg = new Image();
backImg.src = './assets/img/PelletTown.png';

const foregroundImg = new Image();
foregroundImg.src = './assets/img/foreground.png';

const playerImgs = {
  down: new Image(),
  up: new Image(),
  left: new Image(),
  right: new Image()
};

playerImgs.down.src = './assets/img/playerDown.png';
playerImgs.up.src = './assets/img/playerUp.png';
playerImgs.left.src = './assets/img/playerLeft.png';
playerImgs.right.src = './assets/img/playerRight.png';

const player = new Sprite ({
    position: {
        x: canvas.width / 2 - (192 / 4) / 2, //Sprite Image Static Width
        y: canvas.height / 2 - 68 / 2, //Sprite Image Static Height
    },
    image: playerImgs.down,
    frames: {
        max: 4 //Number of frames in the sprite
    },
    sprites: {
        up: playerImgs.up,
        left: playerImgs.left,
        down: playerImgs.down,
        right: playerImgs.right
    }
});

const background = new Sprite ({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: backImg,
});

const foreground = new Sprite ({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundImg,
});

const movables = [background, ...boundaries, foreground, ...battleZones]; // '...' call all items inside a array
function rectangleCollision({rectangle1, rectangle2}) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x + rectangle2.buffer * 2 && //Left collision
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width - rectangle2.buffer * 2 && //Right collision
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height - rectangle2.buffer * 2 && //Bottom collision
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y //Top collision 
    )
}

const battle = {
    initiated: false
}

// ----------- Animating ----------- //
function animate() {
    window.requestAnimationFrame(animate);
    background.draw(); //Layer 1
    boundaries.forEach((boundary) => { //Layer 2
        boundary.draw();
    });
    battleZones.forEach((battleZone) => {
        battleZone.draw();
    })
    player.draw(); //Layer 3
    foreground.draw(); //Layer 4

    const size = 3;
    const directions = {
        w: { x: 0, y: size },
        s: { x: 0, y: -size },
        a: { x: size, y: 0 },
        d: { x: -size, y: 0 },
    };

    let moving = true;
    player.moving = false;

    if (battle.initiated) return;
    if (keys.w.pressed && lastKey === 'w') {
        movePlayer('w');
        player.image = player.sprites.up;
    } else if (keys.s.pressed && lastKey === 's') {
        movePlayer('s');
        player.image = player.sprites.down;
    } else if (keys.a.pressed && lastKey === 'a') {
        movePlayer('a');
        player.image = player.sprites.left;
    } else if (keys.d.pressed && lastKey === 'd') {
        movePlayer('d');
        player.image = player.sprites.right;
    }

    function movePlayer(direction) {
        player.moving = true;
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
            }) ) {
                moving = false;
                player.moving = false;
                break;
            }
        }

        for (let i = 0; i < battleZones.length; i++) {
            const battleZone = battleZones[i];
            const overlappingArea = calculateOverlappingArea(player, battleZone);
            if (
                rectangleCollision({
                    rectangle1: player,
                    rectangle2: battleZone
                }) &&
                overlappingArea > (player.width * player.height) / 2 &&
                Math.random() < 0.01
            ) {
                console.log("Activating battle!");
                battle.initiated = true;
                gsap.to('.transition', {
                    duration: 0.5,
                    repeat: 4,
                    yoyo: true,
                    opacity: 1,
                });
                break;
            }
        }

        function calculateOverlappingArea(rectangle1, rectangle2) {
            return (Math.min(
                rectangle1.position.x + rectangle1.width, 
                rectangle2.position.x + rectangle2.width
            ) - Math.max(rectangle1.position.x, rectangle2.position.x))
            * (Math.min(
                rectangle1.position.y + rectangle1.height,
                rectangle2.position.y + rectangle2.height
            ) - Math.max(rectangle1.position.y, rectangle2.position.y));
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