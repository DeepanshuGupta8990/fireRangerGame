import { Dust, Fire, Splash } from "./particles.js";
const state = {
    SITTING: 0,
    RUNNING: 1,
    JUMPING: 2,
    FALLING: 3,
    ROLLING: 4,
    DIVING: 5,
    HITTING: 6
}

class State {
    constructor(state, game) {
        this.state = state;
        this.game = game;
    }
}

export class Sitting extends State {
    constructor(game) {
        super('SITTING', game);
        this.game = game
    }
    enter() {
        this.game.player.frameX = 0;
        this.game.player.frameY = 5;
        this.game.player.maxFrame = 4;
    }
    handleInput(input) {
        if (input.includes("ArrowLeft") || input.includes("ArrowRight")) { this.game.player.setState(state.RUNNING, 1) }
        else if (input.includes("z")) {
            this.game.player.setState(state.ROLLING, 2.4);
        }
    }
}
export class Running extends State {
    constructor(game) {
        super('RUNNING', game);
        this.game = game

    }
    enter() {
        this.game.player.frameY = 3;
        this.game.player.frameX = 0
        this.game.player.maxFrame = 6;
    }
    handleInput(input) {
        this.game.particles.push(new Dust(this.game, this.game.player.x + this.game.player.width / 2, this.game.player.y + this.game.player.height));
        if (input.includes("ArrowDown")) { this.game.player.setState(state.SITTING, 0) }
        else if (input.includes("ArrowUp")) {
            this.game.player.setState(state.JUMPING, 1);
        } else if (input.includes("z")) {
            this.game.player.setState(state.ROLLING, 2.4);
        }
    }
}
export class Jumping extends State {
    constructor(game) {
        super('JUMPING', game);
        this.game = game;
    }
    enter() {
        if (this.game.player.onGround()) { this.game.player.vy = -25 }
        this.game.player.frameX = 0
        this.game.player.frameY = 1;
        this.game.player.maxFrame = 6;
    }
    handleInput(input) {
        if (this.game.player.vy > this.game.player.weight) {
            this.game.player.setState(state.FALLING, 1)
        } else if (input.includes("z")) {
            this.game.player.setState(state.ROLLING, 2.4);
        } else if (input.includes("ArrowDown")) {
            this.game.player.setState(state.DIVING, 0)
        }
    }
}

export class Falling extends State {
    constructor(game) {
        super('FALLING', game);
        this.game = game;
    }
    enter() {
        this.game.player.frameX = 0
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 2;
        if (this.game.player.vy === 0) { this.game.player.vy = 10 }
    }
    handleInput(input) {
        if (this.game.player.onGround()) { this.game.player.setState(state.RUNNING, 1) }
        else if (input.includes("z")) {
            this.game.player.setState(state.ROLLING, 2.4);
        } else if (input.includes("ArrowDown")) {
            this.game.player.setState(state.DIVING, 0)
        }
    }
}

let highVolumeSource1;
let highVolumeGain1;
let aa = true;

export class Rolling extends State {
    constructor(game) {
        super('ROLLING', game);
        this.game = game;
        this.audio3 = new Audio();
        this.audio3.src = './animations1/car.mp3';
    }
    enter() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        if (aa) {
            highVolumeSource1 = audioContext.createMediaElementSource(this.audio3);
            highVolumeGain1 = audioContext.createGain();
            highVolumeGain1.gain.value = 0.4; // Set the volume level (1 is the maximum)
            highVolumeSource1.connect(highVolumeGain1);
            highVolumeGain1.connect(audioContext.destination);
            aa = false
        }

        this.audio3.currentTime = 0.6;
        this.audio3.play();
        this.game.player.frameX = 0
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 6;
    }
    handleInput(input) {
        if (this.audio3.currentTime > 12) { this.audio3.currentTime = 0.6; this.audio3.play() }
        this.game.particles.push(new Fire(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height * 0.5));
        if (!input.includes('z') && this.game.player.onGround()) {
            this.audio3.pause();
            this.game.player.setState(state.RUNNING, 1);
        } else if (!input.includes('z') && !this.game.player.onGround()) {
            this.audio3.pause();
            this.game.player.setState(state.FALLING, 1);
        } else if (input.includes('z') && input.includes('ArrowUp') && this.game.player.onGround()) {
            this.game.player.vy -= 25;
        } else if (input.includes("z") && input.includes("ArrowDown") && !this.game.player.onGround()) {
            this.audio3.pause();
            this.game.player.setState(state.DIVING, 0)
        }
    }
}

export class Diving extends State {
    constructor(game) {
        super('DIVING', game);
        this.game = game;
        this.audio3 = new Audio();
        this.audio3.src = './animations1/fireFall.mp3';
    }
    enter() {
        this.audio3.currentTime = 0.6;
        this.audio3.play();
        this.game.player.frameX = 0
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 6;
        this.game.player.vy = 15
    }
    handleInput(input) {
        this.game.particles.push(new Fire(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height * 0.5));
        if (!input.includes('z') && this.game.player.onGround()) {
            this.game.player.vy = 0;
            this.game.player.setState(state.RUNNING, 1);
            for (let i = 0; i < 100; i++) {
                this.game.particles.push(new Splash(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height))
            }
        } else if (this.game.player.onGround() && input.includes("ArrowDown")) {
            this.game.player.vy = 0;
            this.game.player.setState(state.SITTING, 0)
        } else if (input.includes('z') && this.game.player.onGround()) {
            this.game.player.vy = 0;
            this.game.player.setState(state.ROLLING, 2.4);
        }
    }
}

export class Hit extends State {
    constructor(game) {
        super('HITTING', game);
        this.game = game;
        this.audio4 = new Audio();
        this.audio4.src = 'animations1/dizzy.mp3'
    }
    enter() {
        setTimeout(() => {
            this.game.pixelEffect = true;
            this.game.player.x = 100;
            this.game.player.y = this.game.height - this.game.player.height - this.game.groundMargin;
            setTimeout(() => {
                this.game.pixelEffect = false;
            }, 1500)
            this.game.effect.wrap();
        }, 600)
        this.audio4.play();
        this.game.player.frameX = 0
        this.game.player.maxFrame = 10;
        this.game.player.frameY = 4;

    }
    handleInput(input) {

        if (this.game.player.frameX >= this.game.player.maxFrame && this.game.player.onGround()) {
            this.game.player.setState(state.RUNNING, 1);
        }
        else if (this.game.player.frameX >= this.game.player.maxFrame && this.game.player.onGround()) {
            this.game.player.setState(state.FALLING, 1);
        }
        this.game.player.speed = 0
    }
}
