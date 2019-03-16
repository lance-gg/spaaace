"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lanceGg = require("lance-gg");

var _Utils = _interopRequireDefault(require("./../common/Utils"));

var _Ship = _interopRequireDefault(require("../common/Ship"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var PIXI = null;

/**
 * Renderer for the Spaaace client - based on Pixi.js
 */
var SpaaaceRenderer =
/*#__PURE__*/
function (_Renderer) {
  _inherits(SpaaaceRenderer, _Renderer);

  _createClass(SpaaaceRenderer, [{
    key: "ASSETPATHS",
    get: function get() {
      return {
        ship: 'assets/ship1.png',
        missile: 'assets/shot.png',
        bg1: 'assets/space3.png',
        bg2: 'assets/space2.png',
        bg3: 'assets/clouds2.png',
        bg4: 'assets/clouds1.png',
        smokeParticle: 'assets/smokeparticle.png'
      };
    } // TODO: document

  }]);

  function SpaaaceRenderer(gameEngine, clientEngine) {
    var _this;

    _classCallCheck(this, SpaaaceRenderer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SpaaaceRenderer).call(this, gameEngine, clientEngine));
    PIXI = require('pixi.js');
    _this.sprites = {};
    _this.isReady = false; // asset prefix

    _this.assetPathPrefix = _this.gameEngine.options.assetPathPrefix ? _this.gameEngine.options.assetPathPrefix : ''; // these define how many gameWorlds the player ship has "scrolled" through

    _this.bgPhaseX = 0;
    _this.bgPhaseY = 0;
    return _this;
  }

  _createClass(SpaaaceRenderer, [{
    key: "init",
    value: function init() {
      var _this2 = this;

      this.viewportWidth = window.innerWidth;
      this.viewportHeight = window.innerHeight;
      this.stage = new PIXI.Container();
      this.layer1 = new PIXI.Container();
      this.layer2 = new PIXI.Container();
      this.stage.addChild(this.layer1, this.layer2);

      if (document.readyState === 'complete' || document.readyState === 'loaded' || document.readyState === 'interactive') {
        this.onDOMLoaded();
      } else {
        document.addEventListener('DOMContentLoaded', function () {
          _this2.onDOMLoaded();
        });
      }

      return new Promise(function (resolve, reject) {
        PIXI.loader.add(Object.keys(_this2.ASSETPATHS).map(function (x) {
          return {
            name: x,
            url: _this2.assetPathPrefix + _this2.ASSETPATHS[x]
          };
        })).load(function () {
          _this2.isReady = true;

          _this2.setupStage();

          if (_Utils.default.isTouchDevice()) {
            document.body.classList.add('touch');
          } else if (isMacintosh()) {
            document.body.classList.add('mac');
          } else if (isWindows()) {
            document.body.classList.add('pc');
          }

          resolve();

          _this2.gameEngine.emit('renderer.ready');
        });
      });
    }
  }, {
    key: "onDOMLoaded",
    value: function onDOMLoaded() {
      this.renderer = PIXI.autoDetectRenderer(this.viewportWidth, this.viewportHeight);
      document.body.querySelector('.pixiContainer').appendChild(this.renderer.view);
    }
  }, {
    key: "setupStage",
    value: function setupStage() {
      var _this3 = this;

      window.addEventListener('resize', function () {
        _this3.setRendererSize();
      });
      this.lookingAt = {
        x: 0,
        y: 0
      };
      this.camera = new PIXI.Container();
      this.camera.addChild(this.layer1, this.layer2); // parallax background

      this.bg1 = new PIXI.extras.TilingSprite(PIXI.loader.resources.bg1.texture, this.viewportWidth, this.viewportHeight);
      this.bg2 = new PIXI.extras.TilingSprite(PIXI.loader.resources.bg2.texture, this.viewportWidth, this.viewportHeight);
      this.bg3 = new PIXI.extras.TilingSprite(PIXI.loader.resources.bg3.texture, this.viewportWidth, this.viewportHeight);
      this.bg4 = new PIXI.extras.TilingSprite(PIXI.loader.resources.bg4.texture, this.viewportWidth, this.viewportHeight);
      this.bg3.blendMode = PIXI.BLEND_MODES.ADD;
      this.bg4.blendMode = PIXI.BLEND_MODES.ADD;
      this.bg4.alpha = 0.6;
      this.stage.addChild(this.bg1, this.bg2, this.bg3, this.bg4);
      this.stage.addChild(this.camera); // this.debug= new PIXI.Graphics();
      // this.camera.addChild(this.debug);
      // this.debugText = new PIXI.Text('DEBUG', {fontFamily:"arial", fontSize: "100px", fill:"white"});
      // this.debugText.anchor.set(0.5, 0.5);
      // this.debugText.x = this.gameEngine.worldSettings.width/2;
      // this.debugText.y = this.gameEngine.worldSettings.height/2;
      // this.camera.addChild(this.debugText);

      this.elapsedTime = Date.now(); // debug

      if ('showworldbounds' in _Utils.default.getUrlVars()) {
        var graphics = new PIXI.Graphics();
        graphics.beginFill(0xFFFFFF);
        graphics.alpha = 0.1;
        graphics.drawRect(0, 0, this.gameEngine.worldSettings.width, this.gameEngine.worldSettings.height);
        this.camera.addChild(graphics);
      }
    }
  }, {
    key: "setRendererSize",
    value: function setRendererSize() {
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
  }, {
    key: "draw",
    value: function draw(t, dt) {
      _get(_getPrototypeOf(SpaaaceRenderer.prototype), "draw", this).call(this, t, dt);

      var now = Date.now();
      if (!this.isReady) return; // assets might not have been loaded yet

      var worldWidth = this.gameEngine.worldSettings.width;
      var worldHeight = this.gameEngine.worldSettings.height;
      var viewportSeesRightBound = this.camera.x < this.viewportWidth - worldWidth;
      var viewportSeesLeftBound = this.camera.x > 0;
      var viewportSeesTopBound = this.camera.y > 0;
      var viewportSeesBottomBound = this.camera.y < this.viewportHeight - worldHeight;

      var _arr = Object.keys(this.sprites);

      for (var _i = 0; _i < _arr.length; _i++) {
        var objId = _arr[_i];
        var objData = this.gameEngine.world.objects[objId];
        var sprite = this.sprites[objId];

        if (objData) {
          // if the object requests a "showThrust" then invoke it in the actor
          if (sprite.actor && sprite.actor.thrustEmitter) {
            sprite.actor.thrustEmitter.emit = !!objData.showThrust;
          }

          if (objData instanceof _Ship.default && sprite != this.playerShip) {
            this.updateOffscreenIndicator(objData);
          }

          sprite.x = objData.position.x;
          sprite.y = objData.position.y;

          if (objData instanceof _Ship.default) {
            sprite.actor.shipContainerSprite.rotation = this.gameEngine.world.objects[objId].angle * Math.PI / 180;
          } else {
            sprite.rotation = this.gameEngine.world.objects[objId].angle * Math.PI / 180;
          } // make the wraparound seamless for objects other than the player ship


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
        } // this.emit("postDraw");

      }

      var cameraTarget;

      if (this.playerShip) {
        cameraTarget = this.playerShip; // this.cameraRoam = false;
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
          var lookingAtDeltaX = cameraTarget.x - this.lookingAt.x;
          var lookingAtDeltaY = cameraTarget.y - this.lookingAt.y;
          var cameraTempTargetX;
          var cameraTempTargetY;

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

      var bgOffsetX = this.bgPhaseX * worldWidth + this.camera.x;
      var bgOffsetY = this.bgPhaseY * worldHeight + this.camera.y;
      this.bg1.tilePosition.x = bgOffsetX * 0.01;
      this.bg1.tilePosition.y = bgOffsetY * 0.01;
      this.bg2.tilePosition.x = bgOffsetX * 0.04;
      this.bg2.tilePosition.y = bgOffsetY * 0.04;
      this.bg3.tilePosition.x = bgOffsetX * 0.3;
      this.bg3.tilePosition.y = bgOffsetY * 0.3;
      this.bg4.tilePosition.x = bgOffsetX * 0.75;
      this.bg4.tilePosition.y = bgOffsetY * 0.75;
      this.elapsedTime = now; // Render the stage

      this.renderer.render(this.stage);
    }
  }, {
    key: "addPlayerShip",
    value: function addPlayerShip(sprite) {
      this.playerShip = sprite;
      sprite.actor.shipSprite.tint = 0XFF00FF; // color  player ship

      document.body.classList.remove('lostGame');

      if (!document.body.classList.contains('tutorialDone')) {
        document.body.classList.add('tutorial');
      }

      document.body.classList.remove('lostGame');
      document.body.classList.add('gameActive');
      document.querySelector('#tryAgain').disabled = true;
      document.querySelector('#joinGame').disabled = true;
      document.querySelector('#joinGame').style.opacity = 0;
      this.gameStarted = true; // todo state shouldn't be saved in the renderer
      // remove the tutorial if required after a timeout

      setTimeout(function () {
        document.body.classList.remove('tutorial');
      }, 10000);
    }
    /**
     * Centers the viewport on a coordinate in the gameworld
     * @param {Number} targetX
     * @param {Number} targetY
     */

  }, {
    key: "centerCamera",
    value: function centerCamera(targetX, targetY) {
      if (isNaN(targetX) || isNaN(targetY)) return;

      if (!this.lastCameraPosition) {
        this.lastCameraPosition = {};
      }

      this.lastCameraPosition.x = this.camera.x;
      this.lastCameraPosition.y = this.camera.y;
      this.camera.x = this.viewportWidth / 2 - targetX;
      this.camera.y = this.viewportHeight / 2 - targetY;
      this.lookingAt.x = targetX;
      this.lookingAt.y = targetY;
    }
  }, {
    key: "addOffscreenIndicator",
    value: function addOffscreenIndicator(objData) {
      var container = document.querySelector('#offscreenIndicatorContainer');
      var indicatorEl = document.createElement('div');
      indicatorEl.setAttribute('id', 'offscreenIndicator' + objData.id);
      indicatorEl.classList.add('offscreenIndicator');
      container.appendChild(indicatorEl);
    }
  }, {
    key: "updateOffscreenIndicator",
    value: function updateOffscreenIndicator(objData) {
      // player ship might have been destroyed
      if (!this.playerShip) return;
      var indicatorEl = document.querySelector('#offscreenIndicator' + objData.id);

      if (!indicatorEl) {
        console.error("No indicatorEl found with id ".concat(objData.id));
        return;
      }

      var playerShipObj = this.gameEngine.world.objects[this.playerShip.id];
      var slope = (objData.position.y - playerShipObj.position.y) / (objData.position.x - playerShipObj.position.x);
      var b = this.viewportHeight / 2;
      var padding = 30;
      var indicatorPos = {
        x: 0,
        y: 0
      };

      if (objData.position.y < playerShipObj.position.y - this.viewportHeight / 2) {
        indicatorPos.x = this.viewportWidth / 2 + (padding - b) / slope;
        indicatorPos.y = padding;
      } else if (objData.position.y > playerShipObj.position.y + this.viewportHeight / 2) {
        indicatorPos.x = this.viewportWidth / 2 + (this.viewportHeight - padding - b) / slope;
        indicatorPos.y = this.viewportHeight - padding;
      }

      if (objData.position.x < playerShipObj.position.x - this.viewportWidth / 2) {
        indicatorPos.x = padding;
        indicatorPos.y = slope * (-this.viewportWidth / 2 + padding) + b;
      } else if (objData.position.x > playerShipObj.position.x + this.viewportWidth / 2) {
        indicatorPos.x = this.viewportWidth - padding;
        indicatorPos.y = slope * (this.viewportWidth / 2 - padding) + b;
      }

      if (indicatorPos.x == 0 && indicatorPos.y == 0) {
        indicatorEl.style.opacity = 0;
      } else {
        indicatorEl.style.opacity = 1;
        var rotation = Math.atan2(objData.position.y - playerShipObj.position.y, objData.position.x - playerShipObj.position.x);
        rotation = rotation * 180 / Math.PI; // rad2deg

        indicatorEl.style.transform = "translateX(".concat(indicatorPos.x, "px) translateY(").concat(indicatorPos.y, "px) rotate(").concat(rotation, "deg) ");
      }
    }
  }, {
    key: "removeOffscreenIndicator",
    value: function removeOffscreenIndicator(objData) {
      var indicatorEl = document.querySelector('#offscreenIndicator' + objData.id);
      if (indicatorEl && indicatorEl.parentNode) indicatorEl.parentNode.removeChild(indicatorEl);
    }
  }, {
    key: "updateHUD",
    value: function updateHUD(data) {
      if (data.RTT) {
        qs('.latencyData').innerHTML = data.RTT;
      }

      if (data.RTTAverage) {
        qs('.averageLatencyData').innerHTML = truncateDecimals(data.RTTAverage, 2);
      }
    }
  }, {
    key: "updateScore",
    value: function updateScore(data) {
      var scoreContainer = qs('.score');
      var scoreArray = []; // remove score lines with objects that don't exist anymore

      var scoreEls = scoreContainer.querySelectorAll('.line');

      for (var x = 0; x < scoreEls.length; x++) {
        if (data[scoreEls[x].dataset.objId] == null) {
          scoreEls[x].parentNode.removeChild(scoreEls[x]);
        }
      }

      var _arr2 = Object.keys(data);

      for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
        var id = _arr2[_i2];
        var scoreEl = scoreContainer.querySelector("[data-obj-id='".concat(id, "']")); // create score line if it doesn't exist

        if (scoreEl == null) {
          scoreEl = document.createElement('div');
          scoreEl.classList.add('line');
          if (this.playerShip && this.playerShip.id == parseInt(id)) scoreEl.classList.add('you');
          scoreEl.dataset.objId = id;
          scoreContainer.appendChild(scoreEl);
        } // stupid string/number conversion


        if (this.sprites[parseInt(id)]) this.sprites[parseInt(id)].actor.changeName(data[id].name);
        scoreEl.innerHTML = "".concat(data[id].name, ": ").concat(data[id].kills);
        scoreArray.push({
          el: scoreEl,
          data: data[id]
        });
      }

      scoreArray.sort(function (a, b) {
        return a.data.kills < b.data.kills;
      });

      for (var _x = 0; _x < scoreArray.length; _x++) {
        scoreArray[_x].el.style.transform = "translateY(".concat(_x, "rem)");
      }
    }
  }, {
    key: "onKeyChange",
    value: function onKeyChange(e) {
      if (this.playerShip) {
        if (e.keyName === 'up') {
          this.playerShip.actor.thrustEmitter.emit = e.isDown;
        }
      }
    }
  }, {
    key: "enableFullScreen",
    value: function enableFullScreen() {
      var isInFullScreen = document.fullScreenElement && document.fullScreenElement !== null || // alternative standard method
      document.mozFullScreen || document.webkitIsFullScreen; // iOS fullscreen generates user warnings

      if (isIPhoneIPad()) return;
      var docElm = document.documentElement;

      if (!isInFullScreen) {
        if (docElm.requestFullscreen) {
          docElm.requestFullscreen();
        } else if (docElm.mozRequestFullScreen) {
          docElm.mozRequestFullScreen();
        } else if (docElm.webkitRequestFullScreen) {// NOTE: disabled on iOS/Safari, because it generated a
          // phishing warning.
          // docElm.webkitRequestFullScreen();
        }
      }
    }
    /*
     * Takes in game coordinates and translates them into screen coordinates
     * @param obj an object with x and y properties
     */

  }, {
    key: "gameCoordsToScreen",
    value: function gameCoordsToScreen(obj) {
      // console.log(obj.x , this.viewportWidth / 2 , this.camera.x)
      return {
        x: obj.position.x + this.camera.x,
        y: obj.position.y + this.camera.y
      };
    }
  }]);

  return SpaaaceRenderer;
}(_lanceGg.Renderer);

exports.default = SpaaaceRenderer;

function getCentroid(objects) {
  var maxDistance = 500; // max distance to add to the centroid

  var shipCount = 0;
  var centroid = {
    x: 0,
    y: 0
  };
  var selectedShip = null;

  var _arr3 = Object.keys(objects);

  for (var _i3 = 0; _i3 < _arr3.length; _i3++) {
    var id = _arr3[_i3];
    var obj = objects[id];

    if (obj instanceof _Ship.default) {
      if (selectedShip == null) selectedShip = obj;
      var objDistance = Math.sqrt(Math.pow(selectedShip.position.x - obj.position.y, 2) + Math.pow(selectedShip.position.y - obj.position.y, 2));

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
} // convenience function


function qs(selector) {
  return document.querySelector(selector);
}

function truncateDecimals(number, digits) {
  var multiplier = Math.pow(10, digits);
  var adjustedNum = number * multiplier;
  var truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);
  return truncatedNum / multiplier;
}

;

function isMacintosh() {
  return navigator.platform.indexOf('Mac') > -1;
}

function isWindows() {
  return navigator.platform.indexOf('Win') > -1;
}

function isIPhoneIPad() {
  return navigator.platform.match(/i(Phone|Pod)/i) !== null;
}
//# sourceMappingURL=SpaaaceRenderer.js.map