"use strict";


const Point= require('Incheon').Point;
const DynamicObject= require('./DynamicObject');

class Missile extends DynamicObject {

    static get properties(){
        return  {
            id: 9, //class id
            name: "shot"
        }
    }

    static get netScheme(){
        return Object.assign({}, super.netScheme);
    }

    constructor(id, x, y){
        super(id, x, y);
        this.constantVelocity = 4;

        this.class = Missile;
    };

}


module.exports = Missile;