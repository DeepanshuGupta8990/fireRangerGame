class Particles{
    constructor(game){
         this.game = game;
         this.markedForDeletion = false;
    }
    update(){
        this.x -= this.speedX+this.game.speed;
        this.y -= this.speedY;
        this.size -= 0.45;
        if(this.size<0.5){this.markedForDeletion = true;}

    }
    draw(){

    }
}

export class Dust extends Particles{
    constructor(game,x,y){
        super(game);
       this.size = Math.random()*10+10;
       this.x = x;
       this.y = y;
       this.speedX = Math.random();
       this.speedY = Math.random();
        this.color = 'rgba(255,255,255,0.2)';
        this.name = 'dust';
    }
    draw(ctx){
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
        ctx.fill();
    }
}

export class Splash extends Particles{
    constructor(game,x,y){
        super(game);
        this.size = Math.random()*100+200;
        this.x = x - this.size*0.4;
        this.y = y - this.size*0.5;
        this.speedX = Math.random()*18-9;
        this.speedY = Math.random()*2+1;
        this.gravity = 0;
        this.image = document.getElementById("fire")
        this.name = 'splash';
    }
    update(){
        this.x -= this.speedX+this.game.speed;
        this.y -= this.speedY;
        this.size -= 6;
        if(this.size<100){this.markedForDeletion = true;}
        this.gravity += 0.4;
        this.y += this.gravity;
        if(this.y > this.game.height - this.game.groundMargin){
            this.y = this.game.height - this.game.groundMargin;
        }
      
    }
    draw(ctx){
        ctx.drawImage(this.image,this.x,this.y,this.size,this.size)
    }
}

export class Fire extends Particles{
    constructor(game,x,y){
        super(game);
        this.image = document.getElementById("fire")
        this.size = Math.random() * 100 + 50;
        this.x = x+10;
        this.y = y;
        this.speedX = 1;
        this.speedY = 1;
        this.angle = 0;
        this.va = Math.random()*0.2-0.1
        this.name = 'fire';
    }
    update(){
        this.x -= this.speedX+this.game.speed;
        this.y -= this.speedY;
        this.size -= 2;
        if(this.size<0.5){this.markedForDeletion = true;}
        this.angle += this.va;
        this.x += Math.sin(this.angle*5)
    }
    draw(ctx){
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.rotate(this.angle);
        ctx.globalAlpha = 0.7
        ctx.drawImage(this.image,-this.size*0.5,-this.size*0.5,this.size,this.size)
        ctx.restore();

    }
}