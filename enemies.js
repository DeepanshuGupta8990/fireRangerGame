class Enemy{
    constructor(){
        this.frameX = 0;
        this.frameY = 0;
        this.fps = 20;
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0;
        this.markedForDeletion = false;
    }
    update(deltaTime){
        this.x -= this.speedX + this.game.speed;

        if(this.frameTimer>this.frameInterval){
            this.frameTimer = 0 ;
            if(this.frameX < this.maxFrame){this.frameX++}
            else{this.frameX = 0;}
        }
        else{this.frameTimer += deltaTime}
        if(this.x < 0-this.width){this.markedForDeletion = true}

        if(this.name === 'bird'){
            if(this.game.player.y - this.y > 8){this.y += this.speedY}
            else if(this.game.player.y - this.y< -8){this.y -= this.speedY}
            else if(this.game.player.y - this.y <8 || this.game.player.y - this.y > -8){this.y += 0}
        }else{
            this.y += this.speedY;
        }
    }
    draw(ctx){
        if(this.game.debug)ctx.strokeRect(this.x,this.y,this.width,this.height);
        ctx.drawImage(this.image,this.frameX*this.width,this.frameY*this.height,this.width,this.height,this.x,this.y,this.width,this.height)
    }
}

export class FlyingEnemy extends Enemy{
    constructor(game){
        super();
        this.game = game;
        this.enemyWidth = 60;
        this.enemyHeight = 44;
        this.size = Math.random()*1.2+0.5;
        this.width = this.enemyWidth*this.size;
        this.height = this.enemyHeight*this.size
        this.x = this.game.width + this.width + Math.random()*this.game.width*0.5;
        this.y = Math.random()*this.game.height*0.8;
        this.speedX = Math.random()*2 + 1;
        this.speedY = Math.random()*2 - 1
        this.maxFrame = 5;
        this.image = document.getElementById("enemy_fly");
        this.angle = 0;
        this.va = Math.random()*0.1+0.1
        this.anglemodifier = Math.random()*2;
        this.name = 'flyingEnemy';
    
    }
    update(deltaTime){
        super.update(deltaTime);
        this.angle += this.va;
        this.y += Math.sin(this.angle)*this.anglemodifier;
        if(this.y > this.game.height - this.height -this.game.groundMargin){this.speedY = -this.speedY}
        else if(this.y < 0){this.speedY = -this.speedY}
    }
    draw(ctx){
        if(this.game.debug)ctx.strokeRect(this.x,this.y,this.width,this.height);
        ctx.drawImage(this.image,this.frameX*this.enemyWidth,this.frameY*this.enemyHeight,this.enemyWidth,this.enemyHeight,this.x,this.y,this.width,this.height)
    }
}
export class GroundEnemy extends Enemy{
    constructor(game){
        super(game);
        this.game = game;
        this.width = 60;
        this.height = 87;
        this.x = this.game.width;
        this.y = this.game.height - this.height -this.game.groundMargin;
        this.image = document.getElementById("enemy_ground");
        this.speedX = 0;
        this.speedY = 0;
        this.maxFrame = 1;
        this.name = 'groundEnemy';
    }
}
export class ClimbingEnemy extends Enemy{
    constructor(game){
        super(game);
        this.game = game;
        this.enemyWidth = 120;
        this.enemyHeight = 144
        this.size = Math.floor(Math.random()*2+1)
        this.width = this.enemyWidth/this.size;
        this.height = this.enemyHeight/this.size;
        this.x = this.game.width;
        this.y = Math.random()*this.game.height*0.5
        this.image = document.getElementById('enemy_climb');
        this.speedX = 0;
        this.speedY = Math.random() > 0.5? 1 : -1;
        this.maxFrame = 5;
        this.name = 'climbingEnemy';
    }
    update(deltaTime){
       super.update(deltaTime);
       if(this.y > this.game.height - this.height - this.game.groundMargin){this.speedY = -this.speedY}
      if(this.y < -this.height){this.markedForDeletion = true}
    }
    draw(ctx){
        if(this.game.debug)ctx.strokeRect(this.x,this.y,this.width/this.size,this.height/this.size);
        ctx.drawImage(this.image,this.frameX*this.enemyWidth,this.frameY*this.enemyHeight,this.enemyWidth,this.enemyHeight,this.x,this.y,this.width,this.height)
       ctx.beginPath();
       ctx.moveTo(this.x+this.width/2,0);
       ctx.lineTo(this.x+this.width/2,this.y+this.height/3)
       ctx.stroke()
    }
   
}

export class BeeEnemy extends Enemy{
    constructor(game){
        super();
        this.game = game;
        this.enemyWidth = 273;
        this.enemyHeight = 282;
        this.size = Math.random()*0.1+0.2;
        this.width = this.enemyWidth*this.size;
        this.height = this.enemyHeight*this.size
        this.x = this.game.width + this.width + Math.random()*this.game.width*0.5;
        this.y = Math.random()*this.game.height*0.8;
        this.speedX = Math.random()*2 + 1;
        this.speedY = Math.random()*2 - 1
        this.maxFrame = 12;
        this.angle = 0;
        this.va = Math.random()*0.1+0.1
        this.anglemodifier = Math.random()*2
        this.frame = 1;
        this.name = 'bee';
    
    }
    update(deltaTime){
        this.x -= this.speedX + this.game.speed;
        this.y += this.speedY;

            if(this.frame < this.maxFrame){this.frame++}
            else{this.frame = 1;}

        if(this.x < 0-this.width){this.markedForDeletion = true}
        this.angle += this.va;
        this.y += Math.sin(this.angle)*this.anglemodifier;
        if(this.y > this.game.height - this.height -this.game.groundMargin){this.speedY = -this.speedY}
        else if(this.y < 0){this.speedY = -this.speedY}
    }
    draw(ctx){
        if(this.game.debug)ctx.strokeRect(this.x,this.y,this.width,this.height);
        // ctx.drawImage(this.image,this.frameX*this.enemyWidth,this.frameY*this.enemyHeight,this.enemyWidth,this.enemyHeight,this.x,this.y,this.width,this.height)
        ctx.drawImage(document.getElementById(this.frame),0,0,273,282,this.x,this.y,this.width,this.height)
    }
}

export class Bird extends Enemy{
    constructor(game){
        super();
        this.game = game;
        this.enemyWidth = 253;
        this.enemyHeight = 207;
        this.size = Math.random()*0.3+0.2;
        this.width = this.enemyWidth*this.size;
        this.height = this.enemyHeight*this.size
        this.x = this.game.width + this.width + Math.random()*this.game.width*0.5;
        this.y = Math.random()*this.game.height*0.8;
        this.speedX = Math.random()*4 + 1;
        this.speedY = Math.random()*5
        this.speedY1 = this.speedY;
        this.maxFrame = 13;
        this.image = document.getElementById("bird");
        this.angle = 0;
        this.va = Math.random()*0.1+0.1
        this.anglemodifier = Math.random()*2;
        this.name = 'bird';
    
    }
    update(deltaTime){
        super.update(deltaTime);
        this.angle += this.va;
        this.y += Math.sin(this.angle)*this.anglemodifier;
        if(this.y > this.game.height - this.height -this.game.groundMargin){this.speedY = -this.speedY}
        else if(this.y < 0){this.speedY = -this.speedY}
    }
    draw(ctx){
        if(this.game.debug)ctx.strokeRect(this.x,this.y,this.width,this.height);
        ctx.drawImage(this.image,this.frameX*this.enemyWidth,this.frameY*this.enemyHeight,this.enemyWidth,this.enemyHeight,this.x,this.y,this.width,this.height)
    }
}