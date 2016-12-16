const PIXI = require("pixi.js");
const PixiParticles = require("pixi-particles");
const ThrusterEmitterConfig = require("./ThrusterEmitter.json");


class ShipActor{

    constructor(gameEngine, camera){
        this.gameEngine = gameEngine;
        this.camera = camera;
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
        this.thrustEmitter.update(delta * 0.001);
        this.thrustEmitter.spawnPos.x = this.sprite.x - Math.cos(-this.sprite.rotation) * 10 ;
        this.thrustEmitter.spawnPos.y = this.sprite.y + Math.sin(-this.sprite.rotation) * 10;

        this.thrustEmitter.minsStartRotation  =  this.sprite.rotation * 180/Math.PI;
        this.thrustEmitter.maxStartRotation =  this.sprite.rotation * 180/Math.PI  + 10;

        this.thrustEmitter.minsStartRotation  =  90;
        this.thrustEmitter.maxStartRotation =  90;

    }

    addThrustEmitter(){
        this.thrustEmitter = new PIXI.particles.Emitter(
            this.camera,
            // The collection of particle images to use
            [PIXI.loader.resources["assets/smokeparticle.png"].texture],
            ThrusterEmitterConfig
        );

        this.thrustEmitter.emit = false;
    }

}


module.exports = ShipActor;