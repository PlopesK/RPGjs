// //////////////////// Loading //////////////////// //
function startIntro() {
    return `
      <section class="modal intro hidden">
          <div class="ldSection" id="section1">
              <p>This project is a non-commercial fan production inspired by the Pokémon franchise and features various assets sourced from itch.io</p>
          </div>
  
          <div class="ldSection hidden" id="section2">
              <h2>🎮 Developted by: 🎮</h2>
              
              <a href="https://github.com/PlopesK">
                  <p>PlopesK<br> (Gabriel Primo)</p>
                  <img src="https://avatars.githubusercontent.com/u/101651798?v=4" 
                  alt="PlopesK" title="PlopesK">
              </a>
          </div>
  
          <div class="ldSection hidden" id="section3">
              <section class="credits">
                  <div class="credit-group">
                    <h3>// Base Idea //</h3>
                    <p><strong>Chris Courses</strong> — <a href="https://youtu.be/yP5DKzriqXA?si=ji_jy9SNNm9VJGuM" target="_blank">Video</a></p>
                  </div>
  
                  <div class="credit-group">
                    <h3>// Font //</h3>
                    <p><strong>DaFont</strong> — <a href="https://www.dafont.com/pkmn-rbygsc.font" target="_blank">PKMN RBYGSC</a></p>
                  </div>
                
                  <div class="credit-group">
                    <h3>// Pixel Art Sprites //</h3>
                    <ul>
                      <li><strong>Cyporkador</strong> — <a href="https://cypor.itch.io/12x12-rpg-tileset" target="_blank">Map & Characters</a></li>
                      <li><strong>Pixel_Poem</strong> — <a href="https://pixel-poem.itch.io/dungeon-assetpuck" target="_blank">Potion Sprites</a></li>
                      <li><strong>Pimen</strong> — 
                        <a href="https://pimen.itch.io/cutting-and-healing" target="_blank">Healing</a>,
                        <a href="https://pimen.itch.io/pixel-battle-effects" target="_blank">Hit</a>,
                        <a href="https://pimen.itch.io/magical-animation-effects" target="_blank">Fire & Defense Effects</a>
                      </li>
                      <li><strong>Pixel-boy</strong> — <a href="https://pixel-boy.itch.io/ninja-adventure-asset-pack" target="_blank">Fireball & Monsters</a></li>
                    </ul>
                  </div>
                
                  <div class="credit-group">
                    <h3>// SFX //</h3>
                    <p><strong>Hunter Audio Production</strong> — 
                      <a href="https://hunteraudio.itch.io/8bit-sfx-and-music-pack" target="_blank">8-Bit SFX & Music Pack</a><br>
                      <em>(Menu, Healing, FireDance, Defense, Walking & Battle Music)</em>
                    </p>
                  </div>
              </section>
          </div>
      </section>
    `
}
document.getElementById("introWrapper").innerHTML = startIntro();

const loading = document.getElementById("loading");
const introScreen = document.querySelector(".intro");
let progressLoading = 0;
const loadingDuration = 3000;
const intervalSpeed = loadingDuration / 50;
let canSkip = false;
let introFinalized = false;

function prepareLoading() {
    const loadingInterval = setInterval(() => {
        progressLoading += 2;
        if (progressLoading >= 100) {
            clearInterval(loadingInterval);
            loading.classList.add("fade-out");
            loading.addEventListener("animationend", () => {
                loading.classList.add("hidden");
                introScreen.classList.remove("hidden");
                runIntroAnimations();
            });
        }
    }, intervalSpeed);
}

function runIntroAnimations() {
    console.clear();
    const sections = document.querySelectorAll(".ldSection");
    const sectionTransitionTime = 2500;
    let currentIndex = 0;

    function transitionNextSection() {
        if (!sections.length) return;

        document.addEventListener("click", trySkip);
        document.addEventListener("keydown", handleKeyDown);

        if (currentIndex < sections.length - 1) {
            sections[currentIndex].classList.add("hidden");
            currentIndex++;
            const nextSection = sections[currentIndex];
            nextSection.classList.remove("hidden");
            canSkip = false;

            gsap.fromTo(nextSection,
                { opacity: 0, y: 20 },
                {
                    opacity: 1, y: 0, duration: 1, onComplete: () => {
                        canSkip = true;
                        setTimeout(transitionNextSection, sectionTransitionTime);
                    }
                }
            );
        } else if (!introFinalized) {
            introFinalized = true;

            sections[currentIndex].classList.add("hidden");
            introScreen.classList.add("hidden");
            handleIntroScreenAnimationEnd();
        }
    }

    function trySkip() {
        if (canSkip) transitionNextSection();
    }

    function handleKeyDown(event) {
        if ((event.key === " " || event.keyCode === 32) && canSkip) {
            event.preventDefault();
            trySkip();
        }
    }

    function handleIntroScreenAnimationEnd() {
        document.removeEventListener("click", trySkip);
        document.removeEventListener("keydown", handleKeyDown);

        animate();
        setupMusicPrompt();
        canvas.classList.add("fade-in");
    }

    setTimeout(transitionNextSection, sectionTransitionTime);
}

const zoomLevel = getZoomLevel();
if (zoomLevel !== 1) {
    displayZoomMessage();
}

function getZoomLevel() {
    return window.devicePixelRatio || 1;
}

function displayZoomMessage() {
    alert("Please set the zoom level to 100% for optimal experience.");
    const message = document.querySelector(".message");
    message.classList.remove("hidden");
}

prepareLoading();