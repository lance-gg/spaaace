'use strict';

const PIXI = require('pixi.js');
const Renderer = require('incheon').render.Renderer;
const Utils= require('./Utils');

const Missile = require('../common/Missile');
const Ship = require('../common/Ship');
const ShipActor = require('./ShipActor');

/**
 * Renderer for the Spaaace client - based on Pixi.js
 */
class SpaaaceRenderer extends Renderer {

    get ASSETPATHS(){
        return {
            ship: 'assets/ship1.png',
            missile: 'assets/shot.png',
            bg1: 'assets/space3.png',
            bg2: 'assets/space2.png',
            bg3: 'assets/clouds2.png',
            bg4: 'assets/clouds1.png',
            smokeParticle: 'assets/smokeparticle.png'
        }
    }

    constructor(gameEngine) {
        super(gameEngine);
        this.sprites = {};
        this.isReady = false;

        //asset prefix
        this.assetPathPrefix = this.gameEngine.options.assetPathPrefix?this.gameEngine.options.assetPathPrefix:'';

        // these define how many gameWorlds the player ship has "scrolled" through
        this.bgPhaseX = 0;
        this.bgPhaseY = 0;
    }

    init() {
        this.viewportWidth = window.innerWidth;
        this.viewportHeight = window.innerHeight;

        this.stage = new PIXI.Container();
        this.layer1 = new PIXI.Container();
        this.layer2 = new PIXI.Container();

        this.stage.addChild(this.layer1, this.layer2);

        this.renderer = PIXI.autoDetectRenderer(this.viewportWidth, this.viewportHeight);
        if (document.readyState === "complete" || document.readyState === "loaded" || document.readyState === "interactive") {
            document.body.querySelector('.pixiContainer').appendChild(this.renderer.view);
        } else{
            document.addEventListener('DOMContentLoaded', ()=>{
                document.body.querySelector('.pixiContainer').appendChild(this.renderer.view);
            });
        }

        return new Promise((resolve, reject)=>{
            PIXI.loader.add(Object.keys(this.ASSETPATHS).map((x)=>{
                return{
                    name: x,
                    url: this.assetPathPrefix +this.ASSETPATHS[x]
                }
            }))
            .load(() => {
                this.isReady = true;
                this.setupStage();
                this.setupDOM();
                this.gameEngine.emit('renderer.ready');
                resolve();
            });
        });
    }

    setupDOM(){
        if (isMacintosh()){
            document.body.classList.add('mac');
        }
        if (isWindows()){
            document.body.classList.add('pc');
        }
    }

    setupStage() {
        window.addEventListener('resize', ()=>{ this.setRendererSize(); });

        this.camera = new PIXI.Container();
        this.camera.addChild(this.layer1, this.layer2);

        // parallax background
        this.bg1 = new PIXI.extras.TilingSprite(PIXI.loader.resources.bg1.texture,
                this.viewportWidth, this.viewportHeight);
        this.bg2 = new PIXI.extras.TilingSprite(PIXI.loader.resources.bg2.texture,
            this.viewportWidth, this.viewportHeight);
        this.bg3 = new PIXI.extras.TilingSprite(PIXI.loader.resources.bg3.texture,
            this.viewportWidth, this.viewportHeight);
        this.bg4 = new PIXI.extras.TilingSprite(PIXI.loader.resources.bg4.texture,
            this.viewportWidth, this.viewportHeight);

        this.bg3.blendMode = PIXI.BLEND_MODES.ADD;
        this.bg4.blendMode = PIXI.BLEND_MODES.ADD;
        this.bg4.alpha = 0.6;

        this.stage.addChild(this.bg1, this.bg2, this.bg3, this.bg4);
        this.stage.addChild(this.camera);

        // this.debug= new PIXI.Graphics();
        // this.stage.addChild(this.debug);

        this.elapsedTime = Date.now();

        // events
        this.gameEngine.on('client.keyChange', (e)=>{
            if (this.playerShip) {
                if (e.keyName == 'up') {
                    this.playerShip.actor.thrustEmitter.emit = e.isDown;
                }
            }
        });

        // debug
        if ('showworldbounds' in Utils.getUrlVars()) {
            let graphics = new PIXI.Graphics();
            graphics.beginFill(0xFFFFFF);
            graphics.alpha = 0.1;
            graphics.drawRect(0, 0, this.gameEngine.worldSettings.width, this.gameEngine.worldSettings.height);
            this.camera.addChild(graphics);
        }

    }

