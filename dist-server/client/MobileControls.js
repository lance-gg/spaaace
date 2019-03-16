"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _eventEmitter = _interopRequireDefault(require("event-emitter"));

var _Utils = _interopRequireDefault(require("../common/Utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * This class handles touch device controls
 */
var MobileControls =
/*#__PURE__*/
function () {
  function MobileControls(clientEngine) {
    var _this = this;

    _classCallCheck(this, MobileControls);

    Object.assign(this, _eventEmitter.default.prototype);
    this.clientEngine = clientEngine;
    this.renderer = clientEngine.renderer;
    this.touchContainer = document.querySelector('.pixiContainer');
    this.setupListeners();
    this.activeInput = {
      up: false,
      left: false,
      right: false
    };

    var onRequestAnimationFrame = function onRequestAnimationFrame() {
      _this.handleMovementInput();

      window.requestAnimationFrame(onRequestAnimationFrame);
    };

    onRequestAnimationFrame();
    this.clientEngine.gameEngine.on('client__preStep', function () {
      for (var keyName in _this.activeInput) {
        if (_this.activeInput[keyName]) {
          _this.clientEngine.sendInput(keyName);
        }
      }
    });
  }

  _createClass(MobileControls, [{
    key: "setupListeners",
    value: function setupListeners() {
      var _this2 = this;

      var touchHandler = function touchHandler(e) {
        // If there's exactly one finger inside this element
        var touch = e.targetTouches[0];
        _this2.currentTouch = {
          x: touch.pageX,
          y: touch.pageY
        };

        if (e.type === 'touchstart' && e.targetTouches[1]) {
          _this2.emit('fire');
        }
      };

      this.touchContainer.addEventListener('touchstart', touchHandler, false);
      this.touchContainer.addEventListener('touchmove', function (e) {
        touchHandler(e); // if ingame prevent scrolling

        if (_this2.renderer.playerShip) {
          e.preventDefault();
        }
      }, false);
      this.touchContainer.addEventListener('touchend', function (e) {
        _this2.currentTouch = false;
        _this2.activeInput.up = false;
        _this2.activeInput.left = false;
        _this2.activeInput.right = false;

        _this2.renderer.onKeyChange({
          keyName: 'up',
          isDown: false
        });
      }, false);
      document.querySelector('.fireButton').addEventListener('click', function () {
        _this2.emit('fire');
      });
    }
  }, {
    key: "handleMovementInput",
    value: function handleMovementInput() {
      // no touch, no movement
      if (!this.currentTouch) return; // by default no touch

      this.activeInput.right = false;
      this.activeInput.left = false;
      this.activeInput.up = false;
      var playerShip = this.renderer.playerShip; // no player ship, no movement

      if (!playerShip) return;
      var playerShipScreenCoords = this.renderer.gameCoordsToScreen(playerShip);
      var dx = this.currentTouch.x - playerShipScreenCoords.x;
      var dy = this.currentTouch.y - playerShipScreenCoords.y;

      var shortestArc = _Utils.default.shortestArc(Math.atan2(dx, -dy), Math.atan2(Math.sin(playerShip.actor.shipContainerSprite.rotation + Math.PI / 2), Math.cos(playerShip.actor.shipContainerSprite.rotation + Math.PI / 2)));

      var rotateThreshold = 0.3;
      var distanceThreshold = 120; // turn left or right

      if (shortestArc > rotateThreshold) {
        this.activeInput.left = true;
        this.activeInput.right = false;
      } else if (shortestArc < -rotateThreshold) {
        this.activeInput.right = true;
        this.activeInput.left = false;
      } // don't turn if too close


      if (Math.sqrt(dx * dx + dy * dy) > distanceThreshold) {
        this.activeInput.up = true;
        this.renderer.onKeyChange({
          keyName: 'up',
          isDown: true
        });
      } else {
        this.renderer.onKeyChange({
          keyName: 'up',
          isDown: false
        });
      }
    }
  }]);

  return MobileControls;
}();

exports.default = MobileControls;
//# sourceMappingURL=MobileControls.js.map