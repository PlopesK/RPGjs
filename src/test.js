const allAttacks = {
    atk1: {
        name: "Tackle",
        damage: 10,
        description: "A strong melee attack!"
    },
    atk2: {
        name: "Attack 2",
        damage: 20,
        description: "A ranged attack with a bow."
    },
    atk3: {
        name: "Attack 3",
        damage: 30,
        description: "A magic fireball spell."
    },
    atk4: {
        name: "Attack 4",
        damage: 40,
        description: "A defensive counter move."
    },
    atk5: {
        name: "Attack 5",
        damage: 50,
        description: "A powerful sword attack."
    },
    atk6: {
        name: "Attack 6",
        damage: 60,
        description: "A swift kick attack."
    },
    atk7: {
        name: "Attack 7",
        damage: 70,
        description: "A magical healing spell."
    },
    atk8: {
        name: "Attack 8",
        damage: 80,
        description: "A strong shield block."
    },
    atk9: {
        name: "Attack 9",
        damage: 90,
        description: "A fast dagger attack."
    },
    atk10: {
        name: "Attack 10",
        damage: 100,
        description: "A powerful dragon breath attack."
    }
};

const characterAttacks = {
    atk1: allAttacks.atk1,
    atk2: allAttacks.atk2,
    atk3: allAttacks.atk3,
    atk4: allAttacks.atk4
};

const descriptions = {
    menus: {
        startBattle: {
            attack: "Launch a attack on the opponent.",
            specs: "View your character's stats and abilities.",
            items: "Use an item from your inventory.",
            run: "Attempt to escape from the battle.",
        },
        battleAtk: {
            atk1: characterAttacks.atk1.description,
            atk2: characterAttacks.atk2.description,
            atk3: characterAttacks.atk3.description,
            atk4: characterAttacks.atk4.description
        }
    }
};

console.log(characterAttacks.atk1.name);
console.log(descriptions.menus.battleAtk.atk1);

let currentMenu = 'startBattle';
let selectedOption;
let menuOptions = {
    startBattle: document.querySelectorAll('.startBattle .optBtn'),
    battleAtk: document.querySelectorAll('.battleAtk .optBtn')
};

function updateDescription(text) {
    const descriptionElements = document.querySelectorAll(".info");
    descriptionElements.forEach(element => {
        element.textContent = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    });
}

function updateSelection(index) {
    menuOptions[currentMenu].forEach(btn => btn.classList.remove('selected'));
    selectedOption = menuOptions[currentMenu][index];
    selectedOption.classList.add('selected');

    const selectedId = selectedOption.id;
    let descText;
    if (currentMenu === 'startBattle') {
        descText = descriptions.menus.startBattle[selectedId];
    } else {
        const descriptionPath = descriptions.menus.battleAtk[selectedId].split('.');
        descText = descriptionPath.reduce((obj, key) => obj[key], { characterAttacks });
    }
    updateDescription(descText);
}

// Inicializar o menu
menuOptions.startBattle.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        updateSelection(index);
    });
});

// Inicializar o menu de batalha
menuOptions.battleAtk.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        updateSelection(index);
    });
});