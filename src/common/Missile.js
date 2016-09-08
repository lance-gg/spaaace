"use strict";


const Point= require('incheon').Point;
const Serializer = require('./Serializer');
const DynamicObject= require('incheon').serialize.DynamicObject;

class Missile extends DynamicObject {

    static get netScheme(){
        return Object.assign({
            inputId: { type: Serializer.TYPES.INT32 }
        }, super.netScheme);
    }

    static newFrom(sourceObj){
        var newMissile = new Missile();
        newMissile.copyFrom(sourceObj);

        return newMissile;
    }

    constructor(id, x, y){
        super(id, x, y);
        this.constantVelocity = 10;

        this.class = Missile;
    };

}


module.exports = Missile;
