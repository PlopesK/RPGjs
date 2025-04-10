// Battle Options //
const battle = {
    initiated: false
}

function createBattleMenu() {
    return `
    <div class="battle-menu">
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
  
      <div class="actions">
        <div class="dialogueBox hidden">
        </div>
        <menu class="startBattle battle">
          <span class="description">
            <p class="info">LAUNCH A ATTACK ON THE OPPONENT.</p>
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
          ${Object.keys(characterAttacks)
            .map(
                (id, index) => `
                <button 
                  class="optBtn ${index === 0 ? "selected" : ""}" 
                  id="${id}"
                  data-attack="${characterAttacks[id].name}"
                >
                  <p id="select">&#10148;</p> ${characterAttacks[id].name.toUpperCase()} 
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
    </div>
    `;
}
document.body.innerHTML += createBattleMenu();

const battleMenu = document.querySelector(".battle-menu");
battleMenu.classList.add("hidden");

//      Canvas      //
const canvas = document.querySelector("canvas");
const cont = canvas.getContext("2d"); //Context

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;