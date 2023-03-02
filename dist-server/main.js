"use strict";

var _express = _interopRequireDefault(require("express"));
var _socket = _interopRequireDefault(require("socket.io"));
var _path = _interopRequireDefault(require("path"));
var _lanceGg = require("lance-gg");
var _SpaaaceServerEngine = _interopRequireDefault(require("./server/SpaaaceServerEngine.js"));
var _SpaaaceGameEngine = _interopRequireDefault(require("./common/SpaaaceGameEngine.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
// const url = require("url");
// const querystring = require("querystring");

// Game Server

var PORT = process.env.PORT || 3000;
var INDEX = _path["default"].join(__dirname, "../dist/index.html");

// define routes and socket
var server = (0, _express["default"])();
server.use("/", _express["default"]["static"](_path["default"].join(__dirname, "../dist/")));
server.get("/", function (req, res) {
  res.sendFile(INDEX);
});
var requestHandler = server.listen(PORT, function () {
  return console.log("Listening on ".concat(PORT));
});
var io = (0, _socket["default"])(requestHandler);
// Game Instances
var gameEngine = new _SpaaaceGameEngine["default"]({
  traceLevel: _lanceGg.Lib.Trace.TRACE_NONE
});
var serverEngine = new _SpaaaceServerEngine["default"](io, gameEngine, {
  debug: {},
  updateRate: 6,
  timeoutInterval: 0 // no timeout
});
// start the game
serverEngine.start();

// server.get("/api/getroom", function (req, res) {
//   //   const id = req;
//   //   console.log("Server Asset ID", id);
//   //   res.send(id);
// });
//# sourceMappingURL=main.js.map