const ClientEngine = require('incheon').ClientEngine;
const GameWorld = require('incheon').GameWorld;

var Ship = require("../common/Ship");
var Missile = require("../common/Missile");

class SpaaaceClientEngine extends ClientEngine{
    constructor(gameEngine){
        super(gameEngine);

        this.sprites = {};
        this.gameEngine.on('client.preStep', this.preStep.bind(this));
    }

    start(){
        var that = this;

        super.start();

        this.gameEngine.world.idCount = 1000; //to solve - partial solution so client and server ids don't clash


        //  Game input
        this.cursors = game.input.keyboard.createCursorKeys();
        this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        this.sounds = {
            fireMissile: game.add.audio('fireMissile'),
            missileHit: game.add.audio('missileHit')
        };

        this.gameEngine.on("fireMissile",function(){
            that.sounds.fireMissile.play();
        })

        this.gameEngine.on("missileHit",function(){
            that.sounds.missileHit.play();
        })
    }

    // TODO: remove this when spaaace client engine stops pretending to be a renderer
    draw() {}

    updatePlayerObject() {
        var world = this.gameEngine.world;
        for (var objId in world.objects) {
            if (world.objects.hasOwnProperty(objId)) {
                let localObj = world.objects[objId];
                let sprite = this.sprites[objId];

                if (sprite == null) {
                    sprite = this.createSprite(localObj);
                }

                if (localObj.isPlayerControlled) {
                    sprite.x = localObj.x;
                    sprite.y = localObj.y;
                    sprite.angle = localObj.angle;
                }
            }
        }
    }

    processInputs(){
        //continuous press
        if (this.cursors.up.isDown) {
            this.sendInput('up');
        }

        if (this.cursors.left.isDown) {
            this.sendInput('left');
        }

        if (this.cursors.right.isDown) {
            this.sendInput('right');
        }

        //single press
        if (this.spaceKey.isDown && this.spaceKey.repeats == 0){
            this.sendInput('space');
        }
    }

    preStep() {
        this.processInputs();
        this.updatePlayerObject();
    }

    postStep() {

    }


    removeSprite(objId) {
        delete this.sprites[objId];
    }

    createSprite(objData){
        let sprite;

        if (objData.class == Ship) {
            sprite = window.game.add.sprite(objData.x, objData.y, 'ship');
            this.sprites[objData.id] = sprite;
            //if own player's ship - color it

            if (objData.isPlayerControlled) {
                sprite.tint = 0XFF00FF;
            }

            sprite.anchor.setTo(0.5, 0.5);
            sprite.width = 50;
            sprite.height = 45;
        }

        if (objData.class == Missile) {
            sprite = window.game.add.sprite(objData.x, objData.y, 'missile');
            this.sprites[objData.id] = sprite;

            sprite.width = 81 * 0.5;
            sprite.height = 46 * 0.5;
            sprite.anchor.setTo(0.5, 0.5);
        }

        return sprite;
    }

}


module.exports = SpaaaceClientEngine;
