"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _howler = _interopRequireDefault(require("howler"));

var _lanceGg = require("lance-gg");

var _SpaaaceRenderer = _interopRequireDefault(require("../client/SpaaaceRenderer"));

var _MobileControls = _interopRequireDefault(require("./MobileControls"));

var _Ship = _interopRequireDefault(require("../common/Ship"));

var _Utils = _interopRequireDefault(require("../common/Utils"));

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

var SpaaaceClientEngine =
/*#__PURE__*/
function (_ClientEngine) {
  _inherits(SpaaaceClientEngine, _ClientEngine);

  function SpaaaceClientEngine(gameEngine, options) {
    _classCallCheck(this, SpaaaceClientEngine);

    return _possibleConstructorReturn(this, _getPrototypeOf(SpaaaceClientEngine).call(this, gameEngine, options, _SpaaaceRenderer.default));
  }

  _createClass(SpaaaceClientEngine, [{
    key: "start",
    value: function start() {
      var _this = this;

      _get(_getPrototypeOf(SpaaaceClientEngine.prototype), "start", this).call(this); // handle gui for game condition


      this.gameEngine.on('objectDestroyed', function (obj) {
        if (obj instanceof _Ship.default && _this.gameEngine.isOwnedByPlayer(obj)) {
          document.body.classList.add('lostGame');
          document.querySelector('#tryAgain').disabled = false;
        }
      });
      this.gameEngine.once('renderer.ready', function () {
        // click event for "try again" button
        document.querySelector('#tryAgain').addEventListener('click', function () {
          if (_Utils.default.isTouchDevice()) {
            _this.renderer.enableFullScreen();
          }

          _this.socket.emit('requestRestart');
        });
        document.querySelector('#joinGame').addEventListener('click', function (clickEvent) {
          if (_Utils.default.isTouchDevice()) {
            _this.renderer.enableFullScreen();
          }

          clickEvent.currentTarget.disabled = true;

          _this.socket.emit('requestRestart');
        });
        document.querySelector('#reconnect').addEventListener('click', function () {
          window.location.reload();
        }); //  Game input

        if (_Utils.default.isTouchDevice()) {
          _this.controls = new _MobileControls.default(_this);

          _this.controls.on('fire', function () {
            _this.sendInput('space');
          });
        } else {
          _this.controls = new _lanceGg.KeyboardControls(_this);

          _this.controls.bindKey('left', 'left', {
            repeat: true
          });

          _this.controls.bindKey('right', 'right', {
            repeat: true
          });

          _this.controls.bindKey('up', 'up', {
            repeat: true
          });

          _this.controls.bindKey('space', 'space');
        }
      }); // allow a custom path for sounds

      var assetPathPrefix = this.options.assetPathPrefix ? this.options.assetPathPrefix : ''; // handle sounds

      this.sounds = {
        missileHit: new Howl({
          src: [assetPathPrefix + 'assets/audio/193429__unfa__projectile-hit.mp3']
        }),
        fireMissile: new Howl({
          src: [assetPathPrefix + 'assets/audio/248293__chocobaggy__weird-laser-gun.mp3']
        })
      };
      this.gameEngine.on('fireMissile', function () {
        _this.sounds.fireMissile.play();
      });
      this.gameEngine.on('missileHit', function () {
        // don't play explosion sound if the player is not in game
        if (_this.renderer.playerShip) {
          _this.sounds.missileHit.play();
        }
      });
      this.networkMonitor.on('RTTUpdate', function (e) {
        _this.renderer.updateHUD(e);
      });
    } // extend ClientEngine connect to add own events

  }, {
    key: "connect",
    value: function connect() {
      var _this2 = this;

      return _get(_getPrototypeOf(SpaaaceClientEngine.prototype), "connect", this).call(this).then(function () {
        _this2.socket.on('scoreUpdate', function (e) {
          _this2.renderer.updateScore(e);
        });

        _this2.socket.on('disconnect', function (e) {
          console.log('disconnected');
          document.body.classList.add('disconnected');
          document.body.classList.remove('gameActive');
          document.querySelector('#reconnect').disabled = false;
        });

        if ('autostart' in _Utils.default.getUrlVars()) {
          _this2.socket.emit('requestRestart');
        }
      });
    }
  }]);

  return SpaaaceClientEngine;
}(_lanceGg.ClientEngine);

exports.default = SpaaaceClientEngine;
//# sourceMappingURL=SpaaaceClientEngine.js.map