document.addEventListener("DOMContentLoaded", function() {
    // Zoom //
    const zoomLevel = getZoomLevel();
    if (zoomLevel !== 1) {
        displayZoomMessage();
    }

    // Wait for GSAP to be available
    function runLoadingAnimations() {
        const loading = document.querySelector("#loading");
        const introScreen = document.querySelector(".intro");
        let progress = 0;

        const startTime = performance.now();
        for (let i = 0; i < 1e6; i++) {}
        const executionTime = performance.now() - startTime;

        const intervalSpeed = Math.max(50, Math.min(500, executionTime * 5));

        const loadingInterval = setInterval(() => {
            progress += 2;
            if (progress >= 100) {
                console.log("Loaded!")
                clearInterval(loadingInterval);

                // GSAP fade out loading screen
                gsap.to(loading, {
                    duration: 1,
                    opacity: 0,
                    onComplete: () => {
                        loading.classList.add("hidden");
                        // GSAP fade in intro screen
                        gsap.fromTo(introScreen, {opacity: 0}, {duration: 1, opacity: 1, onStart: () => {
                            introScreen.classList.remove("hidden");
                        }});
                    }
                });
            }
        }, intervalSpeed);

        // Intro //
        const sections = document.querySelectorAll(".ldSection");
        const sectionTransitionTime = 5000;
        let currentIndex = 0;
        let skipIntro = false;

        function transitionNextSection() {
            if (!sections.length) return;

            if (skipIntro) {
                sections[currentIndex].classList.add("hidden");
                document.getElementById("canvas").classList.remove("hidden");

                // GSAP fade out intro screen
                gsap.to(introScreen, {
                    duration: 1,
                    opacity: 0,
                    onComplete: () => {
                        introScreen.classList.add("hidden");
                        handleIntroScreenAnimationEnd();
                    }
                });
                return;
            }

            // Remove previous event listeners to avoid multiple bindings
            document.removeEventListener("click", handleSkipIntro);
            document.removeEventListener("keydown", handleKeyDown);

            document.addEventListener("click", handleSkipIntro);
            document.addEventListener("keydown", handleKeyDown);

            if (currentIndex < sections.length - 1) {
                sections[currentIndex].classList.add("hidden");
                sections[currentIndex + 1].classList.remove("hidden");
                currentIndex++;
                setTimeout(transitionNextSection, sectionTransitionTime);
            } else {
                sections[currentIndex].classList.add("hidden");
                document.getElementById("canvas").classList.remove("hidden");

                // GSAP fade out intro screen
                gsap.to(introScreen, {
                    duration: 1,
                    opacity: 0,
                    onComplete: () => {
                        introScreen.classList.add("hidden");
                        handleIntroScreenAnimationEnd();
                    }
                });
            }
        }

        function handleKeyDown(event) {
            if (event.key === " " || event.keyCode === 32) {
                event.preventDefault();
                skipIntro = true;
                transitionNextSection();
            }
        }

        function handleSkipIntro() {
            skipIntro = true;
            transitionNextSection();
        }

        function handleIntroScreenAnimationEnd() {
            document.removeEventListener("click", handleSkipIntro);
            document.removeEventListener("keydown", handleKeyDown);
            
            //init() //Start in the battle scene
            animate() //Start in the map
            setupMusicPrompt();
        }

        setTimeout(transitionNextSection, sectionTransitionTime);
    }

    if (typeof gsap === "undefined") {
        const gsapCheckInterval = setInterval(() => {
            if (typeof gsap !== "undefined") {
                clearInterval(gsapCheckInterval);
                runLoadingAnimations();
            }
        }, 100);
    } else {
        runLoadingAnimations();
    }
});

function getZoomLevel() {
    return window.devicePixelRatio || 1;
}

function displayZoomMessage() {
    alert("Please set the zoom level to 100% for optimal experience.");
    const message = document.querySelector(".message");
    message.classList.remove("hidden");
}
