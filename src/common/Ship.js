"use strict";


const Point= require('incheon').Point;
const DynamicObject= require('./DynamicObject');

class Ship extends DynamicObject {

    static get properties(){
        return  {
            id: 7, //class id
            name: "ship"
        }
    }

    static get netScheme(){
        return Object.assign({}, super.netScheme);
    }

    static newFrom(sourceObj){
        var newShip = new Ship();
        newShip.copyFrom(sourceObj);

        return newShip;
    }

    constructor(id, x, y){
        super(id, x, y);

        this.class = Ship;
    };

    // TODO: the next five functions are identical in Ship and Missile.
    //       This code should be in DynamicObject.
    init(options) {
        Object.assign(this, options);
    }

    initRenderObject(renderer) {

        this.renderer = renderer;
        // TODO: consider calling
        //       renderer.addObject()
        this.sprite = this.renderer.createSprite(this);

    }

    updateRenderObject() {
        // TODO: this.sprite should really be inside
        //       this.renderObject
    }

    interpolate(prevObj, nextObj, playPercentage) {

        // update other objects with interpolation
        // todo refactor into general interpolation class
        if (nextObj.isPlayerControlled != true){

            if (Math.abs(nextObj.x - prevObj.x) > this.renderer.gameEngine.worldSettings.height /2){ //fix for world wraparound
                this.sprite.x = nextObj.x;
            } else{
                this.sprite.x = (nextObj.x - prevObj.x) * playPercentage + prevObj.x;
            }

            if (Math.abs(nextObj.y - prevObj.y) > this.renderer.gameEngine.worldSettings.height/2) { //fix for world wraparound
                this.sprite.y = nextObj.y;
            } else{
                this.sprite.y = (nextObj.y - prevObj.y) * playPercentage + prevObj.y;
            }

            var shortest_angle=((((nextObj.angle - prevObj.angle) % 360) + 540) % 360) - 180; //todo wrap this in a util
            this.sprite.angle = prevObj.angle + shortest_angle *  playPercentage;
        }
    }

    destroy() {
        this.renderer.removeSprite(this.id);
    }

}


module.exports = Ship;
