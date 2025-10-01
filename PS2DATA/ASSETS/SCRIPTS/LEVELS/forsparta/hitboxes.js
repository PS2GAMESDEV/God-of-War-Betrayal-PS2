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

export const hitboxes = [
    new Hitbox(0, 0, 2, 448),
    new Hitbox(0, 394, 1940, 50),
    new Hitbox(1940, 306, 742, 342),
    new Hitbox(2422, 262, 45, 44),
    new Hitbox(2682, 540, 356, 44),
    new Hitbox(3038, 306, 566, 350),
    new Hitbox(3604, 394, 934, 54),
    new Hitbox(4544, 308, 294, 40),

    
];
