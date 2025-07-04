// File to set elements that are used by many scripts //
// //////////////////// Menus //////////////////// //
const menu = {
  initiated: false,
  itemInit: false,
  specsInit: false,
}

const battle = {
  initiated: false
}

// //////////////////// Player Anim Sound //////////////////// //
let lastStepTime = 0;
const stepInterval = 650; // ms entre sons de passo
let isOnGrass = false;

// //////////////////// Start Music //////////////////// //
function startMusic() {
  return `
    <div id="musicPrompt" class="modal fade-in hidden">
        <span class="modal-content">
            <p class="typewriter">This site has background music. Do you want to listen to it?</p>
            <button id="yesButton" class="button btn" onClick="startAudio()">Yes</button>
            <button id="noButton" class="button btn" onClick="muteAudio()">No</button>
        </span>
    </div>
  `
}
document.getElementById("musicPropmtWrapper").innerHTML = startMusic();

// 🎵 Music prompt //
let musicOption = null;
let isMuted = false;
let musicKeydown;
let musicMouseover;

function setupMusicPrompt() {
  menu.initiated = true
  const musicPrompt = document.getElementById("musicPrompt");
  musicPrompt.classList.remove("hidden");

  musicOption = "yes";
  document.getElementById("yesButton").classList.add("selected");

  const navigationMap = {
    a: "yes",
    d: "no",
    ArrowLeft: "yes",
    ArrowRight: "no"
  };

  musicKeydown = (e) => {
    if (menu.initiated) {
      const key = getMappedKey(e.key) || e.key.toLowerCase();
      const actionKeys = ['z', 'Enter', ' '];
      if (key in navigationMap) {
        musicOption = navigationMap[key];
        updateMusicBtn();
      } else if (actionKeys.includes(key)) {
        if (musicOption === "yes") {
          startAudio();
        } else {
          muteAudio();
        }
      }
    }
  };

  musicMouseover = (e) => {
    const target = e.target;
    if (target.id === "yesButton" || target.id === "noButton") {
      const buttons = document.querySelectorAll("#yesButton, #noButton");
      buttons.forEach((button) => button.classList.remove("selected"));
      target.classList.add("selected");
      musicOption = target.id === "yesButton" ? "yes" : "no";
    }
  };

  document.addEventListener("keydown", musicKeydown);
  document.addEventListener("mouseover", musicMouseover);
}

function updateMusicBtn() {
  document.getElementById("yesButton").classList.toggle("selected", musicOption === "yes");
  document.getElementById("noButton").classList.toggle("selected", musicOption === "no");
}

function startAudio() {
  exitMusicMenu();
  Howler.ctx.resume();
  audio.menuClick.play();
  audio.Map.play();
}

function muteAudio() {
  exitMusicMenu();
  isMuted = true;
  Object.values(audio).forEach(sfx => {
    sfx.mute(true);
  });
}

function exitMusicMenu() {
  const musicPrompt = document.getElementById("musicPrompt");
  musicPrompt.style.display = "none";
  musicOption = null;
  menu.initiated = false

  document.removeEventListener("keydown", musicKeydown);
  document.removeEventListener("mouseover", musicMouseover);
}

// //////////////////// Items //////////////////// //
function addItem(key, qty = 1) {
  if (!itemList[key]) {
    console.warn(`Item ${key} não existe em itemList`);
    return;
  }
  inventory[key] = (inventory[key] || 0) + qty;
  updateItemsMenu();
}

function removeItem(key, qty = 1) {
  if (!inventory[key]) return;
  inventory[key] -= qty;
  if (inventory[key] <= 0) {
    delete inventory[key];
  }
  updateItemsMenu();
}

// //////////////////// Render Menus //////////////////// //
function renderItemButtons() {
  return Object.entries(inventory)
    .map(([key, qty], index) => {
      const item = itemList[key];
      return `
        <button
          class="optBtn ${index === 0 ? "selected" : ""}"
          id="${key}"
          data-item="${item.name}"
        >
          <p id="select">&#10148;</p>
          ${item.name.toUpperCase()} (x${qty})
        </button>
      `;
    })
    .join("");
}

function updateItemsMenu() {
  const itemsContainer = document.getElementById('itemsOptions');
  const returnBtnHtml = `
    <button class="optBtn" id="return">
      <p id="select">&#10148;</p> RETURN
    </button>
  `;
  itemsContainer.innerHTML = returnBtnHtml + renderItemButtons();
}

function renderStartBattleMenu(options) {
  return options.map((id, index) => `
    <button class="optBtn ${index === 0 ? "selected" : ""}" id="${id}">
      <p id="select">&#10148;</p> ${id.toUpperCase()}
    </button>
  `).join("");
}

