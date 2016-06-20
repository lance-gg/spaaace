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

    constructor(id, x, y){
        super(id, x, y);

        this.class = Ship;
    };

    step(worldSettings){
        super.step(worldSettings);
    };
    
}


module.exports = Ship;