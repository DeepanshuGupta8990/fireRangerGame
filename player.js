import { Input } from "./input.js";
import { Diving, Falling, Hit, Jumping, Rolling, Running, Sitting } from "./playerState.js";
import { CollisionAnimation, CollisionAnimation1 } from "./colliosnionAnimation.js";

export class Player {
    constructor(game) {
        this.game = game;
        this.width = 100;
        this.height = 91.3;
        this.width2 = 104;
        this.height2 = 150;
        this.x = 100;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.image = document.getElementById("playerImage")
        this.image2 = document.getElementById("fire2");
        this.frameX2 = 0;
        this.framY2 = 1;
        this.maxFrame2 = 8;
        this.frameX = 0;
        this.frameY = 0;
        this.fireframeRate = 0;
        this.maxFrame = 4;
        this.fps = 20;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
        this.speed = 0;
        this.maxSpeed = 10;
        this.vy = 0;
        this.weight = 1;
        this.states = [new Sitting(this.game), new Running(this.game), new Jumping(this.game), new Falling(this.game), new Rolling(this.game), new Diving(this.game), new Hit(this.game)];
        this.currentState = this.states[0]

    }
    update(input, deltaTime) {
        if(!this.game.pixelEffect && this.currentState !== this.states[6]){
            this.checkCollision()
        } 

        this.currentState.handleInput(input);

        //horizontol movement

        this.x += this.speed;
        if (input.includes('ArrowRight')) { this.speed = this.maxSpeed; }
        else if (input.includes('ArrowLeft')) { this.speed = -this.maxSpeed }
        else { this.speed = 0 }

        if (this.x < 0) { this.x = 0 }
        if (this.x > this.game.width - this.width) { this.x = this.game.width - this.width }

        // verticle movement
        this.y += this.vy;
        // if(input.includes('ArrowUp') && this.onGround()){this.vy = -20}
        if (!this.onGround()) {
            this.vy += this.weight
        }
        if (this.y > this.game.height - this.height - this.game.groundMargin) { this.y = this.game.height - this.height - this.game.groundMargin }


        //sprite animations
        if (this.frameTimer > this.frameInterval) {
            if (this.frameX < this.maxFrame) { this.frameX++ }
            else { this.frameX = 0 }
            this.frameTimer = 0;
        }
        else {
            this.frameTimer += deltaTime
        }

        if (this.fireframeRate % 3 === 0) {
            if (this.frameX2 >= 7) { this.frameX2 = 0 }
            else { this.frameX2++ }
        }
        this.fireframeRate++;

    }
    draw(ctx) {
        if(this.currentState === this.states[0] ){
        ctx.drawImage(this.image2, this.frameX2 * this.width2, this.framY2 * this.height2, this.width2, this.height2, this.x - this.width2/14, this.y - this.height2/2, this.width2 * 1.2, this.height2 * 1.2);
        }
        
        // console.log(this.game.debug)
        if (this.game.debug) { ctx.strokeRect(this.x, this.y, this.width, this.height) }
        ctx.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);

    }
    onGround() {
        return (this.y >= this.game.height - this.height - this.game.groundMargin)
    }
    setState(state, speed) {
        this.currentState = this.states[state];
        this.game.speed = this.game.maxSpeed * speed;
        this.currentState.enter();
        
    }
    checkCollision() {

        this.game.enemies.forEach((enemy, index) => {

            for (let i = 0; i < this.game.particles.length; i++) {
                if (this.game.particles[i].name === 'splash') {
                    if (enemy.x < this.game.particles[i].x + this.game.particles[i].size &&
                        enemy.x + enemy.width > this.game.particles[i].x &&
                        enemy.y < this.game.particles[i].y + this.game.particles[i].size &&
                        enemy.y + enemy.height > this.game.particles[i].y) {
                        enemy.markedForDeletion = true;
                        this.game.enemies.splice(index, 1);
                        this.game.explosions.push(new CollisionAnimation(this.game, enemy.x, enemy.y, enemy.width, enemy.height))
                        // console.log(this.game.explosions)
                        break;

                    }
                }
            }


            if (enemy.x < this.x + this.width &&
                enemy.x + enemy.width > this.x &&
                enemy.y < this.y + this.height &&
                enemy.y + enemy.height > this.y) {
                if (this.currentState === this.states[4] ||
                    this.currentState === this.states[5]) {
                    enemy.markedForDeletion = true;
                    this.game.score++;
                    if (enemy.name === 'bee') {
                        this.game.explosions.push(new CollisionAnimation1(this.game, enemy.x, enemy.y, enemy.width, enemy.height))
                    }
                    else if (enemy.name !== 'bee') {
                        this.game.explosions.push(new CollisionAnimation(this.game, enemy.x, enemy.y, enemy.width, enemy.height))
                    }
                } else {
                    enemy.x = enemy.x - 20;
                    this.x = this.x + 20;
                    this.setState(6, 0)
                }
            }
        });
    }
}

