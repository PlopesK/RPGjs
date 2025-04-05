const atkList = {
    Tackle: { name: "Tackle", damage: 20, type: "Normal", description: "Run to hit your opponent with a melee attack!" },
    FireBall: { name: "FireBall", damage: 30, type: "Fire", description: "A strong fire ball attack!"},
    Bite: { name: "Bite", damage: 10, type: "Normal", description: "Bite your opponent!"},
    Defense: { name: "Defense", damage: 0, type: "Normal", description: "A defensive move!"},
};

const characterAttacks = {
    atk1: atkList.Tackle,
    atk2: atkList.FireBall,
    atk3: atkList.Bite,
    atk4: atkList.Defense
};