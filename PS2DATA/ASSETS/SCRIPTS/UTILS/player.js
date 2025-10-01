export class Player {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.dx = 0;
        this.dy = 0;
        this.speed = 350;
        this.jumpCount = 0;
        this.onGround = true;
        this.direction = "right";
        this.state = "idle";
        this.previousState = "idle";
        this.hitX = 0;
        this.hitY = 0;
        this.animationSystem = new AnimationSystem();
        this.pad = null;
        this.groundY = 350;
        this.init();
    }

    init() {
        try {
            this.pad = Pads.get(0);
            this.loadAnimations();
        } catch (error) {
            console.log(`erro ao iniciar player: ${error.message}`);
        }
    }

    loadAnimations() {
        const idleFrames = [];
        for (let i = 0; i <= 6; i++) {
            const frame = new ImageManager(`PS2DATA/ASSETS/SPRITES/kratos/IDLE/${i}.png`);
            idleFrames.push(frame);
        }
        this.animationSystem.addAnimation("idle", idleFrames, 80, true);

        const runFrames = [];
        for (let i = 1; i <= 9; i++) {
            const frame = new ImageManager(`PS2DATA/ASSETS/SPRITES/kratos/RUN/${i}.png`);
            runFrames.push(frame);
        }
        this.animationSystem.addAnimation("run", runFrames, 60, true);

        const jumpFrames = [];
        for (let i = 1; i <= 8; i++) {
            const frame = new ImageManager(`PS2DATA/ASSETS/SPRITES/kratos/JUMP/${i}.png`);
            jumpFrames.push(frame);
        }
        this.animationSystem.addAnimation("jump", jumpFrames, 40, false);

        const fallenFrames = [];
        for (let i = 1; i <= 1; i++) {
            const frame = new ImageManager(`PS2DATA/ASSETS/SPRITES/kratos/FALL/${i}.png`);
            fallenFrames.push(frame);
        }
        this.animationSystem.addAnimation("fallen", fallenFrames, 0, false);

        const blockFrames = [];
        for (let i = 0; i <= 0; i++) {
            const frame = new ImageManager(`PS2DATA/ASSETS/SPRITES/kratos/DEFEND/${i}.png`);
            blockFrames.push(frame);
        }
        this.animationSystem.addAnimation("block", blockFrames, 0, false);

        const medusaFrames = [];
        for (let i = 0; i <= 3; i++) {
            const frame = new ImageManager(`PS2DATA/ASSETS/SPRITES/kratos/MEDUSA/${i}.png`);
            medusaFrames.push(frame);
        }
        this.animationSystem.addAnimation("medusa", medusaFrames, 80, true);

        const attackFrames = [];
        for (let i = 4; i <= 10; i++) {
            const frame = new ImageManager(`PS2DATA/ASSETS/SPRITES/kratos/ATTACK/${i}.png`);
            attackFrames.push(frame);
        }
        this.animationSystem.addAnimation("attack", attackFrames, 80, false);

        this.animationSystem.playAnimation("idle");
        console.log("animações carregadas");
    } 

    update(deltaTime, game) {
        try {
            this.handleInput(deltaTime, game);
            this.updatePhysics(deltaTime, game);
            this.updateState(game);
            this.animationSystem.update();
        } catch (error) {
            console.log(`erro no update do player: ${error.message}`);
        }
    }

    handleInput(deltaTime, game) {
        if (!this.pad) return;

        const { jumpPower, forwardImpulse, keys } = game;

        if (keys.right && this.state !== "fallen") {
            this.dx = this.speed;
            this.direction = "right";
        } else if (keys.left && this.state !== "fallen") {
            this.dx = -this.speed;
            this.direction = "left";
        } else if (this.onGround) {
            this.dx = 0;
        }

        if (keys.cross && this.jumpCount < 2) {
            this.dy = jumpPower;
            this.jumpCount++;
            this.onGround = false;
            this.dx = this.direction === 'right' ? forwardImpulse : -forwardImpulse;
            keys.cross = false;
            
            if (this.jumpCount == 2) {
                this.animationSystem.playAnimation("jump");
            }
        }
    }

    updatePhysics(deltaTime, game) {
        if (!this.onGround) {
            this.dy += game.gravity;
        }
        
        this.x += this.dx * (deltaTime / 1000);
        this.y += this.dy * (deltaTime / 1000);

        if (this.y >= this.groundY) {
            this.y = this.groundY;
            this.dy = 0;
            this.onGround = true;
            this.jumpCount = 0;
        } else {
            this.onGround = false;
        }
    }

    updateState(game) {
        if (this.onGround && game.keys.square && this.state !== "attack") {
            this.state = "attack";
            this.animationSystem.playAnimation("attack");
        }

        if (this.state === "attack") {
            if (this.animationSystem.isAnimationComplete()) {
                this.state = "idle";
            }
            return;
        }

        if (this.onGround) {
            const { l1, l2, left, right } = game.keys;

            if (l1) {
                this.state = "block";
            } else if (l2) {
                this.state = "medusa";
            } else if (left || right) {
                this.state = "run";
            } else {
                this.state = "idle";
            }
        } else {
            if (this.dy > 0) {
                if (this.state !== "fallen") {
                    this.state = "fallen";
                }
            } else {
                if (this.state !== "jump") {
                    this.state = "jump";
                    this.animationSystem.playAnimation("jump");
                }
            }
        }

        if (this.state !== this.previousState) {
            this.changeAnimation();
        }

        this.previousState = this.state;
    }

    changeAnimation() {
        this.animationSystem.playAnimation(this.state);
    }

    render(camera) {
        try {
            const currentFrame = this.animationSystem.getCurrentFrame();
            
            if (!currentFrame || !currentFrame.loaded) return;

            const screenX = this.x - camera.x;
            const screenY = this.y - camera.y;

            currentFrame.width = this.width;
            currentFrame.height = this.height;

            const directionValue = this.direction === "right" ? 1 : -1;
            this.animationSystem.draw(screenX, screenY, directionValue);
        } catch (error) {
            console.log(`erro no render do player: ${error.message}`);
        }
    }

    drawRect(camera, color) {
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        Draw.rect(screenX, screenY, this.width, this.height, color);
    }

    getHitbox() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    cleanup() {
        this.pad = null;
    }
}