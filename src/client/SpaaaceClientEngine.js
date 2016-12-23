const Howler = require('howler');
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
        // keep a reference for key press state
        this.pressedKeys = {};

        // add special handler for space key
        document.addEventListener('keydown', (e) => {
            if (e.keyCode=='32' && !this.pressedKeys['space']) {
                this.sendInput('space');
            }
        });

        document.addEventListener('keydown', (e) => { onKeyChange.call(this, e, true);});
        document.addEventListener('keyup', (e) => { onKeyChange.call(this, e, false);});

        // handle sounds
        this.sounds = {
            missileHit: new Howl({ src: ['assets/audio/193429__unfa__projectile-hit.mp3'] }),
            fireMissile: new Howl({ src: ['assets/audio/248293__chocobaggy__weird-laser-gun.mp3'] })
        };

        this.gameEngine.on('fireMissile', () => { this.sounds.fireMissile.play(); });
        this.gameEngine.on('missileHit', () => { this.sounds.missileHit.play(); });
    }

    // our pre-step is to process inputs that are "currently pressed" during the game step
    preStep() {
        if (this.pressedKeys.up) {
            this.sendInput('up', { movement: true } );
        }

        if (this.pressedKeys.left) {
            this.sendInput('left', { movement: true });
        }

        if (this.pressedKeys.right) {
            this.sendInput('right', { movement: true });
        }
    }

}

// private functions


// keyboard handling
const keyCodeTable = {
    '32': 'space',
    '37': 'left',
    '38': 'up',
    '39': 'right'
};

function onKeyChange(e, isDown) {
    e = e || window.event;

    let keyName = keyCodeTable[e.keyCode];
    if (keyName) {
        this.pressedKeys[keyName] = isDown;
        // keep reference to the last key pressed to avoid duplicates
        this.lastKeyPressed = isDown?e.keyCode:null;
        this.gameEngine.emit('client.keyChange',{ keyName, isDown });
    }
}


module.exports = SpaaaceClientEngine;
