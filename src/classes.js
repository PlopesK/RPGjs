class Sprite {
    constructor({ position, image, frames = { max: 1, hold: 10 }, sprites, animation = false, scale = 1, health = { max: 100 } }) {
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
        this.health = 100;
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

        let movementDistance

        if (attack.name === "Tackle") {
            const movementDistance = recipient.position.x - this.position.x - 60;

            tl.to(this.position, {
                x: this.position.x - 30,
                y: this.position.y
            }).to(this.position, {
                x: recipient.position.x - 60,
                y: recipient.position.y,
                duration: 0.1,
                onComplete: () => {
                    this.health -= attack.damage;
                    gsap.to("#EnemyHP", {
                        width: this.health + '%',
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