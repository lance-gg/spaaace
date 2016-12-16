'use strict';

const PIXI = require("pixi.js");
const Renderer = require('incheon').render.Renderer;
let Missile = require('../common/Missile');
let Ship = require('../common/Ship');

const ASSETPATH = {
    ship: "assets/ship1.png",
    missile: "assets/shot.png",
    bg1: "assets/space3.png",
    bg2: "assets/space2.png",
    bg3: "assets/clouds2.png",
    bg4: "assets/clouds1.png"
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
        this.viewportWidth = window.innerWidth;
        this.viewportHeight = window.innerHeight;

        this.stage = new PIXI.Container();
        this.renderer = PIXI.autoDetectRenderer(this.viewportWidth, this.viewportHeight);
        document.addEventListener("DOMContentLoaded", ()=>{ document.body.appendChild(this.renderer.view); });

        return new Promise((resolve,reject)=>{
            PIXI.loader.add(Object.values(ASSETPATH))
            .load(() => {
                this.isReady = true;
                this.setupStage();
                resolve();
            });
        });
    }

    setupStage(){
        window.addEventListener("resize", ()=>{ this.setRendererSize(); });

        this.camera = new PIXI.Container();

        //parallax background
        this.bg1 = new PIXI.extras.TilingSprite(PIXI.loader.resources[ASSETPATH.bg1].texture,
                this.viewportWidth,this.viewportHeight);
        this.bg2 = new PIXI.extras.TilingSprite(PIXI.loader.resources[ASSETPATH.bg2].texture,
            this.viewportWidth,this.viewportHeight);
        this.bg3 = new PIXI.extras.TilingSprite(PIXI.loader.resources[ASSETPATH.bg3].texture,
            this.viewportWidth,this.viewportHeight);
        this.bg4 = new PIXI.extras.TilingSprite(PIXI.loader.resources[ASSETPATH.bg4].texture,
            this.viewportWidth,this.viewportHeight);

        this.bg3.blendMode = PIXI.BLEND_MODES.ADD;
        this.bg4.blendMode = PIXI.BLEND_MODES.ADD;
        this.bg4.alpha = 0.6;

        this.stage.addChild(this.bg1, this.bg2, this.bg3, this.bg4);
        this.stage.addChild(this.camera);
    }

    setRendererSize(){
        this.viewportWidth = window.innerWidth;
        this.viewportHeight = window.innerHeight;

        this.bg1.width = this.viewportWidth;
        this.bg1.height = this.viewportHeight;
        this.bg2.width = this.viewportWidth;
        this.bg2.height = this.viewportHeight;
        this.bg3.width = this.viewportWidth;
        this.bg3.height = this.viewportHeight;
        this.bg4.width = this.viewportWidth;
        this.bg4.height = this.viewportHeight;

        this.renderer.resize(this.viewportWidth, this.viewportHeight);
    }

    draw() {
        super.draw();
        if (!this.isReady) return; //assets might not have been loaded yet

        for (let objId of Object.keys(this.sprites)) {
            let objData = this.gameEngine.world.objects[objId]
            if (objData) {
                this.sprites[objId].x = this.gameEngine.world.objects[objId].x;
                this.sprites[objId].y = this.gameEngine.world.objects[objId].y;
                this.sprites[objId].rotation = this.gameEngine.world.objects[objId].angle * Math.PI/180;
            }
        }

        if(this.playerShip) {
            this.bg1.tilePosition.x = -this.playerShip.x * 0.01;
            this.bg1.tilePosition.y = -this.playerShip.y * 0.01;

            this.bg2.tilePosition.x = -this.playerShip.x * 0.02;
            this.bg2.tilePosition.y = -this.playerShip.y * 0.02;

            this.bg3.tilePosition.x = -this.playerShip.x * 0.3;
            this.bg3.tilePosition.y = -this.playerShip.y * 0.3;

            this.bg4.tilePosition.x = -this.playerShip.x * 0.45;
            this.bg4.tilePosition.y = -this.playerShip.y * 0.45;

            //always center the playership
            this.camera.x = this.viewportWidth/2 - this.playerShip.x;
            this.camera.y = this.viewportHeight/2 -this.playerShip.y;
        }

        //Render the stage
        this.renderer.render(this.stage);
    }

    addObject(objData, options) {
        let sprite;

        if (objData.class == Ship) {
            sprite = new PIXI.Sprite(PIXI.loader.resources[ASSETPATH.ship].texture);
            this.sprites[objData.id] = sprite;

            if (objData.isPlayerControlled) {
                this.playerShip = sprite; //save reference to the player ship
                sprite.tint = 0XFF00FF; //color  player ship
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
        this.camera.addChild(sprite);

        Object.assign(sprite, options);

        return sprite;
    }

    removeObject(obj) {
        this.sprites[obj.id].destroy();
        delete this.sprites[obj.id];
    }

}

module.exports = SpaaaceRenderer;
