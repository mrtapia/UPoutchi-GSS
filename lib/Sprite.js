export default class Sprite {
    constructor(image, size) {
        this.image = image;
        this.spriteWidth = 28;
        this.spriteHeight = 28;
        this.size = size;
        this.scale = 2;
        this.x = this.size/2 - (this.spriteWidth * this.scale/2);
        this.y = this.size/2 - (this.spriteHeight * this.scale/2);
        this.frameX = 0;
        this.frameY = 0; //[ecstatic, happy, neutral, unhappy, sad]
        this.frameIndex = 0;
        this.sequence = [0,1,2,1]; //[Sprite motion]
        this.elapsedFrame = 0;
    }

    draw(context) {
        context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y, this.size * this.scale, this.size * this.scale);
    }

    update() {
        this.elapsedFrame++;
        if (this.elapsedFrame % 15 == 0) {
            this.frameIndex++;
            if (this.frameIndex >= this.sequence.length) this.frameIndex = 0;
            this.frameX = this.sequence[this.frameIndex];
        }
    }
}