//      Player Movement      //
const keys = {
    w: {
        pressed: false,
        keyCode: 87
    },
    a: {
        pressed: false,
        keyCode: 65
    },
    s: {
        pressed: false,
        keyCode: 83
    },
    d: {
        pressed: false,
        keyCode: 68
    }
}

let lastKey = '';
const keyMap = {
  'ArrowUp': 'w',
  'ArrowLeft': 'a',
  'ArrowDown': 's',
  'ArrowRight': 'd',
  'w': 'w',
  'a': 'a',
  's': 's',
  'd': 'd',
  'W': 'w',
  'A': 'a',
  'S': 's',
  'D': 'd',
};

window.addEventListener("keydown", (e) => {
    const key = keyMap[e.key];
    if (key && !keys[key].pressed) {
        keys[key].pressed = true;
        lastKey = key;
    }
});

window.addEventListener("keyup", (e) => {
    const key = keyMap[e.key];
    if (key) {
        keys[key].pressed = false;
    }

    if (key === lastKey) {
        lastKey = Object.keys(keys).find(k => keys[k].pressed) || null;
    }

    player.frames.val = 0;
});

// Battle Options //
const options = document.querySelector('.options');
const buttons = options.querySelectorAll('.optBtn');
const optionsArray = Array.from(buttons);
let selectedOption = null;

const menus = {
  startBattle: {
    menu: document.querySelector('.startBattle'),
    options: document.querySelector('.startBattle .options'),
    buttons: document.querySelector('.startBattle .options').querySelectorAll('.optBtn'),
  },
  battleAtk: {
    menu: document.querySelector('.battleAtk'),
    options: document.querySelector('.battleAtk .options'),
    buttons: document.querySelector('.battleAtk .options').querySelectorAll('.optBtn'),
  },
};

const { menu: startBattleMenu, options: startBattleOptions, buttons: startBattleButtons } = menus.startBattle;
const { menu: battleAtkMenu, options: battleAtkOptions, buttons: battleAtkButtons } = menus.battleAtk;

const currentMenu = menus.startBattle;
let keydownEvent = null;

function manageOptions(buttons) {
  const optionsArray = Array.from(buttons);
  let selectedOption = null;

  const navigationMap = {
    [keys.w.keyCode]: (currentIndex) => (currentIndex - 1 + optionsArray.length) % optionsArray.length,
    [keys.s.keyCode]: (currentIndex) => (currentIndex + 1) % optionsArray.length,
    [keys.a.keyCode]: (currentIndex) => (currentIndex - 1 + optionsArray.length) % optionsArray.length,
    [keys.d.keyCode]: (currentIndex) => (currentIndex + 1) % optionsArray.length,
  };

  const specialCases = {
    [keys.w.keyCode]: {
      3: 1,
      2: 0,
      1: 2,
    },
    [keys.s.keyCode]: {
      1: 3,
      0: 2,
      2: 1,
    },
  };

  // ------------------ Handle Key animations ------------------ //
  class KeyHandler {
    constructor(navigationKeys, zKey, returnKey) {
      this.navigationKeys = navigationKeys;
      this.zKey = zKey;
      this.returnKey = returnKey;
      this.selectedOption = null;
    }
  
    handleNavigationKey(key, optionsArray, navigationMap, specialCases) {
      if (!this.selectedOption) {
        this.selectedOption = optionsArray[0];
      }
  
      optionsArray.forEach(button => {
        button.querySelector('#select').classList.remove('selected');
        button.classList.remove('selected');
      });
  
      const currentIndex = optionsArray.indexOf(this.selectedOption);
      let newIndex = navigationMap[keys[key].keyCode](currentIndex);
  
      if (currentIndex === 2 && key === 'w') {
        newIndex = 0;
      }
      if (specialCases[keys[key].keyCode] && specialCases[keys[key].keyCode][currentIndex]) {
        newIndex = specialCases[keys[key].keyCode][currentIndex];
      }
  
      this.selectedOption = optionsArray[newIndex];
      this.selectedOption.querySelector('#select').classList.add('selected');
      this.selectedOption.classList.add('selected');
    }
  
    handleZKey(optionsArray) {
      if (this.selectedOption && optionsArray.indexOf(this.selectedOption) === 0 && this.selectedOption.id === 'attack') {
        openMenuAtk();
      }
    }
  
    handleKeydown(e, optionsArray, navigationMap, specialCases) {
      const key = keyMap[e.key];
    
      if (this.navigationKeys.includes(key)) {
          this.handleNavigationKey(key, optionsArray, navigationMap, specialCases);
      } else if (this.zKey.includes(e.key)) {
          this.handleZKey(optionsArray);
      } else if (this.returnKey.includes(e.key)) {
          returnStart();
      }
    }
  }
  const keyHandler = new KeyHandler(
    ['w', 'a', 's', 'd'], 
    ['z', 'Z', 'Enter', ' '],
    ['x', 'X', 'Backspace']
  );
  window.addEventListener('keydown', (e) => keyHandler.handleKeydown(e, optionsArray, navigationMap, specialCases));

  // ------------------ Handle mouse animations ------------------ //
  const handleMouseover = (button) => {
    optionsArray.forEach(otherButton => {
      otherButton.querySelector('#select').classList.remove('selected');
      otherButton.classList.remove('selected');
    });

    button.querySelector('#select').classList.add('selected');
    button.classList.add('selected');
    selectedOption = button;

    if (selectedOption && optionsArray.indexOf(selectedOption) === 0 && selectedOption.id === 'attack') {
      button.addEventListener('click', () => {
        openMenuAtk();
      });
    }
  };

  const handleMouseout = (button) => {
    button.querySelector('#select').classList.remove('selected');
    button.classList.remove('selected');
    if (selectedOption === button) {
      selectedOption = null;
    }
  };

  const cleanup = () => {
    window.removeEventListener('keydown', KeyHandler.handleKeydown);
    optionsArray.forEach(button => {
      button.removeEventListener('mouseover', () => handleMouseover(button));
      button.removeEventListener('mouseout', () => handleMouseout(button));
    });
  };

  optionsArray.forEach(button => {
    button.addEventListener('mouseover', () => handleMouseover(button));
    button.addEventListener('mouseout', () => handleMouseout(button));
  });

  return cleanup;
}

function openMenuAtk() {
  battleAtkMenu.classList.remove("hidden");
  startBattleMenu.classList.add("hidden");
  const cleanup = manageOptions(battleAtkButtons);
  return cleanup;
}

function returnStart() {
  startBattleMenu.classList.remove("hidden");
  battleAtkMenu.classList.add("hidden");
  const cleanup = manageOptions(startBattleButtons);
  return cleanup;
}

const cleanup = manageOptions(startBattleButtons);