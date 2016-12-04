const ClientEngine = require('incheon').ClientEngine;
const SpaaaceRenderer = require('../client/SpaaaceRenderer');


class SpaaaceClientEngine extends ClientEngine {
    constructor(gameEngine, options) {
        super(gameEngine, options);

        // initialize renderer
        this.renderer = new SpaaaceRenderer(gameEngine);

        this.serializer.registerClass(require('../common/Ship'));
        this.serializer.registerClass(require('../common/Missile'));

        this.gameEngine.on('client.preStep', this.preStep.bind(this));
    }

    start() {

        super.start();

        //  Game input
        this.cursors = game.input.keyboard.createCursorKeys();
        this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        this.sounds = {
            fireMissile: game.add.audio('fireMissile'),
            missileHit: game.add.audio('missileHit')
        };

        this.gameEngine.on('fireMissile', () => { this.sounds.fireMissile.play(); });
        this.gameEngine.on('missileHit', () => { this.sounds.missileHit.play(); });
    }

    // our pre-step is to process all inputs
    preStep() {
        // continuous press
        if (this.cursors.up.isDown) {
            this.sendInput('up', { movement: true } );
        }

        if (this.cursors.left.isDown) {
            this.sendInput('left', { movement: true });
        }

        if (this.cursors.right.isDown) {
            this.sendInput('right', { movement: true });
        }

        // single press
        // TODO: Opher please fix the strange "repeats" usage below
        if (this.spaceKey.isDown && (this.spaceKey.repeats === 0 || this.spaceKey.repeats === 1)) {
            this.sendInput('space');
        }
    }

}


module.exports = SpaaaceClientEngine;
