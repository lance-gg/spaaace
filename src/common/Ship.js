'use strict';

const DynamicObject= require('incheon').serialize.DynamicObject;

class Ship extends DynamicObject {

    constructor(id, x, y) {
        super(id, x, y);
        this.class = Ship;
    };
}

module.exports = Ship;
