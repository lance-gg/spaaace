"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lanceGg = require("lance-gg");

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

var nameGenerator = require('./NameGenerator');

var NUM_BOTS = 3;

var SpaaaceServerEngine =
/*#__PURE__*/
function (_ServerEngine) {
  _inherits(SpaaaceServerEngine, _ServerEngine);

  function SpaaaceServerEngine(io, gameEngine, inputOptions) {
    var _this;

    _classCallCheck(this, SpaaaceServerEngine);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SpaaaceServerEngine).call(this, io, gameEngine, inputOptions));
    _this.scoreData = {};
    return _this;
  } // when the game starts, create robot spaceships, and register
  // on missile-hit events


  _createClass(SpaaaceServerEngine, [{
    key: "start",
    value: function start() {
      var _this2 = this;

      _get(_getPrototypeOf(SpaaaceServerEngine.prototype), "start", this).call(this);

      for (var x = 0; x < NUM_BOTS; x++) {
        this.makeBot();
      }

      this.gameEngine.on('missileHit', function (e) {
        // add kills
        if (_this2.scoreData[e.missile.ownerId]) _this2.scoreData[e.missile.ownerId].kills++; // remove score data for killed ship

        delete _this2.scoreData[e.ship.id];

        _this2.updateScore();

        console.log("ship killed: ".concat(e.ship.toString()));

        _this2.gameEngine.removeObjectFromWorld(e.ship.id);

        if (e.ship.isBot) {
          setTimeout(function () {
            return _this2.makeBot();
          }, 5000);
        }
      });
    } // a player has connected

  }, {
    key: "onPlayerConnected",
    value: function onPlayerConnected(socket) {
      var _this3 = this;

      _get(_getPrototypeOf(SpaaaceServerEngine.prototype), "onPlayerConnected", this).call(this, socket);

      var makePlayerShip = function makePlayerShip() {
        var ship = _this3.gameEngine.makeShip(socket.playerId);

        _this3.scoreData[ship.id] = {
          kills: 0,
          name: nameGenerator('general')
        };

        _this3.updateScore();
      }; // handle client restart requests


      socket.on('requestRestart', makePlayerShip);
    } // a player has disconnected

  }, {
    key: "onPlayerDisconnected",
    value: function onPlayerDisconnected(socketId, playerId) {
      var _this4 = this;

      _get(_getPrototypeOf(SpaaaceServerEngine.prototype), "onPlayerDisconnected", this).call(this, socketId, playerId); // iterate through all objects, delete those that are associated with the player (ship and missiles)


      var playerObjects = this.gameEngine.world.queryObjects({
        playerId: playerId
      });
      playerObjects.forEach(function (obj) {
        _this4.gameEngine.removeObjectFromWorld(obj.id); // remove score associated with this ship


        delete _this4.scoreData[obj.id];
      });
      this.updateScore();
    } // create a robot spaceship

  }, {
    key: "makeBot",
    value: function makeBot() {
      var bot = this.gameEngine.makeShip(0);
      bot.attachAI();
      this.scoreData[bot.id] = {
        kills: 0,
        name: nameGenerator('general') + 'Bot'
      };
      this.updateScore();
    }
  }, {
    key: "updateScore",
    value: function updateScore() {
      var _this5 = this;

      // delay so player socket can catch up
      setTimeout(function () {
        _this5.io.sockets.emit('scoreUpdate', _this5.scoreData);
      }, 1000);
    }
  }]);

  return SpaaaceServerEngine;
}(_lanceGg.ServerEngine);

exports.default = SpaaaceServerEngine;
//# sourceMappingURL=SpaaaceServerEngine.js.map