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

// //////////////////// MENU //////////////////// //
const menus = {
  startBattle: document.querySelector('.startBattle'),
  battleAtk: document.querySelector('.battleAtk'),
  dialogueBox: document.querySelector('.dialogueBox'),
  itemMenu: document.querySelector('.menuItem'),
};

const menuOptions = {
  startBattle: Array.from(menus.startBattle.querySelectorAll('.optBtn')),
  battleAtk: Array.from(menus.battleAtk.querySelectorAll('.optBtn')),
  itemMenu: Array.from(menus.itemMenu.querySelectorAll('.optBtn')),
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
    battleAtk: Object.keys(charAttacks).reduce((obj, key) => ({
      ...obj, [key]: charAttacks[key].description
    }), {}),
    itemMenu: Object.keys(charItems).reduce((obj, key) => ({
      ...obj, [key]: charItems[key].description
    }), {}),

  }
}; 

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
  if (!options?.length) return;

  options.forEach(btn => btn.classList.remove('selected'));
  selectedOption = options[index];
  selectedOption.classList.add('selected');

  const descText = descriptions.menus[currentMenu]?.[selectedOption.id] ?? "No description available.";
  updateDescription(descText);
}

// Function to handle navigation
function handleNavigation(key) {
  const options = menuOptions[currentMenu];
  if (!options?.length) return;

  const currentIndex = selectedOption ? options.indexOf(selectedOption) : 0;
  let newIndex = (currentIndex + navigationMap[key] + options.length) % options.length;

  if (specialCases[key] && 
    specialCases[key][currentIndex] !== undefined && 
    !menu.itemInit) 
  {
    newIndex = specialCases[key][currentIndex];
  }

  updateSelection(newIndex);
}

// Function to handle action //
function handleAction() {
  const currentTime = Date.now();
  if (currentTime - lastActionTime < debounceTime) return; // Debounce check
  lastActionTime = currentTime; // Update last action time
  audio.menuClick.play();

  switch (currentMenu) {
    case 'startBattle':
      handleStartBattle();
      break;

    case 'battleAtk':
      handleBattleAtk();
      break;

    case 'itemMenu':
      handleItemMenu();
      break;

    case 'dialogueBox':
      handleDialogueBox();
      break;
  }
}

// Function to handle start actions //
function handleStartBattle() {
  switch (selectedOption?.id) {
    case 'attack':
      toggleMenu('battleAtk');
      break;

    case 'items':
      menu.itemInit = true;
      toggleMenu('itemMenu');
      break;

    case 'run':
      toggleMenu('dialogueBox');
      playerMonster.run()
      break;
  }
}

// Function to handle item menu action //
function handleItemMenu() {
  //later adding logic
}

// Function to handle battle menu actions //
function handleBattleAtk() {
  if (!locked) {
    locked = true;
    const attackName = selectedOption.dataset.attack;
    const attackData = atkList[attackName];

    if (attackData) {
      playerMonster.attack({ attack: attackData, recipient: enemyMonster, renderedSprites });
      toggleMenu('dialogueBox');
    } else {
      console.warn(`Attack "${attackName}" not found.`);
    }

    if (enemyMonster.health.current <= 0) {
      queue.push(() => {
        enemyMonster.faint()
      })
      queue.push(() => {
        endBattle()
      })
      return
    }

    queue.push(() => {
      enemyAttack();
    });
  }
}

function enemyAttack() { // Attack enemy section //
  const randomAtk = enemyMonster.monsterAttacks[Math.floor(Math.random() * enemyMonster.monsterAttacks.length)];
  enemyMonster.attack({ attack: randomAtk, recipient: playerMonster, renderedSprites });

  if (playerMonster.health.current <= 0) {
    queue.push(() => {
      playerMonster.faint()
    })
    queue.push(() => {
      endBattle()
    })
    return
  }
}

// Function end battle //
function endBattle() {
  cancelAnimationFrame(battleAnimationId);
  endBattleTransition();
}

// Function to handle dialogue box //
function handleDialogueBox() {
  if (queue.length > 0) {
    queue[0]();
    queue.shift();
  } else {
    locked = false;
    toggleMenu('battleAtk');
  }
}

// Function to handle mouse events
function addHoverEvents() {
  if (menuOptions && menuOptions[currentMenu]) {
    menuOptions[currentMenu].forEach(button => {
      button.addEventListener('mouseover', handleMouseOver);
      button.addEventListener('click', handleMouseClick);
    });
  }

  function handleMouseOver() {
    if (!locked) {
      updateSelection(menuOptions[currentMenu].indexOf(this));
    }
  }

  function handleMouseClick() {
    if (!locked) {
      handleAction();
    }
  }
}

// Function to toggle menu
function toggleMenu(newMenu) {
  menus[currentMenu].classList.add('hidden');
  menus[newMenu].classList.remove('hidden');
  currentMenu = newMenu;

  // Remove existing click event for dialogue box
  if (newMenu === 'dialogueBox') {
    menus.dialogueBox.addEventListener('click', handleAction);
  } else {
    menus.dialogueBox.removeEventListener('click', handleAction);
    locked = false;
  }

  updateSelection(0); // Reset selection to the first option
  addHoverEvents(); // Re-add hover events for the new menu
}

// Function to handle key press
function handleKeydown(e) {
  const key = getMappedKey(e.key) || e.key.toLowerCase();

  if (battle.initiated) {
    const actions = {
      navigation: navigationMap[key] !== undefined ? handleNavigation : null,
      action: ['z', 'enter', ' '].includes(key) ? handleAction : null,
      back: ['x', 'backspace'].includes(key) ? () => {
        if (currentMenu === 'dialogueBox') {
          handleAction();
        } else {
          menu.itemInit = false;
          toggleMenu('startBattle')
          audio.menuReturn.play()
        }
      } : null,
    };

    // Get the first non-null action from the actions object
    const action = actions.navigation || actions.action || actions.back;
    // Execute the action if it exists
    action && action(key);
  } else {
    return
  }
}