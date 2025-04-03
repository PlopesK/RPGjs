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
function createBattleMenu() {
  return `
    <div class="health enemy">
      <p>Draggle</p>
      <span class="healthBar">
        <span class="HP"></span>
      </span>
    </div>

    <div class="health player">
      <p>Emby</p>
      <span class="healthBar">
        <span class="HP"></span>
      </span>
    </div>

    <div class="actions hidden">
      <menu class="startBattle battle">
        <span class="description">
          <p class="info">LAUNCH A ATTACK ON THE OPPONENT</p>
        </span>
        <span class="options">
          ${["attack", "specs", "items", "run"]
            .map(
              (id, index) => `
              <button class="optBtn ${index === 0 ? "selected" : ""}" id="${id}">
                <p id="select">&#10148;</p> ${id.toUpperCase()}
              </button>
            `
            )
            .join("")}
        </span>
      </menu>

      <menu class="battleAtk battle hidden">
        <span class="options">
          ${["atk1", "atk2", "atk3", "atk4"]
            .map(
              (id, index) => `
              <button class="optBtn ${index === 0 ? "selected" : ""}" id="${id}">
                <p id="select">&#10148;</p> ATTACK${index + 1}
              </button>
            `
            )
            .join("")}
        </span>
        <span class="description">
            <p class="info"> DESCRIPTION </p>
        </span>
      </menu>
    </div>
  `;
}
document.body.innerHTML += createBattleMenu();

// Setting menus
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

const descriptions = {
  menus: {
    startBattle: {
      attack: "Launch a attack on the opponent.",
      specs: "View your character's stats and abilities.",
      items: "Use an item from your inventory.",
      run: "Attempt to escape from the battle.",
    },
    battleAtk: {
      atk1: "A strong melee attack!",
      atk2: "A ranged attack with a bow.",
      atk3: "A magic fireball spell.",
      atk4: "A defensive counter move."
    }
  }
};

const runChance = {
  run: {
    successful: "You escaped the battle!",
    failure: "You tried to run but couldn't escape!"
  }
}

function updateDescription(text) {
  const descriptionElements = document.querySelectorAll(".info");
  descriptionElements.forEach(element => {
    element.textContent = text.toUpperCase();
  });
}

function updateSelection(index) {
  menuOptions[currentMenu].forEach(btn => btn.classList.remove('selected'));
  selectedOption = menuOptions[currentMenu][index];
  selectedOption.classList.add('selected');

  const selectedId = selectedOption.id;
  const descText = descriptions.menus[currentMenu][selectedId] || "No description available.";
  updateDescription(descText);
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
  } else if (selectedOption?.id === 'run' && currentMenu === 'startBattle') {
    if (Math.random() < 0.7) {
      updateDescription(runChance.run.successful);
    } else {
      updateDescription(runChance.run.failure);
    }
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
addHoverEvents(); // ---------------- Just for test reasons ---------------- //