// Script loader for RPGjs game
const scripts = [
    // External Libraries
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js', //Gsap for animations
    'https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.3/howler.min.js', //Howler for audio

    // Game Data
    { src: 'data/collisions.js', defer: true },
    { src: 'data/attacks.js', defer: true },
    { src: 'data/items.js', defer: true },
    { src: 'data/audio.js', defer: true },
    { src: 'data/monsters.js', defer: true },

    // Global Settings //
    'src/setter.js',
    
    // Core Classes
    'src/classes.js',
    
    // Game Systems
    'src/actions.js',
    
    // Main Game Logic
    'src/game.js',
    'src/battle.js',
    'loading.js',
];

function loadScript(src, attributes = {}) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        
        // Set attributes if provided
        for (const [key, value] of Object.entries(attributes)) {
            script[key] = value;
        }
        
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
    });
}

// Load all scripts in order
(async function() {
    for (const script of scripts) {
        if (typeof script === 'string') {
            await loadScript(script);
        } else {
            await loadScript(script.src, { defer: script.defer });
        }
    }
})();