const ClientEngine = require('incheon').ClientEngine;
const GameWorld = require('incheon').GameWorld;


class SpaaaceClientEngine extends ClientEngine{
    constructor(gameEngine){
        super(gameEngine);

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

    updatePlayerObject() {
        var world = this.gameEngine.world;
        for (var objId in world.objects) {
            if (world.objects.hasOwnProperty(objId)) {
                let localObj = world.objects[objId];
                let renderObject = localObj.renderObject;

                if (renderObject == null) {
                    renderObject = this.gameEngine.renderer.addObject(localObj);
                }

                if (localObj.isPlayerControlled) {
                    renderObject.x = localObj.x;
                    renderObject.y = localObj.y;
                    renderObject.angle = localObj.angle;
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

}


module.exports = SpaaaceClientEngine;
