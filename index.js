/**@type {HTMLCanvasElement}*/
import { Player } from "./player.js";
import { Input } from "./input.js";
import { Background } from "./background.js";
import { FlyingEnemy, ClimbingEnemy, GroundEnemy, BeeEnemy, Bird } from "./enemies.js";
import { UI } from "./ui.js";
window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext('2d');
  const canvas2 = document.getElementById("canvas1");
  const ctx2 = canvas.getContext('2d');
  const CW = canvas2.width = 1500;
  const CH = canvas2.height = 500;
  canvas.width = 1500;
  canvas.height = 500;
  let btn1 = document.getElementById("btn1");
  let gameStart = false;
  let start = 0;

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
      this.effect = new Effect(CW, CH, canvas, ctx);
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
      this.pixelEffect = true;

    }
    update(deltaTime) {
      this.background.update();
      if (!this.pixelEffect) {
        this.player.update(this.input.keys, deltaTime);
      }
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
      if (!this.pixelEffect) {
        this.player.draw(ctx);
      }
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
      let r2 = Math.random();
      if (r2 < 0.5) {
        this.enemies.push(new FlyingEnemy(this))
      } else if (r2 < 0.75) {
        this.enemies.push(new Bird(this))
      } else {
        this.enemies.push(new BeeEnemy(this))
      }

    }
  }

    //pixel animations
    class Particle1 {
      constructor(effect, x, y, color) {
        this.effect = effect;
        this.x = Math.random() * this.effect.width;
        this.y = Math.random() * this.effect.height;
        this.originX = Math.floor(x) + 100;
        this.originY = Math.floor(y) + canvas.height - 91 - 80;
        this.color = color;
        this.size = this.effect.gap;
        this.vx = 0;
        this.vy = 0;
        this.ease = 0.06;
        this.force = 0;
        this.angle = 0
      }
      draw(ctx) {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.size, this.size);
      }
      update() {
        this.x += (this.originX - this.x) * this.ease;
        this.y += (this.originY - this.y) * this.ease;
      }
      wrap(){
        this.x = Math.random() * this.effect.width;
        this.y = Math.random() * this.effect.height;
    }
    }
  
    class Effect {
      constructor(width, height, canvas) {
        this.width = width;
        this.height = height;
        this.particles = [];
        this.image = document.getElementById('dog1')
        this.gap = 1;
  
  
      }
      init(ctx) {
        ctx.drawImage(this.image, 0, 0)
        const pixels = ctx.getImageData(0, 0, this.width, this.height);
        ctx.clearRect(0,0,this.width,this.height)
        const pixelsData = pixels.data;
        for (let y = 0; y < this.height; y += this.gap) {
          for (let x = 0; x < this.width; x += this.gap) {
            const index = (y * this.width + x) * 4;
            const redVal = pixelsData[index];
            const greenVal = pixelsData[index + 1];
            const blueVal = pixelsData[index + 2];
            const alpha = pixelsData[index + 3];
            const color = `rgb(${redVal},${greenVal},${blueVal})`;
            if (alpha > 0) {
              this.particles.push(new Particle1(this, x, y, color));
            }
          }
        }
      }
      draw(ctx) {
        this.particles.forEach((particle) => {
          particle.draw(ctx);
        })
      }
      update() {
        this.particles.forEach((particle) => {
          particle.update();
        })
      }
      wrap(){
        this.particles.forEach((particle)=>{
            particle.wrap();
        })
    }
    }

  const game = new Game(canvas.width, canvas.height);

  //Button play-pause
  btn1.addEventListener("click", () => {
    play()
  })
  window.addEventListener("keyup", (e) => {
    if (e.key === ' ') {
      play();
    }
  })
  let audioTheme;
  let highVolumeSource;
  let highVolumeGain;
  let audioContext;
  function play() {

    setTimeout(() => {
      game.pixelEffect = false;
    }, 3000)

    if (start === 0) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioTheme = new Audio();
      audioTheme.src = './animations1/theme.mp3'
      highVolumeSource = audioContext.createMediaElementSource(audioTheme);
      highVolumeGain = audioContext.createGain();
      highVolumeGain.gain.value = 0.5; // Set the volume level (1 is the maximum)

      audioTheme.addEventListener('ended', function () {
        audioTheme.currentTime = 0;
        audioTheme.play();
      });
      start = 1;
    }
    gameStart = !gameStart;
    btn1.innerHTML = gameStart ? "Pause" : "Play";

    if (gameStart) {
      highVolumeSource.connect(highVolumeGain);
      highVolumeGain.connect(audioContext.destination);

      audioTheme.play();
      btn1.style.transform = 'translate(0,0)'
      btn1.style.left = '20px';
      btn1.style.top = '20px';
    }
    else {
      audioTheme.pause();
      highVolumeSource.disconnect();
      highVolumeGain.disconnect();
      btn1.style.transform = 'translate(-50%,-50%)'
      btn1.style.left = '50%';
      btn1.style.top = '50%';
    }
  }


  function rotateScreen() {
    // Get the root element of the document
    var root = document.documentElement;

    // Apply CSS transform to rotate the screen
    root.style.transform = "rotate(90deg)";

    // Set the width and height to match the rotated dimensions
    root.style.width = "100vh";
    root.style.height = "100vw";

    // Fix the position of the screen
    root.style.position = "fixed";
    root.style.top = "0";
    root.style.left = "0";
    root.style.right = "0";
    root.style.bottom = "0";
    root.style.margin = "auto";
  }

  function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
  }

  if (isMobileDevice()) {
    // Rotate the screen for mobile devices
    rotateScreen();
  } else {
    // Display a message or take alternative action for non-mobile devices
    console.log("This feature is only available on mobile devices.");
  }



  game.effect.init(ctx);


  let lastTime = 0;
  function animate(timeStamp) {
    let deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    if (gameStart) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      game.draw(ctx);
      game.update(deltaTime);
      if (game.pixelEffect) {
        game.effect.update();
        game.effect.draw(ctx);
      }
    }
    // ctx2.clearRect(0,0,CW,CH);

    requestAnimationFrame(animate);
  }
  animate(0);


  //buttons 
  let upBtn = document.getElementById('upBtn')
  upBtn.addEventListener("touchstart",()=>{
    if(game.input.keys.indexOf("ArrowUp")===-1){
      game.input.keys.push("ArrowUp")
    }
  })
  upBtn.addEventListener("touchend",()=>{
    if(game.input.keys.indexOf("ArrowUp")!==-1){
    game.input.keys.splice(game.input.keys.indexOf('ArrowUp'),1)
    }
  })
})




