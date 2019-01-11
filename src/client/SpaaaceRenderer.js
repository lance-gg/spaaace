let PIXI = null;
import Renderer from 'lance/render/Renderer';
import Utils from './../common/Utils';
import Ship from '../common/Ship';


/**
 * Renderer for the Spaaace client - based on Pixi.js
 */
export default class SpaaaceRenderer extends Renderer {

    get ASSETPATHS(){
        return {
            ship: 'assets/ship1.png',
            missile: 'assets/shot.png',
            bg1: 'assets/space3.png',
            bg2: 'assets/space2.png',
            bg3: 'assets/clouds2.png',
            bg4: 'assets/clouds1.png',
            smokeParticle: 'assets/smokeparticle.png'
        };
    }

    // TODO: document
    constructor(gameEngine, clientEngine) {
        super(gameEngine, clientEngine);
        PIXI = require('pixi.js');
        this.sprites = {};
        this.isReady = false;

        // asset prefix
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

        if (document.readyState === 'complete' || document.readyState === 'loaded' || document.readyState === 'interactive') {
            this.onDOMLoaded();
        } else {
            document.addEventListener('DOMContentLoaded', ()=>{
                this.onDOMLoaded();
            });
        }

        return new Promise((resolve, reject)=>{
            PIXI.loader.add(Object.keys(this.ASSETPATHS).map((x)=>{
                return{
                    name: x,
                    url: this.assetPathPrefix + this.ASSETPATHS[x]
                };
            }))
            .load(() => {
                this.isReady = true;
                this.setupStage();

                if (Utils.isTouchDevice()) {
                    document.body.classList.add('touch');
                } else if (isMacintosh()) {
                    document.body.classList.add('mac');
                } else if (isWindows()) {
                    document.body.classList.add('pc');
                }

                resolve();

                this.gameEngine.emit('renderer.ready');
            });
        });
    }

    onDOMLoaded(){
        this.renderer = PIXI.autoDetectRenderer(this.viewportWidth, this.viewportHeight);
        document.body.querySelector('.pixiContainer').appendChild(this.renderer.view);
    }

    setupStage() {
        window.addEventListener('resize', ()=>{ this.setRendererSize(); });

        this.lookingAt = { x: 0, y: 0 };
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
        // this.camera.addChild(this.debug);

        // this.debugText = new PIXI.Text('DEBUG', {fontFamily:"arial", fontSize: "100px", fill:"white"});
        // this.debugText.anchor.set(0.5, 0.5);
        // this.debugText.x = this.gameEngine.worldSettings.width/2;
        // this.debugText.y = this.gameEngine.worldSettings.height/2;
        // this.camera.addChild(this.debugText);

        this.elapsedTime = Date.now();
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

    draw(t, dt) {
        super.draw(t, dt);

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
                if (sprite.actor && sprite.actor.thrustEmitter) {
                    sprite.actor.thrustEmitter.emit = !!objData.showThrust;
                }

                if (objData instanceof Ship && sprite != this.playerShip) {
                    this.updateOffscreenIndicator(objData);
                }

                sprite.x = objData.position.x;
                sprite.y = objData.position.y;

                if (objData instanceof Ship){
                    sprite.actor.shipContainerSprite.rotation = this.gameEngine.world.objects[objId].angle * Math.PI/180;
                } else{
                    sprite.rotation = this.gameEngine.world.objects[objId].angle * Math.PI/180;
                }

                // make the wraparound seamless for objects other than the player ship
                if (sprite != this.playerShip && viewportSeesLeftBound && objData.position.x > this.viewportWidth - this.camera.x) {
                    sprite.x = objData.position.x - worldWidth;
                }
                if (sprite != this.playerShip && viewportSeesRightBound && objData.position.x < -this.camera.x) {
                    sprite.x = objData.position.x + worldWidth;
                }
                if (sprite != this.playerShip && viewportSeesTopBound && objData.position.y > this.viewportHeight - this.camera.y) {
                    sprite.y = objData.position.y - worldHeight;
                }
                if (sprite != this.playerShip && viewportSeesBottomBound && objData.position.y < -this.camera.y) {
                    sprite.y = objData.position.y + worldHeight;
                }
            }

            if (sprite) {
                // object is either a Pixi sprite or an Actor. Actors have renderSteps
                if (sprite.actor && sprite.actor.renderStep) {
                    sprite.actor.renderStep(now - this.elapsedTime);
                }
            }

            // this.emit("postDraw");
        }

        let cameraTarget;
        if (this.playerShip) {
            cameraTarget = this.playerShip;
            // this.cameraRoam = false;
        } else if (!this.gameStarted && !cameraTarget) {

            // calculate centroid
            cameraTarget = getCentroid(this.gameEngine.world.objects);
            this.cameraRoam = true;
        }

