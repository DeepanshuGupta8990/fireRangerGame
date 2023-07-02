/**@type {HTMLCanvasElement}*/
import { Player } from "./player.js";
import { Input } from "./input.js";
import { Background } from "./background.js";
import { FlyingEnemy, ClimbingEnemy, GroundEnemy, BeeEnemy } from "./enemies.js";
import { UI } from "./ui.js";
window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext('2d');
  canvas.width = 1500;
  canvas.height = 500;
  let btn1 = document.getElementById("btn1");
  let gameStart = false;

  class Game {
    constructor(gameWidth, gameHeight) {
      this.width = gameWidth;
      this.height = gameHeight;
      this.groundMargin = 80;
      this.speed = 0;
      this.maxSpeed = 3;
      this.debug = false;
      this.background = new Background(this);
      this.player = new Player(this);
      this.input = new Input(this);
      this.enemies = [];
      this.particles = [];
      this.maxParticles = 200;
      this.enemyTimer = 0;
      this.enemyInterval = 1000;
      this.score = 0;
      this.fontColor = 'black';
      this.ui = new UI(this);
      this.player.currentState = this.player.states[0];
      this.player.currentState.enter();
      this.explosions = [];
      this.audioTheme = new Audio();
      this.audioTheme.src = './animations1/theme.mp3'
    }
    update(deltaTime) {
      this.background.update();
      this.player.update(this.input.keys, deltaTime);
      if (this.enemyTimer > this.enemyInterval) {
        this.addEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += deltaTime
      }
      this.enemies = this.enemies.filter((enemy) => {
        return (!enemy.markedForDeletion);
      })
      this.enemies.forEach((enemy) => {
        enemy.update(deltaTime);
      })
      //handle particles
      this.particles.forEach((particle, index) => {
        particle.update();
        if (particle.markedForDeletion) { this.particles.splice(index, 1) }
      })
      if (this.particles.length > this.maxParticles) {
        this.particles = this.particles.slice(this.maxParticles)
      }
      //handle explosions
      this.explosions.forEach((explosion, index) => {
        explosion.update(deltaTime);
        if (explosion.markedForDeletion) {
          this.explosions.splice(index, 1)
        }
      })



    }
    draw(ctx) {
      this.background.draw(ctx)
      this.player.draw(ctx);
      this.enemies.forEach((enemy) => {
        enemy.draw(ctx);
      })
      this.particles.forEach((particle) => {
        particle.draw(ctx);
      })
      this.ui.draw(ctx);
      this.explosions.forEach((explosion) => {
        explosion.draw(ctx);
      })


    }
    addEnemy() {
      if (this.speed > 0 && Math.random() < 0.5) {
        this.enemies.push(new GroundEnemy(this))
      } else if (this.speed > 0) { this.enemies.push(new ClimbingEnemy(this)) }
      if(Math.random() < 0.5){
        this.enemies.push(new FlyingEnemy(this))
      }else{
        this.enemies.push(new BeeEnemy(this))
      }

    }
  }

  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  const game = new Game(canvas.width, canvas.height);

  const highVolumeSource = audioContext.createMediaElementSource(game.audioTheme);
  const highVolumeGain = audioContext.createGain();
  highVolumeGain.gain.value = 0.5; // Set the volume level (1 is the maximum)

  //Button play-pause
  btn1.addEventListener("click", () => {
 play()
  })

  window.addEventListener("keypress",(e)=>{
       if(e.key === ' '){
        play();
       }
  })
 
  function play(){
    
    gameStart = !gameStart;
    btn1.innerHTML = gameStart ? "Pause" : "Play";
     
    if (gameStart) {
      highVolumeSource.connect(highVolumeGain);
      highVolumeGain.connect(audioContext.destination);

      game.audioTheme.play();
      btn1.style.transform = 'translate(0,0)'
      btn1.style.left = '20px';
      btn1.style.top = '20px';
    }
    else {
      game.audioTheme.pause();
      highVolumeSource.disconnect();
      highVolumeGain.disconnect();
      btn1.style.transform = 'translate(-50%,-50%)'
      btn1.style.left = '50%';
      btn1.style.top = '50%';
    }
  }


  game.audioTheme.addEventListener('ended', function () {
    game.audioTheme.currentTime = 0;
    game.audioTheme.play();
  });

  let lastTime = 0;
  function animate(timeStamp) {
    let deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    
    if (gameStart) {
      if(game.audioTheme.currentTime<1){
        game.audioTheme.play()
   }
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      game.draw(ctx);
      game.update(deltaTime);
    }
    requestAnimationFrame(animate);
  }
  animate(0);

})