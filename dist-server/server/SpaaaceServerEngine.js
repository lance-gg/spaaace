"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _RoomManager = require("./RoomManager");

var _lanceGg = require("lance-gg");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var nameGenerator = require("./NameGenerator");

var NUM_BOTS = 0;

var SpaaaceServerEngine = /*#__PURE__*/function (_ServerEngine) {
  _inherits(SpaaaceServerEngine, _ServerEngine);

  var _super = _createSuper(SpaaaceServerEngine);

  function SpaaaceServerEngine(io, gameEngine, inputOptions) {
    var _this;

    _classCallCheck(this, SpaaaceServerEngine);

    _this = _super.call(this, io, gameEngine, inputOptions);
    _this.scoreData = {};
    return _this;
  } // when the game starts, create robot spaceships, and register
  // on missile-hit events


  _createClass(SpaaaceServerEngine, [{
    key: "start",
    value: function start() {
      var _this2 = this;

      _get(_getPrototypeOf(SpaaaceServerEngine.prototype), "start", this).call(this); // Room IDs https://github.com/jungbeomsu/Test/blob/fe9474c67073121937726deb54f0e53eb11eb4c4/src/gameServer/TownServerEngine.js
      // for (let x = 0; x < NUM_BOTS; x++) this.makeBot();


      this.gameEngine.on("missileHit", function (e) {
        // add kills
        var roomName = e.missile.roomName;
        if (_this2.scoreData[roomName][e.missile.ownerId]) _this2.scoreData[roomName][e.missile.ownerId].kills++; // remove score data for killed ship

        delete _this2.scoreData[roomName][e.ship.id];

        _this2.updateScore(); //   console.log(`ship killed: ${e.ship.toString()}`);


        _this2.gameEngine.removeObjectFromWorld(e.ship.id); //   if (e.ship.isBot) {
        //     setTimeout(() => this.makeBot(), 5000);
        //   }

      });
    } // a player has connected

  }, {
    key: "onPlayerConnected",
    value: function onPlayerConnected(socket) {
      _get(_getPrototypeOf(SpaaaceServerEngine.prototype), "onPlayerConnected", this).call(this, socket);

      this.joinRoom(socket);
    }
  }, {
    key: "joinRoom",
    value: function () {
      var _joinRoom = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(socket) {
        var _this3 = this;

        var URL, _yield$getRoomAndUser, roomName, username, makePlayerShip;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                URL = socket.handshake.headers.referer;
                _context.next = 3;
                return (0, _RoomManager.getRoomAndUsername)(URL);

              case 3:
                _yield$getRoomAndUser = _context.sent;
                roomName = _yield$getRoomAndUser.roomName;
                username = _yield$getRoomAndUser.username;
                console.log("roomName", roomName);

                _get(_getPrototypeOf(SpaaaceServerEngine.prototype), "createRoom", this).call(this, roomName);

                _get(_getPrototypeOf(SpaaaceServerEngine.prototype), "assignPlayerToRoom", this).call(this, socket.playerId, roomName);

                this.scoreData[roomName] = this.scoreData[roomName] || {};

                makePlayerShip = function makePlayerShip() {
                  console.log("Rooms", _this3.rooms);

                  var ship = _this3.gameEngine.makeShip(socket.playerId);

                  _this3.assignObjectToRoom(ship, roomName);

                  _this3.scoreData[roomName][ship.id] = {
                    kills: 0,
                    name: username // name: nameGenerator("general"),

                  };

                  _this3.updateScore();
                }; // handle client restart requests


                socket.on("requestRestart", makePlayerShip);

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function joinRoom(_x) {
        return _joinRoom.apply(this, arguments);
      }

      return joinRoom;
    }() // a player has disconnected

  }, {
    key: "onPlayerDisconnected",
    value: function onPlayerDisconnected(socketId, playerId) {
      var _this4 = this;

      _get(_getPrototypeOf(SpaaaceServerEngine.prototype), "onPlayerDisconnected", this).call(this, socketId, playerId); // iterate through all objects, delete those that are associated with the player (ship and missiles)


      var playerObjects = this.gameEngine.world.queryObjects({
        playerId: playerId
      });
      playerObjects.forEach(function (obj) {
        _this4.gameEngine.removeObjectFromWorld(obj.id);

        console.log(obj); //   // remove score associated with this ship

        delete _this4.scoreData[obj._roomName][obj.id];
      });
      this.updateScore();
    } //   // create a robot spaceship
    //   makeBot() {
    //     let bot = this.gameEngine.makeShip(0);
    //     bot.attachAI();
    //     this.scoreData[bot.id] = {
    //       kills: 0,
    //       name: nameGenerator("general") + "Bot",
    //     };
    //     this.updateScore();
    //   }

  }, {
    key: "updateScore",
    value: function updateScore() {
      var _this5 = this;

      // delay so player socket can catch up
      setTimeout(function () {
        _this5.io.sockets.emit("scoreUpdate", _this5.scoreData);
      }, 1000);
    }
  }]);

  return SpaaaceServerEngine;
}(_lanceGg.ServerEngine);

exports["default"] = SpaaaceServerEngine;
//# sourceMappingURL=SpaaaceServerEngine.js.map