const EventEmitter = require('eventemitter3');

/**
 * This class handles touch device controls
 */
class MobileControls{

    constructor(renderer){
        Object.assign(this, EventEmitter.prototype);
        this.renderer = renderer;

        this.touchContainer = document.querySelector(".pixiContainer");
        console.log(this.touchContainer);
        this.setupListeners();
    }

    setupListeners(){

        this.touchContainer.addEventListener('touchstart', (e) =>{
            // If there's exactly one finger inside this element
            if (e.targetTouches.length == 1) {
                let touch = e.targetTouches[0];
                // // Place element where the finger is
                // obj.style.left = touch.pageX + 'px';
                // obj.style.top = touch.pageY + 'px';
                console.log(touch.pageX, touch.pageY);
            }
        }, false);
    }
}

module.exports = MobileControls;
