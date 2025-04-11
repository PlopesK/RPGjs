const monsterData = {
  Emby: {
    name: 'Emby',
    imageSrc: './assets/img/Companion/embySprite.png',
    frames: { max: 4, hold: 30 },
    isEnemy: false,
    monsterAttacks: [atkList.Tackle, atkList.Fireball, atkList.Bite, atkList.Defense],
  },
  Draggle: {
    name: 'Draggle',
    imageSrc: './assets/img/Companion/draggleSprite.png',
    frames: { max: 4, hold: 30 },
    isEnemy: true,
    monsterAttacks: [atkList.Tackle, atkList.Fireball],
  },
};