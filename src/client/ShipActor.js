const PIXI = require("pixi.js");
const PixiParticles = require("pixi-particles");
const ThrusterEmitterConfig = require("./ThrusterEmitter.json");
const ExplosionEmitterConfig = require("./ExplosionEmitter.json");


class ShipActor{

    constructor(gameEngine, backLayer){
        this.gameEngine = gameEngine;
        this.backLayer = backLayer;
        this.sprite = new PIXI.Container();
        this.shipSprite = new PIXI.Sprite(PIXI.loader.resources["assets/ship1.png"].texture);

        //keep a reference to the actor from the sprite
        this.sprite.actor = this;


        this.shipSprite.anchor.set(0.5, 0.5);
        this.shipSprite.width = 50;
        this.shipSprite.height = 45;


        this.addThrustEmitter();
        this.sprite.addChild(this.shipSprite);
    }

    renderStep(delta){
        if (this.thrustEmitter) {
            this.thrustEmitter.update(delta * 0.001);

            this.thrustEmitter.spawnPos.x = this.sprite.x - Math.cos(-this.sprite.rotation) * 4;
            this.thrustEmitter.spawnPos.y = this.sprite.y + Math.sin(-this.sprite.rotation) * 4;

            this.thrustEmitter.minStartRotation = this.sprite.rotation * 180 / Math.PI + 180 - 1;
            this.thrustEmitter.maxStartRotation = this.sprite.rotation * 180 / Math.PI + 180 + 1;
        }
        if (this.explosionEmitter){
            this.explosionEmitter.update(delta * 0.001);
        }

    }

    addThrustEmitter(){
        this.thrustEmitter = new PIXI.particles.Emitter(
            this.backLayer,
            [PIXI.loader.resources["assets/smokeparticle.png"].texture],
            ThrusterEmitterConfig
        );
        this.thrustEmitter.emit = false;

        this.explosionEmitter = new PIXI.particles.Emitter(
            this.sprite,
            [PIXI.loader.resources["assets/smokeparticle.png"].texture],
            ExplosionEmitterConfig
        );

        this.explosionEmitter.emit = false;
    }

    destroy(){
        return new Promise((resolve) =>{
            this.explosionEmitter.emit = true;

            this.thrustEmitter.destroy();
            this.thrustEmitter = null;
            this.shipSprite.destroy();

            setTimeout(()=>{
                this.sprite.destroy();
                this.explosionEmitter.destroy();
                resolve();
            },3000);
        });
    }

}


module.exports = ShipActor;