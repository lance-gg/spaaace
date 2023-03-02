"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _lanceGg = require("lance-gg");
var _Ship = _interopRequireDefault(require("./Ship"));
var _Missile = _interopRequireDefault(require("./Missile"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }
function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
var SpaaaceGameEngine = /*#__PURE__*/function (_GameEngine) {
  _inherits(SpaaaceGameEngine, _GameEngine);
  var _super = _createSuper(SpaaaceGameEngine);
  function SpaaaceGameEngine(options) {
    var _this;
    _classCallCheck(this, SpaaaceGameEngine);
    _this = _super.call(this, options);
    _this.physicsEngine = new _lanceGg.SimplePhysicsEngine({
      gameEngine: _assertThisInitialized(_this),
      collisions: {
        type: "brute",
        collisionDistance: 28
      }
    });
    return _this;
  }
  _createClass(SpaaaceGameEngine, [{
    key: "registerClasses",
    value: function registerClasses(serializer) {
      serializer.registerClass(_Ship["default"]);
      serializer.registerClass(_Missile["default"]);
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
      this.on("collisionStart", function (e) {
        var collisionObjects = Object.keys(e).map(function (k) {
          return e[k];
        });
        var ship = collisionObjects.find(function (o) {
          return o instanceof _Ship["default"];
        });
        var missile = collisionObjects.find(function (o) {
          return o instanceof _Missile["default"];
        });
        if (!ship || !missile) return;

        // make sure not to process the collision between a missile and the ship that fired it
        if (missile.playerId !== ship.playerId) {
          _this2.destroyMissile(missile.id);
          _this2.trace.info(function () {
            return "missile by ship=".concat(missile.playerId, " hit ship=").concat(ship.id);
          });
          _this2.emit("missileHit", {
            missile: missile,
            ship: ship
          });
        }
      });
      this.on("postStep", this.reduceVisibleThrust.bind(this));
    }
  }, {
    key: "processInput",
    value: function processInput(inputData, playerId, isServer) {
      _get(_getPrototypeOf(SpaaaceGameEngine.prototype), "processInput", this).call(this, inputData, playerId);

      // get the player ship tied to the player socket
      var playerShip = this.world.queryObject({
        playerId: playerId,
        instanceType: _Ship["default"]
      });
      if (playerShip) {
        if (inputData.input == "up") {
          playerShip.accelerate(0.05);
          playerShip.showThrust = 5; // show thrust for next steps.
        } else if (inputData.input == "right") {
          playerShip.turnRight(2.5);
        } else if (inputData.input == "left") {
          playerShip.turnLeft(2.5);
        } else if (inputData.input == "space") {
          this.makeMissile(playerShip, inputData.messageIndex);
          this.emit("fireMissile");
        }
      }
    }

    // Makes a new ship, places it randomly and adds it to the game world
  }, {
    key: "makeShip",
    value: function makeShip(playerId) {
      var newShipX = Math.floor(Math.random() * (this.worldSettings.width - 200)) + 200;
      var newShipY = Math.floor(Math.random() * (this.worldSettings.height - 200)) + 200;
      var ship = new _Ship["default"](this, null, {
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
      var missile = new _Missile["default"](this);

      // we want the missile location and velocity to correspond to that of the ship firing it
      missile.position.copy(playerShip.position);
      missile.velocity.copy(playerShip.velocity);
      missile.angle = playerShip.angle;
      missile.playerId = playerShip.playerId;
      missile.ownerId = playerShip.id;
      missile.roomName = playerShip._roomName;
      missile._roomName = playerShip._roomName;
      missile.inputId = inputId; // this enables usage of the missile shadow object
      missile.velocity.x += Math.cos(missile.angle * (Math.PI / 180)) * 10;
      missile.velocity.y += Math.sin(missile.angle * (Math.PI / 180)) * 10;
      this.trace.trace(function () {
        return "missile[".concat(missile.id, "] created vel=").concat(missile.velocity);
      });
      var obj = this.addObjectToWorld(missile);

      // if the object was added successfully to the game world, destroy the missile after some game ticks
      if (obj) this.timer.add(30, this.destroyMissile, this, [obj.id]);
      return missile;
    }

    // destroy the missile if it still exists
  }, {
    key: "destroyMissile",
    value: function destroyMissile(missileId) {
      if (this.world.objects[missileId]) {
        this.trace.trace(function () {
          return "missile[".concat(missileId, "] destroyed");
        });
        this.removeObjectFromWorld(missileId);
      }
    }

    // at the end of the step, reduce the thrust for all objects
  }, {
    key: "reduceVisibleThrust",
    value: function reduceVisibleThrust(postStepEv) {
      if (postStepEv.isReenact) return;
      var ships = this.world.queryObjects({
        instanceType: _Ship["default"]
      });
      ships.forEach(function (ship) {
        if (Number.isInteger(ship.showThrust) && ship.showThrust >= 1) ship.showThrust--;
      });
    }
  }]);
  return SpaaaceGameEngine;
}(_lanceGg.GameEngine);
exports["default"] = SpaaaceGameEngine;
//# sourceMappingURL=SpaaaceGameEngine.js.map