    setRendererSize() {
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

        let now = Date.now();

        if (!this.isReady) return; // assets might not have been loaded yet
        let worldWidth = this.gameEngine.worldSettings.width;
        let worldHeight = this.gameEngine.worldSettings.height;

        let viewportSeesRightBound = this.camera.x < this.viewportWidth - worldWidth;
        let viewportSeesLeftBound = this.camera.x > 0;
        let viewportSeesTopBound = this.camera.y > 0;
        let viewportSeesBottomBound = this.camera.y < this.viewportHeight - worldHeight;

        for (let objId of Object.keys(this.sprites)) {
            let objData = this.gameEngine.world.objects[objId];
            let sprite = this.sprites[objId];

            if (objData) {

                // if the object requests a "showThrust" then invoke it in the actor
                if ((sprite !== this.playerShip) && sprite.actor) {
                    sprite.actor.thrustEmitter.emit = !!objData.showThrust;
                }

                if (sprite == this.playerShip) {
                    if (objData.x - sprite.x < -worldWidth/2) { this.bgPhaseX++; }
                    if (objData.x - sprite.x > worldWidth/2) { this.bgPhaseX--; }
                    if (objData.y - sprite.y < -worldHeight/2) { this.bgPhaseY++; }
                    if (objData.y - sprite.y > worldHeight/2) { this.bgPhaseY--; }
                }

                if (objData.class == Ship && sprite != this.playerShip) {
                    this.updateOffscreenIndicator(objData);
                }

                sprite.x = objData.x;
                sprite.y = objData.y;

                if (objData.class == Ship){
                    sprite.actor.shipContainerSprite.rotation = this.gameEngine.world.objects[objId].angle * Math.PI/180;
                }
                else{
                    sprite.rotation = this.gameEngine.world.objects[objId].angle * Math.PI/180;
                }

                // make the wraparound seamless for objects other than the player ship
                if (sprite != this.playerShip && viewportSeesLeftBound && objData.x > this.viewportWidth - this.camera.x) {
                    sprite.x = objData.x - worldWidth;
                }
                if (sprite != this.playerShip && viewportSeesRightBound && objData.x < -this.camera.x) {
                    sprite.x = objData.x + worldWidth;
                }
                if (sprite != this.playerShip && viewportSeesTopBound && objData.y > this.viewportHeight - this.camera.y) {
                    sprite.y = objData.y - worldHeight;
                }
                if (sprite != this.playerShip && viewportSeesBottomBound && objData.y < -this.camera.y) {
                    sprite.y = objData.y + worldHeight;
                }
            }

            if (sprite) {
                // object is either a Pixi sprite or an Actor. Actors have renderSteps
                if (sprite.actor && sprite.actor.renderStep) {
                    sprite.actor.renderStep(now - this.elapsedTime);
                }
            }
        }

        if(this.playerShip) {
            let bgOffsetX = -this.bgPhaseX * worldWidth - this.playerShip.x;
            let bgOffsetY = -this.bgPhaseY * worldHeight - this.playerShip.y;

            // let bgOffsetX = this.bgPhaseX * worldWidth + this.camera.x;
            // let bgOffsetY = this.bgPhaseY * worldHeight + this.camera.y;

            this.bg1.tilePosition.x = bgOffsetX * 0.01;
            this.bg1.tilePosition.y = bgOffsetY * 0.01;

            this.bg2.tilePosition.x = bgOffsetX * 0.04;
            this.bg2.tilePosition.y = bgOffsetY * 0.04;

            this.bg3.tilePosition.x = bgOffsetX * 0.3;
            this.bg3.tilePosition.y = bgOffsetY * 0.3;

            this.bg4.tilePosition.x = bgOffsetX * 0.45;
            this.bg4.tilePosition.y = bgOffsetY * 0.45;

            if ('cameraroam' in Utils.getUrlVars()) {
                // always center the playership, do this smoothly
                let targetCamX = this.viewportWidth / 2 - this.playerShip.x;
                let targetCamY = this.viewportHeight / 2 - this.playerShip.y;
                let xCamDelta = (targetCamX - this.camera.x);
                let yCamDelta = (targetCamY - this.camera.y);
                console.log(xCamDelta, yCamDelta);

                if (xCamDelta > worldWidth/2) {
                    this.camera.x = this.camera.x + worldWidth + xCamDelta / 50;
                }
                if (xCamDelta < -worldWidth/2) {
                    this.camera.x = this.camera.x - worldWidth + xCamDelta / 50;
                } else{
                    this.camera.x = this.camera.x + xCamDelta / 50;
                }

                this.camera.y = this.camera.y + yCamDelta / 50;
            } else{
                this.camera.x = this.viewportWidth/2 - this.playerShip.x;
                this.camera.y = this.viewportHeight/2 - this.playerShip.y;
            }
        }

        this.elapsedTime = now;

        // Render the stage
        this.renderer.render(this.stage);
    }

