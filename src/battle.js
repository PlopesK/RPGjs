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

function createMonster(monsterKey) {
    const data = monsterData[monsterKey];
    const image = new Image();
    image.src = data.imageSrc;

    const position = data.isEnemy
        ? { x: canvas.width - 300, y: 100 }
        : { x: 360, y: canvas.height - 360 };
    const scale = data.isEnemy 
        ? 1.2
        : 1.9

    return new Monster({
        position,
        image,
        frames: data.frames,
        animation: true,
        scale: scale,
        isEnemy: data.isEnemy,
        name: data.name,
    });
}

const emby = createMonster('Emby');
const draggle = createMonster('Draggle');
const allSprites = [emby, draggle];

const playerMonster = allSprites.find(sprite => !sprite.isEnemy);
const enemyMonster = allSprites.find(sprite => sprite.isEnemy);

// Start animation position
const initialPositions = {
    [playerMonster.name]: { x: canvas.width + 300, y: playerMonster.position.y },
    [enemyMonster.name]: { x: -300, y: enemyMonster.position.y }
};

// End animation position
const finalPositions = {
    [playerMonster.name]: { x: playerMonster.position.x, y: playerMonster.position.y },
    [enemyMonster.name]: { x: enemyMonster.position.x, y: enemyMonster.position.y }
};

// Apply initial positions
playerMonster.position.x = initialPositions[playerMonster.name].x;
enemyMonster.position.x = initialPositions[enemyMonster.name].x;
const speed = 30;
const renderedSprites = [enemyMonster, playerMonster];

function animateBattle() {
    window.requestAnimationFrame(animateBattle);
    battleMenu.classList.remove("hidden");
    drawBackground();

    renderedSprites.forEach(sprite => sprite.draw());

    // Move Enemy Monster
    if (enemyMonster.position.x < finalPositions[enemyMonster.name].x) {
        enemyMonster.position.x = Math.min(enemyMonster.position.x + speed, finalPositions[enemyMonster.name].x);
    }

    // Move Player Monster
    if (playerMonster.position.x > finalPositions[playerMonster.name].x) {
        playerMonster.position.x = Math.max(playerMonster.position.x - speed, finalPositions[playerMonster.name].x);
    }
}

//animate()
animateBattle();