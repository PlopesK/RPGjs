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
    isEnemy: true,
    name: 'Draggle',
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
    scale: 1.9,
    name: 'Emby',
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
const renderedSprites = [draggle, emby]
function animateBattle() {
    window.requestAnimationFrame(animateBattle);
    actButtons.classList.remove("hidden");
    drawBackground();

    renderedSprites.forEach((sprite) => {
        sprite.draw()
    })

    if (draggle.position.x < finalPositions.draggle.x) {
        draggle.position.x = Math.min(draggle.position.x + speed, finalPositions.draggle.x);
    }

    if (emby.position.x > finalPositions.emby.x) {
        emby.position.x = Math.max(emby.position.x - speed, finalPositions.emby.x);
    }
}

//animate();
animateBattle();