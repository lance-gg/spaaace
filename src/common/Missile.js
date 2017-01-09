'use strict';

const Serializer = require('incheon').serialize.Serializer;
const DynamicObject= require('incheon').serialize.DynamicObject;

class Missile extends DynamicObject {

    static get netScheme() {
        return Object.assign({
            inputId: { type: Serializer.TYPES.INT32 }
        }, super.netScheme);
    }

    toString() {
        return `Missile::${super.toString()}`;
    }

    constructor(id, x, y) {
        super(id, x, y);
        this.class = Missile;
    };
}

module.exports = Missile;
