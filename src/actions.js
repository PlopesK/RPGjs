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

// Battle Options //
const menus = {
  startBattle: document.querySelector('.startBattle'),
  battleAtk: document.querySelector('.battleAtk')
};

const menuOptions = {
  startBattle: Array.from(menus.startBattle.querySelectorAll('.optBtn')),
  battleAtk: Array.from(menus.battleAtk.querySelectorAll('.optBtn'))
};

let currentMenu = 'startBattle';
let selectedOption = null;

const navigationMap = {
  w: -1, s: 1, a: -1, d: 1
};

const specialCases = {
  w: { 3: 1, 2: 0, 1: 2 },
  s: { 1: 3, 0: 2, 2: 1 }
};

function updateSelection(index) {
  menuOptions[currentMenu].forEach(btn => btn.classList.remove('selected'));
  selectedOption = menuOptions[currentMenu][index];
  selectedOption.classList.add('selected');
}

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

function handleAction() {
  if (selectedOption?.id === 'attack' && currentMenu === 'startBattle') {
    toggleMenu('battleAtk');
  }
}

function addHoverEvents() {
  menuOptions[currentMenu].forEach(button => {
    button.addEventListener('mouseover', () => {
      updateSelection(menuOptions[currentMenu].indexOf(button));
    });
    button.addEventListener('click', () => {
      handleAction();
    });
  });
}

function toggleMenu(newMenu) {
  menus[currentMenu].classList.add('hidden');
  menus[newMenu].classList.remove('hidden');
  currentMenu = newMenu;
  selectedOption = null;
  updateSelection(0);
  addHoverEvents();
}

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
addHoverEvents();