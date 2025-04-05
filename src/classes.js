class Sprite {
    constructor({ 
        position, 
        image, 
        frames = { max: 1, hold: 10 }, 
        sprites, 
        animation = false, 
        scale = 1, 
        health = { max: 100, current: 100 },
        isEnemy = false,
    }) {
        this.position = position
        this.image = image
        this.frames = { ...frames, val: 0, elapsed: 0 }
        this.scale = scale

        this.image.onload = () => {
            this.width = this.image.width / this.frames.max;
            this.height = this.image.height;
        }

        this.animation = animation;
        this.sprites = sprites;
        this.opacity = 1;
        this.health = health;
        this.isEnemy = isEnemy
    }

    draw() {
        cont.save() //Using 'Save' and 'Restore' makes the Global property affect 
        // only the code whitin it
        cont.globalAlpha = this.opacity
        cont.drawImage(
            this.image,
            this.frames.val * this.width + 1, // Adiciona 1 pixel à esquerda
            1, // Adiciona 1 pixel ao topo
            this.width - 2, // Reduz 2 pixels da largura
            this.height - 2, // Reduz 2 pixels da altura
            this.position.x,
            this.position.y,
            (this.width - 2) * this.scale,
            (this.height - 2) * this.scale,
        ); //Image, Crop X, Crop Y, Crop Width, Crop Height, 
        // Image X, Image Y, Image Width, Image Height
        cont.restore() //End of the Global effect

        if (!this.animation) return;

        if (this.frames.max > 1) {
            this.frames.elapsed++;
            if (this.frames.elapsed % this.frames.hold === 0) {
                this.frames.val = (this.frames.val + 1) % this.frames.max;
            }
        }
    }

    attack({ attack, recipient }) {
        const tl = gsap.timeline()

        let movementDistance = 20
        if(this.isEnemy) movementDistance = -20

        let healthBar = '#EnemyHP'
        if(this.isEnemy) healthBar = '#PlayerHP'

        if (attack.name === "Tackle") {
            tl.to(this.position, {
                x: this.position.x - movementDistance,
                y: this.position.y
            }).to(this.position, {
                x: recipient.position.x - movementDistance * 2,
                y: recipient.position.y,
                duration: 0.1,
                onComplete: () => {
                    recipient.health.current -= attack.damage;
                    if (recipient.health.current < 0) recipient.health.current = 0;
                    const newHP = (recipient.health.current / recipient.health.max) * 100;
                    
                    gsap.to(healthBar, {
                        width: newHP + '%',
                        onComplete: () => {
                            if (recipient.health.current <= 0) {
                                gsap.to(recipient.healthBar, { opacity: 0, duration: 0.5 });
                            }
                        }
                    });

                    // Hit animation //
                    gsap.to(recipient.position, {
                        x: recipient.position.x + 20,
                        yoyo: true,
                        repeat: 5,
                        duration: 0.08
                    });
                    gsap.to(recipient, {
                        opacity: 0,
                        repeat: 5,
                        yoyo: true,
                        duration: 0.08
                    });
                }
            }).to(this.position, {
                x: this.position.x,
                y: this.position.y
            });
        }
    }
}

class Boundary {
    static width = 48;
    static height = 48;
    static buffer = 10;

    constructor({ position }) {
        this.position = position;
        this.width = Boundary.width;
        this.height = Boundary.height;
        this.buffer = Boundary.buffer;
    }

    draw() {
        cont.fillStyle = "rgba(255, 0, 0, 0)";
        cont.fillRect(this.position.x, this.position.y, this.width, this.height, this.buffer);
    }
}