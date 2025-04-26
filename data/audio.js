const audio = {
  Map: new Howl({
    src: './assets/sfx/music/map.wav',
    html5: true,
    volume: 0.15,
    repeat: -1,
    onplay: function () {
      this.fade(0, 0.2, 1000);
    },
    onend: function () {
      this.fade(0.2, 0, 1000);
      this.play();
    }
  }),
  walking: new Howl({
    src: './assets/sfx/interactions/Walk.wav',
    html5: true,
    volume: 0.1,
    rate: 1.1
  }),
  walkingOnGrass: new Howl({
    src: './assets/sfx/interactions/WalkGrass.wav',
    html5: true,
    volume: 0.1,
    rate: 1.1
  }),

  // Menu
  menuReturn: new Howl({
    src: './assets/sfx/menu/Menu_Select2.wav',
    html5: true,
    volume: 0.2,
  }),
  menuClick: new Howl({
    src: './assets/sfx/menu/Menu_Select.wav',
    html5: true,
    volume: 0.08,
  }),
  menuCreation: new Howl({
    src: './assets/sfx/menu/Menu_Intro.wav',
    html5: true,
    volume: 0.15,
  }),

  // Battle
  initBattle: new Howl({
    src: './assets/sfx/interactions/initBattle.wav',
    html5: true,
    volume: 0.2,
  }),
  battle: new Howl({
    src: './assets/sfx/music/Music_Loop_6_Full.wav',
    html5: true,
    volume: 0.2,
    repeat: -1,
    onend: function () {
      this.play();
    },
  }),

  // Attacks and Effects
  tackleHit: new Howl({
    src: './assets/sfx/attacks/tackleHit.wav',
    html5: true,
    volume: 0.15,
  }),
  fireballHit: new Howl({
    src: './assets/sfx/attacks/fireballHit.wav',
    html5: true,
    volume: 0.03,
  }),
  initFireball: new Howl({
    src: './assets/sfx/attacks/initFireball.wav',
    html3: true,
    volume: 0.03,
  }),
  faint: new Howl({
    src: './assets/sfx/music/faint.wav',
    html5: true,
    volume: 0.15,
  }),
  healing: new Howl({
    src: './assets/sfx/interactions/Healing.wav',
    html5: true,
    volume: 0.15,
  }),
}