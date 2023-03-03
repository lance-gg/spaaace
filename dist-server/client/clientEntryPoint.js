"use strict";

var _queryString = _interopRequireDefault(require("query-string"));

var _lanceGg = require("lance-gg");

var _SpaaaceClientEngine = _interopRequireDefault(require("./SpaaaceClientEngine"));

var _SpaaaceGameEngine = _interopRequireDefault(require("../common/SpaaaceGameEngine"));

require("../../dist/assets/sass/main.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var qsOptions = _queryString["default"].parse(location.search); // sent to both game engine and client engine


var defaults = {
  traceLevel: _lanceGg.Lib.Trace.TRACE_NONE,
  delayInputCount: 8,
  scheduler: 'render-schedule',
  syncOptions: {
    sync: qsOptions.sync || 'extrapolate',
    localObjBending: 0.2,
    remoteObjBending: 0.5
  }
};
var options = Object.assign(defaults, qsOptions); // create a client engine and a game engine

var gameEngine = new _SpaaaceGameEngine["default"](options);
var clientEngine = new _SpaaaceClientEngine["default"](gameEngine, options);
clientEngine.start();
//# sourceMappingURL=clientEntryPoint.js.map