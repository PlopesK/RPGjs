class Sprite {
    constructor({
        position,
        image,
        frames = { max: 1, hold: 10 },
        sprites,
        animation = false,
        scale = 1,
        rotation = 0,
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
        this.rotation = rotation;
    }

    draw() {
        cont.save() //Using 'Save' and 'Restore' makes the Global property affect 
        // only the code whitin it
        cont.translate(
            this.position.x + this.width / 2,
            this.position.y + this.height / 2
        ) //Get the Attacker position
        cont.rotate(this.rotation)
        cont.translate(
            -this.position.x - this.width / 2,
            -this.position.y - this.height / 2
        ) //Return to the point 0 of screen
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
}

class Monster extends Sprite {
    constructor({
        position,
        image,
        frames = { max: 1, hold: 10 },
        sprites,
        animation = false,
        scale = 1,
        rotation = 0,
        health = { max: 100, current: 100 }, //From this line to line 77 are things 
        isEnemy = false,                     // set only on 'Monster'
        name,
        stats = { atk: 0, def: 0, spd: 0 },
        types,
        monsterAttacks,
        defending = false,
        attackUp = false,
    }) {
        super({ //Things that are extensions from 'Sprite'
            position,
            image,
            frames,
            sprites,
            animation,
            scale,
            rotation,
        })
        this.health = health;
        this.isEnemy = isEnemy;
        this.name = name;
        this.stats = stats;
        this.types = types;
        this.monsterAttacks = monsterAttacks;
        this.defending = defending
        this.attackUp = attackUp
    }

    faint() {
        audio.battle.stop()
        audio.faint.play()
        menus.dialogueBox.innerHTML = `${this.name} fainted!`
        gsap.to(this.position, {
            y: this.position.y + 20
        })
        gsap.to(this, {
            opacity: 0,
        })
    } 

    run() {
        if (Math.random() < 0.7) {
            menus.dialogueBox.innerHTML = "You escaped the battle!"
            queue.push(() => {
                endBattle()
            })
            return
        } else {
            menus.dialogueBox.innerHTML = "You tried to run but couldn't escape!"
            queue.push(() => {
                enemyAttack();
            });
        }
    }

    item({ item, recipient }) {
        menus.dialogueBox.innerHTML = `${this.name} used ${item.name}`

        let healthBar = '#PlayerHP'
        if (this.isEnemy) {
            healthBar = '#EnemyHP'
        }

        if (item.type == 'Healing') {
            recipient.health.current += item.effect;
            if (recipient.health.current > 99) recipient.health.current = 100;
            if (recipient.health.current >= 30) {
                gsap.killTweensOf(healthBar);
    
                gsap.to(healthBar, {
                    repeat: 0,
                    opacity: 1,
                    yoyo: false,
                    duration: 0.01,
                })
            }
            audio.healing.play();

            const healImg = new Image()
            healImg.src = './assets/img/Battle/HealEffect.png'
            const heal = new Sprite({
                position: {
                    x: this.position.x - 40,
                    y: this.position.y - 20
                },
                image: healImg,
                frames: {
                    max: 4,
                    hold: 10
                },
                animation: true,
                scale: 2,
            })

            //renderedSprites.push(heal)
            renderedSprites.push(heal)

            gsap.to(heal, {
                yoyo: true,
                repeat: 3,
                onComplete: () => {
                    renderedSprites.pop()
                }
            })

        }
        updateHP(recipient, healthBar)
    }

    attack({ attack, recipient, renderedSprites }) {
        menus.dialogueBox.innerHTML = `${this.name} used ${attack.name}`

        let healthBar = '#EnemyHP'
        let rotation = 1
        let target = recipient.position.y
        let firer = this.position.y + 80
        let hitting = recipient.position.y
        let fireHittingX = recipient.position.x
        if (this.isEnemy) {
            healthBar = '#PlayerHP'
            rotation = -2.5
            target = recipient.position.y + 100
            firer = this.position.y + 50
            hitting = recipient.position.y + 50
            fireHittingX = recipient.position.x + 30
        }

        switch (attack.name) {
        // Tackle Anim //
            case 'Tackle':
                const tl = gsap.timeline()

                let movementDistance = 20
                if (this.isEnemy) movementDistance = -20

                tl.to(this.position, {
                    x: this.position.x - movementDistance,
                    y: this.position.y
                }).to(this.position, {
                    x: recipient.position.x - movementDistance * 2,
                    y: recipient.position.y,
                    duration: 0.1,
                    onComplete: () => {
                        audio.tackleHit.play()
                        takeHitAnim(recipient, healthBar)
                        const hitImg = new Image()
                        hitImg.src = './assets/img/Battle/HitEffect.png'
                        const hit = new Sprite({
                            position: {
                                x: recipient.position.x + 20,
                                y: hitting
                            },
                            image: hitImg,
                            frames: {
                                max: 4,
                                hold: 10
                            },
                            animation: true,
                            scale: 4,
                        })
        
                        renderedSprites.push(hit)
                        gsap.to(hit, {
                            yoyo: true,
                            repeat: 0,
                            duration: 0.3,
                            onComplete: () => {
                                renderedSprites.pop()
                            }
                        })
                    }
                }).to(this.position, {
                    x: this.position.x,
                    y: this.position.y
                });
                break;

        // Fireball Anim //
            case 'Fireball':
                audio.initFireball.play()
                const fireballImg = new Image()
                fireballImg.src = './assets/img/Battle/fireball.png'
                const fireball = new Sprite({
                    position: {
                        x: this.position.x + 10,
                        y: firer
                    },
                    image: fireballImg,
                    frames: {
                        max: 4,
                        hold: 10
                    },
                    animation: true,
                    scale: 1.2,
                    rotation: rotation,
                })

                //renderedSprites.push(fireball)
                renderedSprites.splice(1, 0, fireball)

                gsap.to(fireball.position, {
                    x: recipient.position.x,
                    y: target,
                    onComplete: () => {
                        renderedSprites.splice(1, 1),
                        audio.fireballHit.play()
                        takeHitAnim(recipient, healthBar)

                        const fireHitImg = new Image()
                        fireHitImg.src = './assets/img/Battle/FireHit.png'
                        const fireHit = new Sprite({
                            position: {
                                x: fireHittingX + 20,
                                y: hitting + 20
                            },
                            image: fireHitImg,
                            frames: {
                                max: 5,
                                hold: 10
                            },
                            animation: true,
                            scale: 2,
                        })
        
                        //renderedSprites.push(heal)
                        renderedSprites.push(fireHit)
                        gsap.to(fireHit, {
                            yoyo: true,
                            repeat: 1,
                            duration: 0.3,
                            onComplete: () => {
                                renderedSprites.pop()
                            }
                        })
                    }
                })
                break;
        // FireDance Anim //
            case 'Firedance':
                const fireDanceImg = new Image()
                fireDanceImg.src = './assets/img/Battle/fireDance.png'
                const fireDance = new Sprite({
                    position: {
                        x: this.position.x - 10,
                        y: this.position.y
                    },
                    image: fireDanceImg,
                    frames: {
                        max: 5,
                        hold: 10
                    },
                    animation: true,
                    scale: 3,
                })

                renderedSprites.push(fireDance)
                audio.fireDance.play()
                gsap.to(this.position, {
                    x: this.position.x + 60,
                    yoyo: true,
                    repeat: 5,
                    duration: 0.12,
                });
                
                gsap.to(fireDance, {
                    repeat: 3,
                    yoyo: true,
                    duration: 0.3,
                    onComplete: () => {
                        renderedSprites.pop()
                        this.attackUp = true;
                    }
                })
                break;

        // Defense UP Anim //
            case 'Defense':
                const DefenseImg = new Image()
                DefenseImg.src = './assets/img/Battle/Defense.png'
                const defense = new Sprite({
                    position: {
                        x: this.position.x - this.width - 20,
                        y: this.position.y - this.height
                    },
                    image: DefenseImg,
                    frames: {
                        max: 6,
                        hold: 10
                    },
                    animation: true,
                    scale: 3,
                })

                renderedSprites.push(defense)
                audio.defense.play()
                gsap.to(defense, {
                    opacity: 0,
                    repeat: 3,
                    yoyo: true,
                    duration: 0.3,
                    onComplete: () => {
                        renderedSprites.pop()
                        this.defending = true;
                    }
                })
                break;
        }

        const baseDamage = attack.damage;
        let finalDamage = baseDamage;

        if (this.attackUp) {
            finalDamage = baseDamage * 2.2;
            this.attackUp = false;
        }

        if (recipient.defending) {
            recipient.health.current -= finalDamage / 2;
            recipient.defending = false;
        }

        recipient.health.current -= Math.floor(finalDamage);
        if (recipient.health.current < 0) recipient.health.current = 0;
    }
}

const colors = {
    normal: ["#23F723", "forestgreen"],
    warning: ["#F7EF23", "goldenrod"],
    critical: ["#F72323", "firebrick"]
};
const hpReset = document.querySelectorAll(".HP");
function resetHpAnim() {
    // Cancel criticalHp animation on reset
    hpReset.forEach((hpBar) => {
        gsap.killTweensOf(hpBar);
        gsap.to(hpBar, {
            "--HP-Light": colors.normal[0],
            "--HP-Dark": colors.normal[1],
            repeat: 0,
            opacity: 1,
            yoyo: false,
            duration: 0.01,
            width: '100%'
        })
    });
}

function hpColor(newHP, healthBarElement) {
    if (newHP <= 50 && newHP >= 30) {
        gsap.to(healthBarElement, {
            "--HP-Light": colors.warning[0],
            "--HP-Dark": colors.warning[1],
        });
    } else if (newHP <= 29) {
        gsap.to(healthBarElement, {
            "--HP-Light": colors.critical[0],
            "--HP-Dark": colors.critical[1],
            repeat: -1, // infinite
            opacity: 0.8,
            yoyo: true,
        });
    } else {
        gsap.to(healthBarElement, {
            "--HP-Light": colors.normal[0],
            "--HP-Dark": colors.normal[1],
            repeat: 0,
            opacity: 1,
            yoyo: false,
            duration: 0.01
        });
    }
}

function updateHP(recipient, healthBarElement) {
    const newHP = (recipient.health.current / recipient.health.max) * 100;

    gsap.to(healthBarElement, {
        width: newHP + '%',
        onComplete: () => {
            hpColor(newHP, healthBarElement)
        }
    });
}

// Hit animation function //
function takeHitAnim(recipient, healthBarElement) {
    updateHP(recipient, healthBarElement);

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


