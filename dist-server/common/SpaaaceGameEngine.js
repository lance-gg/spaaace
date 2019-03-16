"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lanceGg = require("lance-gg");

var _Ship = _interopRequireDefault(require("./Ship"));

var _Missile = _interopRequireDefault(require("./Missile"));

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

var SpaaaceGameEngine =
/*#__PURE__*/
function (_GameEngine) {
  _inherits(SpaaaceGameEngine, _GameEngine);

  function SpaaaceGameEngine(options) {
    var _this;

    _classCallCheck(this, SpaaaceGameEngine);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SpaaaceGameEngine).call(this, options));
    _this.physicsEngine = new _lanceGg.SimplePhysicsEngine({
      gameEngine: _assertThisInitialized(_this),
      collisions: {
        type: 'brute',
        collisionDistance: 28
      }
    });
    return _this;
  }

  _createClass(SpaaaceGameEngine, [{
    key: "registerClasses",
    value: function registerClasses(serializer) {
      serializer.registerClass(_Ship.default);
      serializer.registerClass(_Missile.default);
    }
  }, {
    key: "initWorld",
    value: function initWorld() {
      _get(_getPrototypeOf(SpaaaceGameEngine.prototype), "initWorld", this).call(this, {
        worldWrap: true,
        width: 3000,
        height: 3000
      });
    }
  }, {
    key: "start",
    value: function start() {
      var _this2 = this;

      _get(_getPrototypeOf(SpaaaceGameEngine.prototype), "start", this).call(this);

      this.on('collisionStart', function (e) {
        var collisionObjects = Object.keys(e).map(function (k) {
          return e[k];
        });
        var ship = collisionObjects.find(function (o) {
          return o instanceof _Ship.default;
        });
        var missile = collisionObjects.find(function (o) {
          return o instanceof _Missile.default;
        });
        if (!ship || !missile) return; // make sure not to process the collision between a missile and the ship that fired it

        if (missile.playerId !== ship.playerId) {
          _this2.destroyMissile(missile.id);

          _this2.trace.info(function () {
            return "missile by ship=".concat(missile.playerId, " hit ship=").concat(ship.id);
          });

          _this2.emit('missileHit', {
            missile: missile,
            ship: ship
          });
        }
      });
      this.on('postStep', this.reduceVisibleThrust.bind(this));
    }
  }, {
    key: "processInput",
    value: function processInput(inputData, playerId, isServer) {
      _get(_getPrototypeOf(SpaaaceGameEngine.prototype), "processInput", this).call(this, inputData, playerId); // get the player ship tied to the player socket


      var playerShip = this.world.queryObject({
        playerId: playerId,
        instanceType: _Ship.default
      });

      if (playerShip) {
        if (inputData.input == 'up') {
          playerShip.accelerate(0.05);
          playerShip.showThrust = 5; // show thrust for next steps.
        } else if (inputData.input == 'right') {
          playerShip.turnRight(2.5);
        } else if (inputData.input == 'left') {
          playerShip.turnLeft(2.5);
        } else if (inputData.input == 'space') {
          this.makeMissile(playerShip, inputData.messageIndex);
          this.emit('fireMissile');
        }
      }
    }
  }, {
    key: "makeShip",
    // Makes a new ship, places it randomly and adds it to the game world
    value: function makeShip(playerId) {
      var newShipX = Math.floor(Math.random() * (this.worldSettings.width - 200)) + 200;
      var newShipY = Math.floor(Math.random() * (this.worldSettings.height - 200)) + 200;
      var ship = new _Ship.default(this, null, {
        position: new _lanceGg.TwoVector(newShipX, newShipY)
      });
      ship.playerId = playerId;
      this.addObjectToWorld(ship);
      console.log("ship added: ".concat(ship.toString()));
      return ship;
    }
  }, {
    key: "makeMissile",
    value: function makeMissile(playerShip, inputId) {
      var missile = new _Missile.default(this); // we want the missile location and velocity to correspond to that of the ship firing it

      missile.position.copy(playerShip.position);
      missile.velocity.copy(playerShip.velocity);
      missile.angle = playerShip.angle;
      missile.playerId = playerShip.playerId;
      missile.ownerId = playerShip.id;
      missile.inputId = inputId; // this enables usage of the missile shadow object

      missile.velocity.x += Math.cos(missile.angle * (Math.PI / 180)) * 10;
      missile.velocity.y += Math.sin(missile.angle * (Math.PI / 180)) * 10;
      this.trace.trace(function () {
        return "missile[".concat(missile.id, "] created vel=").concat(missile.velocity);
      });
      var obj = this.addObjectToWorld(missile); // if the object was added successfully to the game world, destroy the missile after some game ticks

      if (obj) this.timer.add(30, this.destroyMissile, this, [obj.id]);
      return missile;
    } // destroy the missile if it still exists

  }, {
    key: "destroyMissile",
    value: function destroyMissile(missileId) {
      if (this.world.objects[missileId]) {
        this.trace.trace(function () {
          return "missile[".concat(missileId, "] destroyed");
        });
        this.removeObjectFromWorld(missileId);
      }
    } // at the end of the step, reduce the thrust for all objects

  }, {
    key: "reduceVisibleThrust",
    value: function reduceVisibleThrust(postStepEv) {
      if (postStepEv.isReenact) return;
      var ships = this.world.queryObjects({
        instanceType: _Ship.default
      });
      ships.forEach(function (ship) {
        if (Number.isInteger(ship.showThrust) && ship.showThrust >= 1) ship.showThrust--;
      });
    }
  }]);

  return SpaaaceGameEngine;
}(_lanceGg.GameEngine);

exports.default = SpaaaceGameEngine;
//# sourceMappingURL=SpaaaceGameEngine.js.map