        if (cameraTarget) {
            // let bgOffsetX = -this.bgPhaseX * worldWidth - cameraTarget.x;
            // let bgOffsetY = -this.bgPhaseY * worldHeight - cameraTarget.y;

            // 'cameraroam' in Utils.getUrlVars()
            if (this.cameraRoam) {
                let lookingAtDeltaX = cameraTarget.x - this.lookingAt.x;
                let lookingAtDeltaY = cameraTarget.y - this.lookingAt.y;
                let cameraTempTargetX;
                let cameraTempTargetY;

                if (lookingAtDeltaX > worldWidth / 2) {
                    this.bgPhaseX++;
                    cameraTempTargetX = this.lookingAt.x + worldWidth;
                } else if (lookingAtDeltaX < -worldWidth / 2) {
                    this.bgPhaseX--;
                    cameraTempTargetX = this.lookingAt.x - worldWidth;
                } else {
                    cameraTempTargetX = this.lookingAt.x + lookingAtDeltaX * 0.02;
                }

                if (lookingAtDeltaY > worldHeight / 2) {
                    cameraTempTargetY = this.lookingAt.y + worldHeight;
                    this.bgPhaseY++;
                } else if (lookingAtDeltaY < -worldHeight / 2) {
                    this.bgPhaseY--;
                    cameraTempTargetY = this.lookingAt.y - worldHeight;
                } else {
                    cameraTempTargetY = this.lookingAt.y + lookingAtDeltaY * 0.02;
                }

                this.centerCamera(cameraTempTargetX, cameraTempTargetY);

            } else {
                this.centerCamera(cameraTarget.x, cameraTarget.y);
            }
        }

        let bgOffsetX = this.bgPhaseX * worldWidth + this.camera.x;
        let bgOffsetY = this.bgPhaseY * worldHeight + this.camera.y;

        this.bg1.tilePosition.x = bgOffsetX * 0.01;
        this.bg1.tilePosition.y = bgOffsetY * 0.01;

        this.bg2.tilePosition.x = bgOffsetX * 0.04;
        this.bg2.tilePosition.y = bgOffsetY * 0.04;

        this.bg3.tilePosition.x = bgOffsetX * 0.3;
        this.bg3.tilePosition.y = bgOffsetY * 0.3;

        this.bg4.tilePosition.x = bgOffsetX * 0.75;
        this.bg4.tilePosition.y = bgOffsetY * 0.75;

        this.elapsedTime = now;

