const itemList = {
    Potion: { name: "Potion", effect: 30, description: () => `Restore ${this.effect} of HP` },
    PotionX: { name: "PotionX", damage: 100, description: () => `Restore ${this.effect} of HP` },
};

const charItems = []

charItems.push(itemList.Potion)
charItems.push(itemList.PotionX)