function renderAttackMenu() {
  return Object.keys(charAttacks).map((id, index) => `
    <button 
      class="optBtn ${charAttacks[id].type} ${index === 0 ? "selected" : ""}" 
      id="${id}" 
      data-attack="${charAttacks[id].name}">
      <p id="select">&#10148;</p> ${charAttacks[id].name.toUpperCase()}
    </button>
  `).join("");
}

function renderStats(monsterKey = "Emby") {
  const stats = monsterData[monsterKey].stats;

  return `
    <div class="statsInfo specTxt">
      HP:
      <span class="healthBar">
        <span class="HP" id="SpecsHP"></span>
        <p style="position: absolute" id="valueSp">${stats.hp}</p>
      </span>
    </div>
    <div class="statsInfo specTxt">
      ATK: 
      <p id="atkValue"> ${stats.atk}</p>
    </div>
    <div class="statsInfo specTxt">
      DEF: 
      <p id="defValue"> ${stats.def}</p>
    </div>
    <div class="statsInfo specTxt">
      SPD: 
      <p id="spdValue"> ${stats.spd}</p>
    </div>
  `;
}

function renderSpecsAttackList(monsterKey = charAttacks) {
  const attacks = Object.values(monsterKey);
  return attacks.map((atk, index) => `
    <button 
      class="optBtn ${atk.type} ${index === 0 ? "selected" : ""}" 
      id="${atk}" 
      data-attack="${atk.name}">
      <p id="select">&#10148;</p> ${atk.name.toUpperCase()}
    </button>
  `).join("");
}

function renderHP() {
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
  `
}

// //////////////////// Battle Options //////////////////// //
function createBattleMenu() {
  return `
    <div class="battle-menu">
      <!-- HPs UI -->
      ${renderHP()}

      <!-- Actions UI -->
      <div class="actions">
        <div class="dialogueBox hidden">
        </div>

        <!-- Start of menu 'startBattle' -->
        <menu class="startBattle battle">
          <span class="description">
            <p class="info">LAUNCH A ATTACK ON THE OPPONENT.</p>
          </span>
          <span class="options">
            ${renderStartBattleMenu(["attack", "specs", "items", "run"])}
          </span>
        </menu>
        
        <!-- Start of menu 'battleAtk' -->
        <menu class="battleAtk battle hidden">
          <span class="options">
            ${renderAttackMenu()}
          </span>
          <span class="description">
            <p class="info"> DESCRIPTION </p>
          </span>
        </menu>
      </div> <!-- End of class 'actions' -->

      <!-- Start of menu 'menuItem' -->
      <menu class="menuFullScreen menuItem hidden">
          <div class="menuSection menuImg options">
              <span class="objImg"><img src="" id="itemSprite"></span>
              <span class="description">
                  <p class="info">ITEM DESCRIPTION</p>
              </span>
          </div>
          <p id="itemTitle">ITEMS</p>
          <span class="menuSection menuCol options" id="itemsOptions">
            <button class="optBtn" id="return">
              <p id="select">&#10148;</p> RETURN
            </button>
            ${renderItemButtons()}
          </span>
      </menu>

      <!-- Start of menu 'menuSpecs' -->
      <menu class="menuFullScreen menuSpecs hidden">
          <p class="specTxt" id="specTitle">SPECS</p>

          <button class="optBtn" id="return">
            <p id="select">&#10148;</p> RETURN
          </button>

          <div class="specSect">
            <button class="optBtn" id="leftArrow">&lt;</button>
            <p class="specTxt" id="pageInfo">PLAYER</p>
            <button class="optBtn" id="rightArrow">&gt;</button>
          </div>

          <div class="specInfo">
            <div class="menuSection menuImg options">
              <span class="objImg specsImg"> <div id="specsSprite"></div> </span>
              <span class="description">
                <p class="monsterInfo" id="monster">MONSTER NAME</p>
              </span>
            </div>

            
            <div class="menuSection">
              <div class="statsList">
                ${renderStats()}
              </div>


              <div class="statsList">
                <div class="atkList specTxt">
                  <p id="atkListTitle">Atk List:</p>
                  <span class="atkGrid">
                    ${renderSpecsAttackList()}
                  </span>
                </div>

                <div class="menuSection atkDesc">
                  <span class="description">
                    <p class="info atkInfo">ATTACK DESCRIPTION</p>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </menu>
    </div>
    `;
}
document.getElementById("battleMenuWrapper").innerHTML = createBattleMenu();

const battleMenu = document.querySelector(".battle-menu");
battleMenu.classList.add("hidden");

//      Canvas      //
const canvas = document.querySelector("canvas");
const cont = canvas.getContext("2d"); //Context

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;