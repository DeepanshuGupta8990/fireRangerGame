export class CollisionAnimation{
    constructor(game,x,y,enemyWidth,enemyHeight){
       this.game = game;
       this.x = x;
       this.y = y;
       this.enemyWidth = enemyWidth;
       this.enemyHeight = enemyHeight;
       this.image = document.getElementById("explode");
       this.frameX = 0;
       this.frameY = Math.floor(Math.random()*3);
       this.maxFrame = 20;
       this.explosiveWidth = 300;
       this.explosiveHeight = 302;
       this.width = this.enemyWidth;
       this.height = this.enemyWidth+1;
       this.markedForDeletion = false;
       this.framTimer = 0;
       this.fps = 10;
       this.frameInterval = 1000/this.fps
       this.audio1 = new Audio();
       this.audio1.src = "./animations1/explosion.mp3"

    }
    update(deltaTime){
        this.x -= this.game.speed
        if(this.framTimer > this.frameInterval){
        if(this.frameX >= this.maxFrame){this.markedForDeletion = true}
        else{this.frameX++;}
        }else{
            this.framTimer += deltaTime
        }
    }
    draw(ctx){
        ctx.drawImage(this.image,this.frameX*this.explosiveWidth,this.frameY*this.explosiveHeight,this.explosiveWidth,this.explosiveHeight,this.x,this.y,this.width,this.height)
        this.audio1.play();
        
    }
}
export class CollisionAnimation1{
    constructor(game,x,y,enemyWidth,enemyHeight){
       this.game = game;
       this.x = x;
       this.y = y;
       this.enemyWidth = enemyWidth;
       this.enemyHeight = enemyHeight;
       this.image = document.getElementById("boom");
       this.frameX = 0;
       this.maxFrame = 4;
       this.explosiveWidth = 200;
       this.explosiveHeight = 179;
       this.width = this.enemyWidth;
       this.height = this.enemyWidth+1;
       this.markedForDeletion = false;
       this.framTimer = 0;
       this.fps = 10
       this.frameInterval = 1000/this.fps
       this.audio2 = new Audio();
       this.audio2.src = "./animations1/boom.mp3"
    }
    update(deltaTime){
        this.x -= this.game.speed
        if(this.framTimer > this.frameInterval){
        if(this.frameX >= this.maxFrame){this.markedForDeletion = true}
        else{this.frameX++;}
        }else{
            this.framTimer += deltaTime
        }
        if(this.audio2.currentTime === 0.6){this.audio2.pause()}
    }
    draw(ctx){
        ctx.drawImage(this.image,this.frameX*this.explosiveWidth,0,this.explosiveWidth,this.explosiveHeight,this.x,this.y,this.width,this.height)
        this.audio2.play();
    }
}