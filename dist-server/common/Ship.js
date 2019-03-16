"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lanceGg = require("lance-gg");

var _ShipActor = _interopRequireDefault(require("../client/ShipActor"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Ship =
/*#__PURE__*/
function (_DynamicObject) {
  _inherits(Ship, _DynamicObject);

  function Ship(gameEngine, options, props) {
    var _this;

    _classCallCheck(this, Ship);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Ship).call(this, gameEngine, options, props));
    _this.showThrust = 0;
    return _this;
  }

  _createClass(Ship, [{
    key: "onAddToWorld",
    value: function onAddToWorld(gameEngine) {
      if (_lanceGg.Renderer) {
        var renderer = _lanceGg.Renderer.getInstance();

        var shipActor = new _ShipActor.default(renderer);
        var sprite = shipActor.sprite;
        renderer.sprites[this.id] = sprite;
        sprite.id = this.id;
        sprite.position.set(this.position.x, this.position.y);
        renderer.layer2.addChild(sprite);

        if (gameEngine.isOwnedByPlayer(this)) {
          renderer.addPlayerShip(sprite);
        } else {
          renderer.addOffscreenIndicator(this);
        }
      }
    }
  }, {
    key: "onRemoveFromWorld",
    value: function onRemoveFromWorld(gameEngine) {
      var _this2 = this;

      if (this.fireLoop) {
        this.fireLoop.destroy();
      }

      if (this.onPreStep) {
        this.gameEngine.removeListener('preStep', this.onPreStep);
        this.onPreStep = null;
      }

      if (_lanceGg.Renderer) {
        var renderer = _lanceGg.Renderer.getInstance();

        if (gameEngine.isOwnedByPlayer(this)) {
          renderer.playerShip = null;
        } else {
          renderer.removeOffscreenIndicator(this);
        }

        var sprite = renderer.sprites[this.id];

        if (sprite) {
          if (sprite.actor) {
            // removal "takes time"
            sprite.actor.destroy().then(function () {
              delete renderer.sprites[_this2.id];
            });
          } else {
            sprite.destroy();
            delete renderer.sprites[this.id];
          }
        }
      }
    } // no bending corrections on angle needed, angle is deterministic
    // position correction if less than world width/height

  }, {
    key: "toString",
    value: function toString() {
      return "".concat(this.isBot ? 'Bot' : 'Player', "::Ship::").concat(_get(_getPrototypeOf(Ship.prototype), "toString", this).call(this));
    }
  }, {
    key: "syncTo",
    value: function syncTo(other) {
      _get(_getPrototypeOf(Ship.prototype), "syncTo", this).call(this, other);

      this.showThrust = other.showThrust;
    }
  }, {
    key: "destroy",
    value: function destroy() {}
  }, {
    key: "attachAI",
    value: function attachAI() {
      var _this3 = this;

      this.isBot = true;

      this.onPreStep = function () {
        _this3.steer();
      };

      this.gameEngine.on('preStep', this.onPreStep);
      var fireLoopTime = Math.round(250 + Math.random() * 100);
      this.fireLoop = this.gameEngine.timer.loop(fireLoopTime, function () {
        if (_this3.target && _this3.distanceToTargetSquared(_this3.target) < 160000) {
          _this3.gameEngine.makeMissile(_this3);
        }
      });
    }
  }, {
    key: "shortestVector",
    value: function shortestVector(p1, p2, wrapDist) {
      var d = Math.abs(p2 - p1);
      if (d > Math.abs(p2 + wrapDist - p1)) p2 += wrapDist;else if (d > Math.abs(p1 + wrapDist - p2)) p1 += wrapDist;
      return p2 - p1;
    }
  }, {
    key: "distanceToTargetSquared",
    value: function distanceToTargetSquared(target) {
      var dx = this.shortestVector(this.position.x, target.position.x, this.gameEngine.worldSettings.width);
      var dy = this.shortestVector(this.position.y, target.position.y, this.gameEngine.worldSettings.height);
      return dx * dx + dy * dy;
    }
  }, {
    key: "steer",
    value: function steer() {
      var closestTarget = null;
      var closestDistance2 = Infinity;

      var _arr = Object.keys(this.gameEngine.world.objects);

      for (var _i = 0; _i < _arr.length; _i++) {
        var objId = _arr[_i];
        var obj = this.gameEngine.world.objects[objId];

        if (obj != this) {
          var distance2 = this.distanceToTargetSquared(obj);

          if (distance2 < closestDistance2) {
            closestTarget = obj;
            closestDistance2 = distance2;
          }
        }
      }

      this.target = closestTarget;

      if (this.target) {
        var newVX = this.shortestVector(this.position.x, this.target.position.x, this.gameEngine.worldSettings.width);
        var newVY = this.shortestVector(this.position.y, this.target.position.y, this.gameEngine.worldSettings.height);
        var angleToTarget = Math.atan2(newVX, newVY) / Math.PI * 180;
        angleToTarget *= -1;
        angleToTarget += 90; // game uses zero angle on the right, clockwise

        if (angleToTarget < 0) angleToTarget += 360;
        var turnRight = this.shortestVector(this.angle, angleToTarget, 360);

        if (turnRight > 4) {
          this.turnRight(2.5);
        } else if (turnRight < -4) {
          this.turnLeft(2.5);
        } else {
          this.accelerate(0.05);
          this.showThrust = 5;
        }
      }
    }
  }, {
    key: "maxSpeed",
    get: function get() {
      return 3.0;
    }
  }, {
    key: "bending",
    get: function get() {
      return {
        angleLocal: {
          percent: 0.0
        },
        position: {
          max: 500.0
        }
      };
    }
  }], [{
    key: "netScheme",
    get: function get() {
      return Object.assign({
        showThrust: {
          type: _lanceGg.BaseTypes.TYPES.INT32
        }
      }, _get(_getPrototypeOf(Ship), "netScheme", this));
    }
  }]);

  return Ship;
}(_lanceGg.DynamicObject);

exports.default = Ship;
//# sourceMappingURL=Ship.js.map