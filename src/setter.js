// File to set elements that are used by many scripts //
// Menus //
const menu = {
  initiated: false,
  itemInit: false,
}

const battle = {
  initiated: false
}

// Start Music //
function startMusic() {
  return `
    <div id="musicPrompt" class="modal fade-in hidden">
        <span class="modal-content">
            <p>This site has background music. Do you want to listen to it?</p>
            <button id="yesButton" class="button btn" onClick="startAudio()">Yes</button>
            <button id="noButton" class="button btn" onClick="muteAudio()">No</button>
        </span>
    </div>
  `
}

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

// Battle Options //
function createBattleMenu() {
  return `
    <div class="battle-menu">
      <!-- Setting HPs -->
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
            ${["attack", "specs", "items", "run"]
            .map(
              (id, index) => 
                `
                  <button class="optBtn ${index === 0 ? "selected" : ""}" id="${id}">
                    <p id="select">&#10148;</p> ${id.toUpperCase()}
                  </button>
                `
            )
            .join("")} 
          </span>
        </menu>
        
        <!-- Start of menu 'battleAtk' -->
        <menu class="battleAtk battle hidden">
          <span class="options">
            ${Object.keys(charAttacks)
            .map(
              (id, index) => 
                `
                  <button 
                    class="optBtn ${charAttacks[id].type} ${index === 0 ? "selected" : ""}" 
                    id="${id}"
                    data-attack="${charAttacks[id].name}"
                  >
                    <p id="select">&#10148;</p> ${charAttacks[id].name.toUpperCase()} 
                  </button>
                `
            )
            .join("")}
          </span>
          <span class="description">
            <p class="info"> DESCRIPTION </p>
          </span>
        </menu>
      </div> <!-- End of class 'actions' -->

      <!-- Start of menu 'menuItem' -->
      <menu class="menuItem hidden">
            <div class="itSection itemsImg options">
                <span class="objImg"><img src="" id="itemSprite"></span>
                <span class="description">
                    <p class="info">ITEM DESCRIPTION</p>
                </span>
            </div>
            <p id="itemTitle">ITEMS</p>
            <span class="itSection itemsCol options">
              <button class="optBtn" id="return">
                  <p id="select">&#10148;</p> RETURN
              </button>
              ${Object.keys(charItems)
              .map(
                (id, index) => 
                  `
                    <button 
                      class="optBtn ${index === 0 ? "selected" : ""}" 
                      id="${id}"
                      data-item="${charItems[id].name}"
                    >
                      <p id="select">&#10148;</p> ${charItems[id].name.toUpperCase()} 
                    </button>
                  `
              )
              .join("")}
            </span>
        </menu>
    </div> <!-- End of class 'battle-menu' -->
    `;
}
document.body.innerHTML += startMusic();
document.body.innerHTML += createBattleMenu();

const battleMenu = document.querySelector(".battle-menu");
battleMenu.classList.add("hidden");

//      Canvas      //
const canvas = document.querySelector("canvas");
const cont = canvas.getContext("2d"); //Context

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;