    addObject(objData, options) {
        let sprite;

        if (objData.class == Ship) {
            let shipActor = new ShipActor(this);
            sprite = shipActor.sprite;
            this.sprites[objData.id] = sprite;
            sprite.id = objData.id;

            if (objData.isPlayerControlled) {
                this.playerShip = sprite; // save reference to the player ship
                sprite.actor.shipSprite.tint = 0XFF00FF; // color  player ship
                document.body.classList.remove("lostGame");

                //remove the tutorial if required after a timeout
                setTimeout(()=>{
                    document.body.classList.remove('tutorial');
                }, 15000);
            }
            else {
                this.addOffscreenIndicator(objData);
            }

        } else if (objData.class == Missile) {
            sprite = new PIXI.Sprite(PIXI.loader.resources.missile.texture);
            this.sprites[objData.id] = sprite;

            sprite.width = 81 * 0.5;
            sprite.height = 46 * 0.5;

            sprite.anchor.set(0.5, 0.5);
        }

        sprite.position.set(objData.x, objData.y);
        this.layer2.addChild(sprite);

        Object.assign(sprite, options);

        return sprite;
    }

    removeObject(obj) {
        if (this.playerShip && obj.id == this.playerShip.id) {
            this.playerShip = null;
        }

        if (obj.class == Ship && this.playerShip && obj.id != this.playerShip.id) {
            this.removeOffscreenIndicator(obj);

        }

        let sprite = this.sprites[obj.id];
        if (sprite.actor) {
            // removal "takes time"
            sprite.actor.destroy().then(()=>{
                console.log('deleted sprite');
                delete this.sprites[obj.id];
            });
        } else{
            this.sprites[obj.id].destroy();
            delete this.sprites[obj.id];
        }
    }

    addOffscreenIndicator(objData) {
        let container = document.querySelector('#offscreenIndicatorContainer');
        let indicatorEl = document.createElement('div');
        indicatorEl.setAttribute('id','offscreenIndicator'+objData.id);
        indicatorEl.classList.add('offscreenIndicator');
        container.appendChild(indicatorEl);
    }

