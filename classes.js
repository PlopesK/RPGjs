class Sprite {
    constructor({position, image, frames = { max: 1}, velocity}) {
        this.position = position
        this.image = image
        this.frames = frames
        this.velocity = velocity

        this.image.onload = () => {
            this.width = this.image.width / this.frames.max;
            this.height = this.image.height;
        }
    }

    draw () {
        cont.drawImage(
            this.image, 
            0,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height,
        ); //Image, Crop X, Crop Y, Crop Width, Crop Height, 
          // Image X, Image Y, Image Width, Image Height
    }
}

class Boundary {
    static width = 48;
    static height = 48;

    constructor ({position}) {
        this.position = position;
        this.width = Boundary.width;
        this.height = Boundary.height;
    }

    draw() {
        cont.fillStyle = "rgba(255, 0, 0, 0)";
        cont.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}