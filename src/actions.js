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
const atkList = {
  atk1: { name: "Tackle", damage: 20, type: "Normal" },
  atk2: { name: "Ember", damage: 30, type: "Fire" },
  atk3: { name: "Bite", damage: 10, type: "Normal" },
  atk4: { name: "Defense", damage: 0, type: "Normal" }
}

function createBattleMenu() {
  return `
    <div class="health" id="hEnemy">
      <p>Draggle</p>
      <span class="healthBar">
        <span class="HP" id="EnemyHP">
          <p style="position: absolute" id="valueEn"></p>
        </span>
      </span>
    </div>

    <div class="health" id="hPlayer">
      <p>Emby</p>
      <span class="healthBar">
        <span class="HP" id="PlayerHP">
         <p style="position: absolute" id="valuePl"></p>
        </span>
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
          ${Object.keys(atkList)
            .map(
              (id, index) => `
                <button class="optBtn ${index === 0 ? "selected" : ""}" id="${id}">
                <p id="select">&#10148;</p> ${atkList[id].name.toUpperCase()} 
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
// document.querySelector('#valuePl').textContent = emby.health; // to see HP number
// document.querySelector('#valueEn').textContent = draggle.health; // to see HP number

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
      atk1: "Run to hit your opponent with a melee attack!",
      atk2: "A strong fire ball attack!",
      atk3: "Bite your opponent!",
      atk4: "A defensive move!"
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
  } else if (selectedOption?.id === 'atk1' && currentMenu === 'battleAtk') {
    emby.attack({ attack: atkList.atk1, recipient: draggle })
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