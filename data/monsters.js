const monsterData = {
  Emby: {
    name: 'Emby',
    imageSrc: './assets/img/Companion/embySprite.png',
    frames: { max: 4, hold: 30 },
    isEnemy: false,
    stats: {
      hp: 100,
      atk: 50,
      def: 90,
      spd: 120,
    },
    types: ['Fire'],
    monsterAttacks: [atkList.Tackle, atkList.Fireball, atkList.Bite, atkList.Defense],
  },
  Draggle: {
    name: 'Draggle',
    imageSrc: './assets/img/Companion/draggleSprite.png',
    frames: { max: 4, hold: 30 },
    isEnemy: true,
    stats: {
      hp: 100,
      atk: 30,
      def: 150,
      spd: 90,
    },
    types: ['Dragon', 'Normal'],
    monsterAttacks: [atkList.Tackle, atkList.Fireball],
  },
};

//Use 'createMonster(name)' load a specific monster!
//Ex: emby = createMonster('Emby') //Locating the monster inside a let//