const atkList = {
    Tackle: { name: "Tackle", damage: 20, type: "Normal", description: "Run to hit your opponent with a melee attack!" },
    Fireball: { name: "Fireball", damage: 30, type: "Fire", description: "A strong fire ball attack!"},
    Firedance: { name: "Firedance", damage: 0, type: "Fire", description: "Raises your damage by 2.2 for 1 turn!"},
    Defense: { name: "Defense", damage: 0, type: "Normal", description: "Halves the incoming damage for 1 turn!"},
};

const charAttacks = {
    atk1: atkList.Tackle,
    atk2: atkList.Fireball,
    atk3: atkList.Firedance,
    atk4: atkList.Defense
};