'use strict';

const Renderer = require('incheon').render.Renderer;
let Missile = require('../common/Missile');
let Ship = require('../common/Ship');

class SpaaaceRenderer extends Renderer {

    constructor(gameEngine) {
        super(gameEngine);
        this.sprites = {};

        // TODO: the world settings are really a property of the GameEngine.
        //       but they are currently used by interpolate function of DynamicObject.
        this.worldSettings = {
            worldWrap: true,
            width: 800,
            height: 600
        };
    }

    init() {}

    draw() {
        super.draw();
        for (let objId of Object.keys(this.sprites)) {
            if (this.sprites[objId] && this.gameEngine.world.objects[objId]) {
                this.sprites[objId].x = this.gameEngine.world.objects[objId].x;
                this.sprites[objId].y = this.gameEngine.world.objects[objId].y;
                this.sprites[objId].angle = this.gameEngine.world.objects[objId].angle;
            }
        }
    }

    addObject(objData, options) {
        let sprite;

        if (objData.class == Ship) {
            sprite = window.game.add.sprite(objData.x, objData.y, 'ship');
            this.sprites[objData.id] = sprite;
            // if own player's ship - color it

            if (objData.isPlayerControlled) {
                sprite.tint = 0XFF00FF;
            }

            sprite.anchor.setTo(0.5, 0.5);
            sprite.width = 50;
            sprite.height = 45;
        } else if (objData.class == Missile) {
            sprite = window.game.add.sprite(objData.x, objData.y, 'missile');
            this.sprites[objData.id] = sprite;

            sprite.width = 81 * 0.5;
            sprite.height = 46 * 0.5;
            sprite.anchor.setTo(0.5, 0.5);
        }

        Object.assign(sprite, options);

        return sprite;
    }

    removeObject(obj) {
        obj.destroy();
        delete this.sprites[obj.id];
    }

}

module.exports = SpaaaceRenderer;
