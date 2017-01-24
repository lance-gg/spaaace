const EventEmitter = require('eventemitter3');
const Utils = require('../common/Utils');


// keyboard handling
const keyCodeTable = {
    32: 'space',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
};

/**
 * This class handles keyboard device controls
 */
class KeyboardControls{

    constructor(renderer){
        Object.assign(this, EventEmitter.prototype);
        this.renderer = renderer;


        this.setupListeners();

        // keep a reference for key press state
        this.activeInput = {
            up: false,
            left: false,
            right: false
        };
    }

    setupListeners(){
        // add special handler for space key
        document.addEventListener('keydown', (e) => {
            if (e.keyCode == '32' && !this.activeInput.space) {
                this.emit('fire');
            }
        });

        document.addEventListener('keydown', (e) => { this.onKeyChange(e, true);});
        document.addEventListener('keyup', (e) => { this.onKeyChange(e, false);});
    }

    onKeyChange(e, isDown) {
        e = e || window.event;

        let keyName = keyCodeTable[e.keyCode];
        if (keyName) {
            this.activeInput[keyName] = isDown;
            // keep reference to the last key pressed to avoid duplicates
            this.lastKeyPressed = isDown ? e.keyCode : null;
            this.renderer.onKeyChange({ keyName, isDown });
            e.preventDefault();
        }
    }
}

module.exports = KeyboardControls;