        // Render the stage
        this.renderer.render(this.stage);
    }

    addPlayerShip(sprite) {
        this.playerShip = sprite;
        sprite.actor.shipSprite.tint = 0XFF00FF; // color  player ship
        document.body.classList.remove('lostGame');
        if (!document.body.classList.contains('tutorialDone')){
            document.body.classList.add('tutorial');
        }
        document.body.classList.remove('lostGame');
        document.body.classList.add('gameActive');
        document.querySelector('#tryAgain').disabled = true;
        document.querySelector('#joinGame').disabled = true;
        document.querySelector('#joinGame').style.opacity = 0;

        this.gameStarted = true; // todo state shouldn't be saved in the renderer

        // remove the tutorial if required after a timeout
        setTimeout(() => {
            document.body.classList.remove('tutorial');
        }, 10000);
    }

    /**
     * Centers the viewport on a coordinate in the gameworld
     * @param {Number} targetX
     * @param {Number} targetY
     */
    centerCamera(targetX, targetY) {
        if (isNaN(targetX) || isNaN(targetY)) return;
        if (!this.lastCameraPosition){
            this.lastCameraPosition = {};
        }

        this.lastCameraPosition.x = this.camera.x;
        this.lastCameraPosition.y = this.camera.y;

        this.camera.x = this.viewportWidth / 2 - targetX;
        this.camera.y = this.viewportHeight / 2 - targetY;
        this.lookingAt.x = targetX;
        this.lookingAt.y = targetY;
    }

    addOffscreenIndicator(objData) {
        let container = document.querySelector('#offscreenIndicatorContainer');
        let indicatorEl = document.createElement('div');
        indicatorEl.setAttribute('id', 'offscreenIndicator' + objData.id);
        indicatorEl.classList.add('offscreenIndicator');
        container.appendChild(indicatorEl);
    }

    updateOffscreenIndicator(objData){
        // player ship might have been destroyed
        if (!this.playerShip) return;

        let indicatorEl = document.querySelector('#offscreenIndicator' + objData.id);
        if (!indicatorEl) {
            console.error(`No indicatorEl found with id ${objData.id}`);
            return;
        }
        let playerShipObj = this.gameEngine.world.objects[this.playerShip.id];
        let slope = (objData.position.y - playerShipObj.position.y) / (objData.position.x - playerShipObj.position.x);
        let b = this.viewportHeight/ 2;

        let padding = 30;
        let indicatorPos = { x: 0, y: 0 };

        if (objData.position.y < playerShipObj.position.y - this.viewportHeight/2) {
            indicatorPos.x = this.viewportWidth/2 + (padding - b)/slope;
            indicatorPos.y = padding;
        } else if (objData.position.y > playerShipObj.position.y + this.viewportHeight/2) {
            indicatorPos.x = this.viewportWidth/2 + (this.viewportHeight - padding - b)/slope;
            indicatorPos.y = this.viewportHeight - padding;
        }

        if (objData.position.x < playerShipObj.position.x - this.viewportWidth/2) {
            indicatorPos.x = padding;
            indicatorPos.y = slope * (-this.viewportWidth/2 + padding) + b;
        } else if (objData.position.x > playerShipObj.position.x + this.viewportWidth/2) {
            indicatorPos.x = this.viewportWidth - padding;
            indicatorPos.y = slope * (this.viewportWidth/2 - padding) + b;
        }

        if (indicatorPos.x == 0 && indicatorPos.y == 0){
            indicatorEl.style.opacity = 0;
        } else {
            indicatorEl.style.opacity = 1;
            let rotation = Math.atan2(objData.position.y - playerShipObj.position.y, objData.position.x - playerShipObj.position.x);
            rotation = rotation * 180/Math.PI; // rad2deg
            indicatorEl.style.transform = `translateX(${indicatorPos.x}px) translateY(${indicatorPos.y}px) rotate(${rotation}deg) `;
        }
    }

    removeOffscreenIndicator(objData) {
        let indicatorEl = document.querySelector('#offscreenIndicator'+objData.id);
        if (indicatorEl && indicatorEl.parentNode)
            indicatorEl.parentNode.removeChild(indicatorEl);
    }

    updateHUD(data){
        if (data.RTT){ qs('.latencyData').innerHTML = data.RTT;}
        if (data.RTTAverage){ qs('.averageLatencyData').innerHTML = truncateDecimals(data.RTTAverage, 2);}
    }

    updateScore(data){
        let scoreContainer = qs('.score');
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
                if (this.playerShip && this.playerShip.id == parseInt(id)) scoreEl.classList.add('you');
                scoreEl.dataset.objId = id;
                scoreContainer.appendChild(scoreEl);
            }

            // stupid string/number conversion
            if (this.sprites[parseInt(id)])
                this.sprites[parseInt(id)].actor.changeName(data[id].name);

            scoreEl.innerHTML = `${data[id].name}: ${data[id].kills}`;

            scoreArray.push({
                el: scoreEl,
                data: data[id]
            });
        }

        scoreArray.sort((a, b) => {return a.data.kills < b.data.kills;});

        for (let x=0; x < scoreArray.length; x++){
            scoreArray[x].el.style.transform = `translateY(${x}rem)`;
        }

    }

    onKeyChange(e){
        if (this.playerShip) {
            if (e.keyName === 'up') {
                this.playerShip.actor.thrustEmitter.emit = e.isDown;
            }
        }
    }

    enableFullScreen(){
        let isInFullScreen = (document.fullScreenElement && document.fullScreenElement !== null) ||    // alternative standard method
            (document.mozFullScreen || document.webkitIsFullScreen);

        // iOS fullscreen generates user warnings
        if (isIPhoneIPad()) return;

        let docElm = document.documentElement;
        if (!isInFullScreen) {

            if (docElm.requestFullscreen) {
                docElm.requestFullscreen();
            } else if (docElm.mozRequestFullScreen) {
                docElm.mozRequestFullScreen();
            } else if (docElm.webkitRequestFullScreen) {
                // NOTE: disabled on iOS/Safari, because it generated a
                // phishing warning.
                // docElm.webkitRequestFullScreen();
            }
        }
    }

    /*
     * Takes in game coordinates and translates them into screen coordinates
     * @param obj an object with x and y properties
     */
    gameCoordsToScreen(obj){
        // console.log(obj.x , this.viewportWidth / 2 , this.camera.x)
        return {
            x: obj.position.x + this.camera.x,
            y: obj.position.y + this.camera.y
        };
    }

}

function getCentroid(objects) {
    let maxDistance = 500; // max distance to add to the centroid
    let shipCount = 0;
    let centroid = { x: 0, y: 0 };
    let selectedShip = null;

    for (let id of Object.keys(objects)){
        let obj = objects[id];
        if (obj instanceof Ship) {
            if (selectedShip == null)
                selectedShip = obj;

            let objDistance = Math.sqrt( Math.pow((selectedShip.position.x-obj.position.y), 2) + Math.pow((selectedShip.position.y-obj.position.y), 2));
            if (selectedShip == obj || objDistance < maxDistance) {
                centroid.x += obj.position.x;
                centroid.y += obj.position.y;
                shipCount++;
            }
        }
    }

    centroid.x /= shipCount;
    centroid.y /= shipCount;


    return centroid;
}

// convenience function
function qs(selector) { return document.querySelector(selector);}

function truncateDecimals(number, digits) {
    let multiplier = Math.pow(10, digits);
    let adjustedNum = number * multiplier;
    let truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

    return truncatedNum / multiplier;
};

function isMacintosh() {
    return navigator.platform.indexOf('Mac') > -1;
}

function isWindows() {
    return navigator.platform.indexOf('Win') > -1;
}

function isIPhoneIPad() {
    return navigator.platform.match(/i(Phone|Pod)/i) !== null;
}
