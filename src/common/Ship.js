"use strict";


const Point= require('Incheon').Point;
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
    
}


module.exports = Ship;