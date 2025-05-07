const loading = document.querySelector("#loading");
const introScreen = document.querySelector(".intro");
let progressLoading = 0;
const loadingDuration = 2000;
const intervalSpeed = loadingDuration / 50;
let canSkip = false;
let introFinalized = false;

document.addEventListener("DOMContentLoaded", () => {
    const zoomLevel = getZoomLevel();
    if (zoomLevel !== 1) {
        displayZoomMessage();
    }

    const loadingInterval = setInterval(() => {
        progressLoading += 2;
        console.log(`ProgressLoading: ${progressLoading}`);
        if (progressLoading >= 100) {
            console.log(`Progress alcançou 100`);
            clearInterval(loadingInterval);
            loading.classList.add("fade-out");
            loading.addEventListener("animationend", () => {
                loading.classList.add("hidden");
                introScreen.classList.remove("hidden");
                runIntroAnimations();
                console.clear();
            }, { once: true });
        }
    }, intervalSpeed);
});

function runIntroAnimations() {
    const sections = document.querySelectorAll(".ldSection");
    const sectionTransitionTime = 5000;
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
            document.getElementById("canvas").classList.remove("hidden");

            gsap.to(introScreen, {
                duration: 1,
                opacity: 0,
                onComplete: () => {
                    introScreen.classList.add("hidden");
                    handleIntroScreenAnimationEnd();
                }
            });

            gsap.to(document.getElementById("canvas"), {
                duration: 0.5,
                opacity: 0,
                onComplete: () => {
                    gsap.to(document.getElementById("canvas"), {
                        opacity: 1,
                        duration: 0.5
                    });
                }
            });
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
    }

    setTimeout(transitionNextSection, sectionTransitionTime);
}

function getZoomLevel() {
    return window.devicePixelRatio || 1;
}

function displayZoomMessage() {
    alert("Please set the zoom level to 100% for optimal experience.");
    const message = document.querySelector(".message");
    message.classList.remove("hidden");
}