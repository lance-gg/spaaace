"use strict";

var _lanceGg = require("lance-gg");

var _SpaaaceServerEngine = _interopRequireDefault(require("./server/SpaaaceServerEngine.js"));

var _SpaaaceGameEngine = _interopRequireDefault(require("./common/SpaaaceGameEngine.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var express = require("express");

var socketIO = require("socket.io");

var path = require("path");

var url = require("url");

var querystring = require("querystring");

var PORT = process.env.PORT || 3000;
var INDEX = path.join(__dirname, "../dist/index.html"); // define routes and socket

var server = express();
server.use("/", express["static"](path.join(__dirname, "../dist/")));
server.get("/", function (req, res) {
  res.sendFile(INDEX);
});
var requestHandler = server.listen(PORT, function () {
  return console.log("Listening on ".concat(PORT));
});
var io = socketIO(requestHandler); // Game Instances

var gameEngine = new _SpaaaceGameEngine["default"]({
  traceLevel: _lanceGg.Lib.Trace.TRACE_NONE
});
var serverEngine = new _SpaaaceServerEngine["default"](io, gameEngine, {
  debug: {},
  updateRate: 6,
  timeoutInterval: 0 // no timeout

}); // server.get("/api/getroom", function (req, res) {
//   //   const id = req;
//   //   console.log("Server Asset ID", id);
//   //   res.send(id);
// });
// start the game

serverEngine.start();
//# sourceMappingURL=main.js.map