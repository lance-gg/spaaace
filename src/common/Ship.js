"use strict";


const Point= require('incheon').Point;
const DynamicObject= require('incheon').serialize.DynamicObject;

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
}


module.exports = Ship;
