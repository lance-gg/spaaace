'use strict';

const DynamicObject= require('incheon').serialize.DynamicObject;

class Ship extends DynamicObject {

    constructor(id, x, y) {
        super(id, x, y);
        this.class = Ship;
    };

    get maxSpeed() { return 5.0; }
}

module.exports = Ship;
