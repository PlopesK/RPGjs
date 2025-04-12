const audio = {
    Map: new Howl({
        src: './assets/sfx/map.wav',
        html5: true,
        volume: 0.2,
        repeat: -1,
        onplay: function() {
          this.fade(0, 0.2, 1000);
        },
        onend: function() {
          this.fade(0.2, 0, 1000);
        }
      }),
    initBattle: new Howl({
        src: './assets/sfx/initBattle.wav',
        html5: true,
        volume: 0.2,
    }),
    battle: new Howl({
        src: './assets/sfx/battle.mp3',
        html5: true,
        volume: 0.15,
    }),
    tackleHit: new Howl({
        src: './assets/sfx/tackleHit.wav',
        html5: true,
        volume: 0.15,
    }),
    fireballHit: new Howl({
        src: './assets/sfx/fireballHit.wav',
        html5: true,
        volume: 0.15,
    }),
    initFireball: new Howl({
        src: './assets/sfx/initFireball.wav',
        html5: true,
        volume: 0.15,
    }),
    faint: new Howl({
        src: './assets/sfx/faint.wav',
        html5: true,
        volume: 0.15,
    }),
}