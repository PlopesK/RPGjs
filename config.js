// Script loader for RPGjs game
const scripts = [
    // External Libraries
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js',
    
    // Game Data
    { src: 'data/collisions.js', defer: true },
    { src: 'data/attacks.js', defer: true },
    'data/monsters.js',

    // Global Settings //
    'src/setter.js',
    
    // Core Classes
    'src/classes.js',
    
    // Game Systems
    'src/actions.js',
    
    // Main Game Logic
    'src/game.js',
    'src/battle.js'
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