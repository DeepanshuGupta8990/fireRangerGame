class Layer {
    constructor(game, width, height, speedModifier, image) {
        this.game = game;
        this.width = width;
        this.height = height;
        this.speedModifier = speedModifier;
        this.image = image;
        this.x = 0;
        this.y = 0;
        this.x2 = this.width;
    }
    update() {
        if(this.speedModifier!==0){
        let sp = this.game.speed;
        let sm = this.speedModifier;
        if (this.x < -this.width) {this.x = this.width - (sm*2*sp)}
        else { this.x -= sp * sm }
        if (this.x2 < -this.width){this.x2 = this.width - (sm*2*sp)}
        else { this.x2 -= sp * sm }
        }
   
    }
    draw(ctx) {
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height)
        ctx.drawImage(this.image,this.x2,this.y,this.width,this.height)

    }
}

export class Background{
    constructor(game){
         this.game = game;
         this.width = 1667;
         this.height = 500;
         this.layer5Image = document.getElementById("layer5Image")
         this.layer4Image = document.getElementById("layer4Image")
         this.layer3Image = document.getElementById("layer3Image")
         this.layer2Image = document.getElementById("layer2Image")
         this.layer1Image = document.getElementById("layer1Image")
         this.layer9 = new Layer(this.game,this.width,this.height,0,this.layer5Image);
         this.layer1 = new Layer(this.game,this.width,this.height,3,this.layer5Image);
         this.layer2 = new Layer(this.game,this.width,this.height,0.8,this.layer4Image);
         this.layer3 = new Layer(this.game,this.width,this.height,0.4,this.layer3Image);
         this.layer4 = new Layer(this.game,this.width,this.height,0.2,this.layer2Image);
         this.layer5 = new Layer(this.game,this.width,this.height,0,this.layer1Image);
         this.backgroundLayers = [this.layer5,this.layer4,this.layer3,this.layer2,this.layer9,this.layer1];
    }
    update(){
        this.backgroundLayers.forEach((layer)=>{
            layer.update();

        })
    }
    draw(ctx){
        this.backgroundLayers.forEach((layer)=>{
            layer.draw(ctx);
        })
    }
}
// export class Background{
//     constructor(game){
//          this.game = game;
//          this.width = 3840;
//          this.height = 2160;
//          this.layer1Image = document.getElementById("b1")
//          this.layer2Image = document.getElementById("b2")
//          this.layer3Image = document.getElementById("b3")
//          this.layer4Image = document.getElementById("b4")
//          this.layer5Image = document.getElementById("b5")
//          this.layer1 = new Layer(this.game,this.width,this.height,0.3,this.layer1Image);
//          this.layer2 = new Layer(this.game,this.width,this.height,1.9,this.layer2Image);
//          this.layer3 = new Layer(this.game,this.width,this.height,2,this.layer3Image);
//          this.layer4 = new Layer(this.game,this.width,this.height,2,this.layer4Image);
//          this.layer5 = new Layer(this.game,this.width,this.height,2,this.layer5Image);
//          this.layer9 = new Layer(this.game,this.width,this.height,0,this.layer5Image);
//          this.backgroundLayers = [this.layer3,this.layer1,this.layer2,this.layer4,this.layer5];
       
//     }
//     update(){
//         this.backgroundLayers.forEach((layer)=>{
//             layer.update();

//         })
//     }
//     draw(ctx){
//         this.backgroundLayers.forEach((layer)=>{
//             layer.draw(ctx);
//         })
//     }
// }