    updateOffscreenIndicator(objData){
        //player ship might have been destroyed
        if (!this.playerShip) return;

        let indicatorEl = document.querySelector('#offscreenIndicator'+objData.id);
        if (!indicatorEl) {
            console.error(`No indicatorEl found with id ${objData.id}`);
            return;
        }
        let playerShipObj = this.gameEngine.world.objects[this.playerShip.id];
        let slope = (objData.y - playerShipObj.y)/(objData.x - playerShipObj.x);
        let b = this.viewportHeight/2;

        // this.debug.clear();
        // this.debug.lineStyle(1, 0xFF0000 ,1);
        // this.debug.moveTo(this.viewportWidth/2,this.viewportHeight/2);
        // this.debug.lineTo(this.viewportWidth/2 + b/-slope, 0);
        // this.debug.endFill();

        let padding = 30;
        let indicatorPos = { x: 0, y: 0};

        if (objData.y < playerShipObj.y - this.viewportHeight/2) {
            indicatorPos.x = this.viewportWidth/2 + (padding - b)/slope;
            indicatorPos.y = padding;
        } else if (objData.y > playerShipObj.y + this.viewportHeight/2) {
            indicatorPos.x = this.viewportWidth/2 + (this.viewportHeight - padding - b)/slope;
            indicatorPos.y = this.viewportHeight - padding;
        }

        if (objData.x < playerShipObj.x - this.viewportWidth/2) {
            indicatorPos.x = padding;
            indicatorPos.y = slope * (-this.viewportWidth/2 + padding) + b;
        } else if (objData.x > playerShipObj.x + this.viewportWidth/2) {
            indicatorPos.x = this.viewportWidth - padding;
            indicatorPos.y = slope * (this.viewportWidth/2 - padding) + b;
        }

        if (indicatorPos.x == 0 && indicatorPos.y == 0){
            indicatorEl.style.opacity = 0;
        }
        else{
            indicatorEl.style.opacity = 1;
            let rotation = Math.atan2(objData.y - playerShipObj.y,objData.x - playerShipObj.x);
            rotation = rotation * 180/Math.PI; //rad2deg
            indicatorEl.style.transform = `translateX(${indicatorPos.x}px) translateY(${indicatorPos.y}px) rotate(${rotation}deg) `;
        }
    }

    removeOffscreenIndicator(objData) {
        let indicatorEl = document.querySelector('#offscreenIndicator'+objData.id);
        indicatorEl.parentNode.removeChild(indicatorEl);
    }

    updateHUD(data){
        if (data.RTT){ qs('.latencyData').innerHTML = data.RTT;}
        if (data.RTTAverage){ qs('.averageLatencyData').innerHTML = truncateDecimals(data.RTTAverage,2);}
    }

    updateScore(data){
        let scoreContainer = qs(".score");
        let scoreArray = [];

        // remove score lines with objects that don't exist anymore
        let scoreEls = scoreContainer.querySelectorAll('.line');
        for (let x=0; x < scoreEls.length; x++){
            if (data[scoreEls[x].dataset.objId] == null){
                scoreEls[x].parentNode.removeChild(scoreEls[x]);
            }
        }

        for (let id of Object.keys(data)){
            let scoreEl = scoreContainer.querySelector(`[data-obj-id='${id}']`);
            // create score line if it doesn't exist
            if (scoreEl == null){
                scoreEl = document.createElement('div');
                scoreEl.classList.add('line');
                scoreEl.dataset.objId = id;
                scoreContainer.appendChild(scoreEl);
            }

            // stupid string/number conversion
            if (this.sprites[id+''])
                this.sprites[id+''].actor.changeName(data[id].name);

            scoreEl.innerHTML = `${data[id].name}: ${data[id].kills}`;

            scoreArray.push({
                el: scoreEl,
                data: data[id]
            });
        }

        scoreArray.sort((a, b) => {return a.data.kills < b.data.kills});

        for (let x=0; x < scoreArray.length; x++){
            scoreArray[x].el.style.transform = `translateY(${x}rem)`;
        }

    }

}

// convenience function
function qs(selector) { return document.querySelector(selector)}

function truncateDecimals(number, digits) {
    let multiplier = Math.pow(10, digits);
    let adjustedNum = number * multiplier;
    let truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

    return truncatedNum / multiplier;
};

function isMacintosh() {
    return navigator.platform.indexOf('Mac') > -1
}

function isWindows() {
    return navigator.platform.indexOf('Win') > -1
}

module.exports = SpaaaceRenderer;
