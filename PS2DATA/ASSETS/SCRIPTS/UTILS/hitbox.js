export default class Hitbox {
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = Color.new(255, 0, 0, 96);
    }
    draw(camera,cor) {
        Draw.rect(this.x - camera.x, this.y - camera.y, this.width, this.height, this.color);
    }
}