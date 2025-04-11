//      Player Movement      //
const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  }
}

let lastKey = '';
const keyMap = {
  'ArrowUp': 'w',
  'ArrowLeft': 'a',
  'ArrowDown': 's',
  'ArrowRight': 'd'
};

['w', 'a', 's', 'd'].forEach(key => {
  keyMap[key] = key;
});

function getMappedKey(key) {
  return keyMap[key] || key.toLowerCase();
}

window.addEventListener("keydown", (e) => {
  const key = getMappedKey(e.key);
  if (key && keys[key]) {
    if (!keys[key].pressed) {
      keys[key].pressed = true;
      lastKey = key;
    }
  }
});

window.addEventListener("keyup", (e) => {
  const key = getMappedKey(e.key);
  if (key && keys[key]) {
    keys[key].pressed = false;
  }

  if (key === lastKey) {
    lastKey = Object.keys(keys).find(k => keys[k].pressed) || null;
  }

  player.frames.val = 0;
});

// Menu constants
const menus = {
  startBattle: document.querySelector('.startBattle'),
  battleAtk: document.querySelector('.battleAtk'),
  dialogueBox: document.querySelector('.dialogueBox')
};

const menuOptions = {
  startBattle: Array.from(menus.startBattle.querySelectorAll('.optBtn')),
  battleAtk: Array.from(menus.battleAtk.querySelectorAll('.optBtn')),
};

let currentMenu = 'startBattle';
let selectedOption = null;
let locked = false; // Lock for actions
let lastActionTime = 0; // For debounce
const debounceTime = 500; // 500 ms debounce time

// Define key mapping
const navigationMap = {
  w: -1, s: 1, a: -1, d: 1
};

const specialCases = {
  w: { 3: 1, 2: 0, 1: 2 },
  s: { 1: 3, 0: 2, 2: 1 }
};

// Define descriptions
const descriptions = {
  menus: {
    startBattle: {
      attack: "Launch an attack on the opponent.",
      specs: "View your character's stats and abilities.",
      items: "Use an item from your inventory.",
      run: "Attempt to escape from the battle.",
    },
    battleAtk: Object.keys(characterAttacks).reduce((obj, key) => ({
      ...obj, [key]: characterAttacks[key].description
    }), {}),
    dialogueBox: {
      dialogue: "No description available."
    }
  }
};

// Define escape chances
const runChance = {
  run: {
    successful: "You escaped the battle!",
    failure: "You tried to run but couldn't escape!"
  }
}

// Function to update description
function updateDescription(text) {
  const descriptionElements = document.querySelectorAll(".info");
  descriptionElements.forEach(element => {
    element.textContent = text.toUpperCase();
  });
}

// Function to update selection
function updateSelection(index) {
  const options = menuOptions[currentMenu];
  if (!options || options.length === 0) return;
  options.forEach(btn => btn.classList.remove('selected'));
  selectedOption = options[index];
  selectedOption.classList.add('selected');

  const selectedId = selectedOption.id;
  const descText = descriptions.menus[currentMenu]?.[selectedId] || "No description available.";
  updateDescription(descText);
}

// Function to handle navigation
function handleNavigation(key) {
  if (!selectedOption) {
    selectedOption = menuOptions[currentMenu][0];
  }

  const currentIndex = menuOptions[currentMenu].indexOf(selectedOption);
  let newIndex = (currentIndex + navigationMap[key] + menuOptions[currentMenu].length) % menuOptions[currentMenu].length;

  if (specialCases[key] && specialCases[key][currentIndex] !== undefined) {
    newIndex = specialCases[key][currentIndex];
  }

  updateSelection(newIndex);
}

// Function to handle action
const queue = []; // Actions order

function handleAction() {
  const currentTime = Date.now();
  if (currentTime - lastActionTime < debounceTime) return; // Debounce check
  lastActionTime = currentTime; // Update last action time

  switch (currentMenu) {
    case 'startBattle':
      switch (selectedOption?.id) {
        case 'attack':
          toggleMenu('battleAtk');
          break;
        case 'run':
          const runResult = Math.random() < 0.7 ? runChance.run.successful : runChance.run.failure;
          updateDescription(runResult);
          break;
      }
      break;
    case 'battleAtk':
      if (!locked) {
        locked = true;
        const attackName = selectedOption.dataset.attack;
        const attackData = atkList[attackName];

        queue.push(() => {
          enemyMonster.attack({ attack: atkList.Tackle, recipient: playerMonster, renderedSprites });
        });

        if (attackData) {
          playerMonster.attack({ attack: attackData, recipient: enemyMonster, renderedSprites });
          toggleMenu('dialogueBox');
        } else {
          console.warn(`Attack "${attackName}" not found.`);
        }
      }
      break;
    case 'dialogueBox':
      if (queue.length > 0) {
        queue[0]();
        queue.shift();
      } else {
        locked = false;
        toggleMenu('battleAtk');
      }
      break;
  }
}

// Function to handle mouse events
function addHoverEvents() {
  if (menuOptions && menuOptions[currentMenu]) {
    menuOptions[currentMenu].forEach(button => {
      button.addEventListener('mouseover', () => {
        if (!locked) {
          updateSelection(menuOptions[currentMenu].indexOf(button));
        }
      });

      button.addEventListener('click', () => {
        if (!locked) {
          handleAction();
        }
      });
    });
  }
}

// Function to toggle menu
function toggleMenu(newMenu) {
  menus[currentMenu].classList.add('hidden');
  menus[newMenu].classList.remove('hidden');
  currentMenu = newMenu;

  // Add click event for dialogue box to return to battleAtk
  if (newMenu === 'dialogueBox') {
    menus.dialogueBox.addEventListener('click', function () {
      handleAction()
    });
  } else {
    locked = false;
  }
  updateSelection(0); // Reset selection to the first option
  addHoverEvents(); // Re-add hover events for the new menu
}

// Function to handle key press
function handleKeydown(e) {
  const key = getMappedKey(e.key) || e.key.toLowerCase();

  if (navigationMap[key] !== undefined) {
    handleNavigation(key);
  } else if (['z', 'enter', ' '].includes(key)) {
    handleAction();
  } else if (['x', 'backspace'].includes(key)) {
    toggleMenu('startBattle');
  }
}

window.addEventListener('keydown', handleKeydown);
addHoverEvents(); // ---------------- Just for test reasons ---------------- //