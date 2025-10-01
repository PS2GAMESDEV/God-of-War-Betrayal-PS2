export class AnimationSystem {
    constructor() {
        this.animations = {};
        this.currentAnimation = null;
        this.currentFrame = 0;
        this.frameTimer = 0;
        this.animationSpeed = 100;
    }

    addAnimation(name, frames, speed = 100, loop = true) {
        this.animations[name] = {
            frames: frames,
            speed: speed,
            loop: loop,
            frameCount: frames.length
        };
    }

    playAnimation(name) {
        if (this.currentAnimation !== name) {
            this.currentAnimation = name;
            this.currentFrame = 0;
            this.frameTimer = 0;
        }
    }

    update() {
        if (!this.currentAnimation || !this.animations[this.currentAnimation]) return;

        const animation = this.animations[this.currentAnimation];
        
        if (animation.speed === 0) return;
        
        this.frameTimer += 16;

        if (this.frameTimer >= animation.speed) {
            this.frameTimer = 0;
            this.currentFrame++;

            if (this.currentFrame >= animation.frameCount) {
                if (animation.loop) {
                    this.currentFrame = 0;
                } else {
                    this.currentFrame = animation.frameCount - 1;
                }
            }
        }
    }

    getCurrentFrame() {
        if (!this.currentAnimation || !this.animations[this.currentAnimation]) return null;

        const animation = this.animations[this.currentAnimation];
        return animation.frames[this.currentFrame];
    }

    draw(x, y, direction) {
        const frame = this.getCurrentFrame();
        
        if (!frame || !frame.loaded) return;

        const originalWidth = frame.width;
        const originalHeight = frame.height;

        frame.startx = 0;
        frame.starty = 0;
        frame.endx = frame.texWidth;
        frame.endy = frame.texHeight;

        if (direction < 0) {
            frame.width = -Math.abs(originalWidth);
            frame.height = Math.abs(originalHeight);
            frame.draw(x + Math.abs(originalWidth), y);
        } else {
            frame.width = Math.abs(originalWidth);
            frame.height = Math.abs(originalHeight);
            frame.draw(x, y);
        }
    }

    isAnimationComplete() {
        if (!this.currentAnimation || !this.animations[this.currentAnimation]) return true;

        const animation = this.animations[this.currentAnimation];
        return !animation.loop && this.currentFrame >= animation.frameCount - 1;
    }
}