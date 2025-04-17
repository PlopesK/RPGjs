const itemList = {
    Potion: { name: "Potion", effect: 30, type:"Healing", img:"./assets/img/Items/potion.gif", description: " Restore 30 points of HP" },
    PotionX: { name: "PotionX", effect: 100, type:"Healing", img:"./assets/img/Items/potionX.gif", description: " Restore 100 points of HP" },
};

let inventory = {
    Potion:  1,
    PotionX: 1,
}

// Use 'addItem(key, quantity)' to add Items!
//Ex: addItem('Potion', 1)

//Use 'removeItem(key)' to remove!
//Ex: removeItem('Potion')
//The default quantity value to remove is 1