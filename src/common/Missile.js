'use strict';

const Serializer = require('incheon').serialize.Serializer;
const DynamicObject= require('incheon').serialize.DynamicObject;

class Missile extends DynamicObject {

    static get netScheme() {
        return Object.assign({
            inputId: { type: Serializer.TYPES.INT32 }
        }, super.netScheme);
    }

    constructor(id, x, y) {
        super(id, x, y);
        this.constantVelocity = 10;
        this.class = Missile;
    };
}

module.exports = Missile;
