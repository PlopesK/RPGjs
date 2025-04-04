//      Canvas      //
const canvas = document.querySelector("canvas");
const cont = canvas.getContext("2d"); //Context
const actButtons = document.querySelector(".actions");

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

//      Rendering (In line order)      //
const backImg = new Image();
backImg.src = './assets/img/Map/PelletTown.png';

const foregroundImg = new Image();
foregroundImg.src = './assets/img/Map/foreground.png';

const playerImgs = {
  down: new Image(),
  up: new Image(),
  left: new Image(),
  right: new Image()
};

playerImgs.down.src = './assets/img/Player/playerDown.png';
playerImgs.up.src = './assets/img/Player/playerUp.png';
playerImgs.left.src = './assets/img/Player/playerLeft.png';
playerImgs.right.src = './assets/img/Player/playerRight.png';

const player = new Sprite ({
    position: {
        x: canvas.width / 2 - (192 / 4) / 2, //Sprite Image Static Width
        y: canvas.height / 2 - 68 / 2, //Sprite Image Static Height
    },
    image: playerImgs.down,
    frames: {
        max: 4, //Number of frames in the sprite
        hold: 10 
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
    const animationId = window.requestAnimationFrame(animate);
    actButtons.classList.add("hidden");

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

    let animation = true;
    player.animation = false;

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
        player.animation = true;
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
                animation = false;
                player.animation = false;
                break;
            }
        }

        //  Battle Zone //
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
                window.cancelAnimationFrame(animationId) //Cancel Map animation loop
                battle.initiated = true;
                startBattleTransition();
                
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

        if (animation) {
            movables.forEach((movable) => {
                movable.position.x += x;
                movable.position.y += y;
            });
        }
    }
}

function startBattleTransition() {
    const tl = gsap.timeline();

    tl.to('.transition', { duration: 0.5, opacity: 1, repeat: 2, yoyo: true })
      .to('.transition', { duration: 0.3, opacity: 0 })
      .to('.transition', { duration: 1, opacity: 1, scale: 5, backgroundColor: 'black', ease: "power2.inOut", zIndex: 300 })
      .to('.transition', { duration: 0.5, opacity: 1, onComplete: () => {animateBattle(), toggleMenu('startBattle')} })
      .to('.transition', { duration: 0.5, scale: 0, opacity: 0, ease: "power2.inOut" });
}

// Battle Zone Creation //
const battleBackgroundImg = new Image();
battleBackgroundImg.src = './assets/img/Battle/battleBackground.png';

function drawBackground() {
    cont.clearRect(0, 0, canvas.width, canvas.height);
    
    const scale = Math.max(canvas.width / battleBackgroundImg.width, canvas.height / battleBackgroundImg.height);
    const newWidth = battleBackgroundImg.width * scale;
    const newHeight = battleBackgroundImg.height * scale;

    const x = (canvas.width - newWidth) / 2;
    const y = (canvas.height - newHeight) / 2;

    cont.drawImage(battleBackgroundImg, x, y, newWidth, newHeight);
}

// Battle Elements //
const draggleImg = new Image();
draggleImg.src = './assets/img/Companion/draggleSprite.png';
const draggle = new Sprite({
    position: {
        x: canvas.width - 300,
        y: 100
    },
    image: draggleImg,
    frames: {
        max: 4,
        hold: 30
    },
    animation: true,
    scale: 1.2,
    health: {
        max: 150
    }
});

const embyImg = new Image();
embyImg.src = './assets/img/Companion/embySprite.png';
const emby = new Sprite({
    position: {
        x: 360,
        y: canvas.height - 360
    },
    image: embyImg,
    frames: {
        max: 4,
        hold: 30
    },
    animation: true,
    scale: 2
});

// Animations to monsters //
const initialPositions = {
  emby: { x: canvas.width + 300, y: emby.position.y },
  draggle: { x: -300, y: draggle.position.y }
};

const finalPositions = {
  emby: { x: 360, y: canvas.height - 360 },
  draggle: { x: canvas.width - 300, y: 100 }
};

emby.position.x = initialPositions.emby.x;
draggle.position.x = initialPositions.draggle.x;
const speed = 30;

// Rendering Battle Sequence //
function animateBattle() {
  window.requestAnimationFrame(animateBattle);
  actButtons.classList.remove("hidden");

  drawBackground();
  draggle.draw();
  emby.draw();

  if (draggle.position.x < finalPositions.draggle.x) {
    draggle.position.x = Math.min(draggle.position.x + speed, finalPositions.draggle.x);
  }

  if (emby.position.x > finalPositions.emby.x) {
    emby.position.x = Math.max(emby.position.x - speed, finalPositions.emby.x);
  }
}

//animate();
animateBattle();