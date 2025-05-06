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
        stats: data.stats,
        types: data.types,
        monsterAttacks: data.monsterAttacks
    });
}

let emby
let draggle
let allSprites
let renderedSprites // All rendered sprites, inluding attacks
let queue // Actions order
let playerMonster
let enemyMonster

function initBattle() {
    battleMenu.classList.remove("hidden")
    emby = createMonster('Emby')
    draggle = createMonster('Draggle')
    allSprites = [emby, draggle]
    currentSpecsPage = 0;
    resetHpAnim()

    renderedSprites = []
    queue = []

    playerMonster = allSprites.find(sprite => !sprite.isEnemy)
    enemyMonster = allSprites.find(sprite => sprite.isEnemy)

    renderedSprites.push(enemyMonster, playerMonster)
    specsList = [playerMonster, enemyMonster]

    window.addEventListener('keydown', handleKeydown)
    addHoverEvents()
}

const initialPositions = {
    player: { x: canvas.width + 300, y: 0 },
    enemy: { x: -300, y: 0 }
}

const finalPositions = {
    player: { x: 360, y: canvas.height - 360 },
    enemy: { x: canvas.width - 300, y: 100 }
}

function setInitialPositions() {
    playerMonster.position.x = initialPositions.player.x
    enemyMonster.position.x = initialPositions.enemy.x
}

const speed = 30

let battleAnimationId
function animateBattle() {
    battleAnimationId = window.requestAnimationFrame(animateBattle)
    drawBackground()

    renderedSprites.forEach(sprite => sprite.draw())

    if (enemyMonster.position.x < finalPositions.enemy.x) {
        enemyMonster.position.x = Math.min(enemyMonster.position.x + speed, finalPositions.enemy.x)
    }

    if (playerMonster.position.x > finalPositions.player.x) {
        playerMonster.position.x = Math.max(playerMonster.position.x - speed, finalPositions.player.x)
    }
}

function init() {
    battle.initiated = true;
    menu.itemInit = false;
    initBattle()
    setInitialPositions()
    refreshItemMenu()
    animateBattle()
}