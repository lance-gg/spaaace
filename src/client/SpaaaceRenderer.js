'use strict';

const PIXI = require("pixi.js");
const Renderer = require('incheon').render.Renderer;
let Missile = require('../common/Missile');
let Ship = require('../common/Ship');

const ASSETPATH = {
    ship: "assets/ship1.png",
    missile: "assets/shot.png"
};

/**
 * Renderer for the Spaaace client - based on Pixi.js
 */
class SpaaaceRenderer extends Renderer {

    constructor(gameEngine) {
        super(gameEngine);
        this.sprites = {};
        this.isReady = false;
    }

    init() {
        this.stage = new PIXI.Container();
        this.renderer = PIXI.autoDetectRenderer(this.gameEngine.worldSettings.width, this.gameEngine.worldSettings.height);
        document.addEventListener("DOMContentLoaded", ()=>{ document.body.appendChild(this.renderer.view); });

        return new Promise((resolve,reject)=>{
            PIXI.loader.add([
                ASSETPATH.ship,
                ASSETPATH.missile
            ])
            .load(() => {
                this.isReady = true;
                resolve();
            });
        });
    }

    draw() {
        super.draw();
        if (!this.isReady) return; //assets might not have been loaded yet

        for (let objId of Object.keys(this.sprites)) {
            if (this.gameEngine.world.objects[objId]) {
                this.sprites[objId].x = this.gameEngine.world.objects[objId].x;
                this.sprites[objId].y = this.gameEngine.world.objects[objId].y;
                this.sprites[objId].rotation = this.gameEngine.world.objects[objId].angle * Math.PI/180;
            } else {
                this.removeObject(this.sprites[objId]);
            }
        }

        //Render the stage
        this.renderer.render(this.stage);
    }

    addObject(objData, options) {
        let sprite;

        if (objData.class == Ship) {
            sprite = new PIXI.Sprite(PIXI.loader.resources[ASSETPATH.ship].texture);
            this.sprites[objData.id] = sprite;

            // if own player's ship - color it
            if (objData.isPlayerControlled) {
                sprite.tint = 0XFF00FF;
            }

            sprite.anchor.set(0.5, 0.5);
            sprite.width = 50;
            sprite.height = 45;

        } else if (objData.class == Missile) {
            sprite = new PIXI.Sprite(PIXI.loader.resources[ASSETPATH.missile].texture);
            this.sprites[objData.id] = sprite;

            sprite.width = 81 * 0.5;
            sprite.height = 46 * 0.5;

            sprite.anchor.set(0.5, 0.5);
        }

        sprite.position.set(objData.x, objData.y);
        this.stage.addChild(sprite);

        Object.assign(sprite, options);

        return sprite;
    }

    removeObject(obj) {
        obj.destroy();
        delete this.sprites[obj.id];
    }

}

module.exports = SpaaaceRenderer;
