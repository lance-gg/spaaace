"use strict";

const Renderer = require('incheon').render.Renderer;
var Ship = require("../common/Ship");
var Missile = require("../common/Missile");

class SpaaaceRenderer extends Renderer {

    constructor() {
        super();
        this.sprites = {};

        // TODO: the world settings are really a property of the GameEngine.
        //       but they are currently used by interpolate function of DynamicObject.
        this.worldSettings = {
            width: 800,
            height: 600
        };
    }

    init() {

    }

    draw() {
        super.draw();


    }

    addObject(objData) {
        let sprite;

        if (objData.class == Ship) {
            sprite = window.game.add.sprite(objData.x, objData.y, 'ship');
            this.sprites[objData.id] = sprite;
            //if own player's ship - color it

            if (objData.isPlayerControlled) {
                sprite.tint = 0XFF00FF;
            }

            sprite.anchor.setTo(0.5, 0.5);
            sprite.width = 50;
            sprite.height = 45;
        }

        if (objData.class == Missile) {
            sprite = window.game.add.sprite(objData.x, objData.y, 'missile');
            this.sprites[objData.id] = sprite;

            sprite.width = 81 * 0.5;
            sprite.height = 46 * 0.5;
            sprite.anchor.setTo(0.5, 0.5);
        }

        return sprite;
    }

    removeObject(o) {
        delete this.sprites[o.id];
    }

}

module.exports = SpaaaceRenderer;
