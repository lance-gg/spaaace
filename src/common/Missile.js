"use strict";


const Point= require('incheon').Point;
const DynamicObject= require('./DynamicObject');

class Missile extends DynamicObject {

    static get properties(){
        return  {
            id: 9, //class id
            name: "missile"
        }
    }

    static get netScheme(){
        return Object.assign({}, super.netScheme);
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