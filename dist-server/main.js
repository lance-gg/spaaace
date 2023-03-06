"use strict";

var _express = _interopRequireDefault(require("express"));

var _socket = _interopRequireDefault(require("socket.io"));

var _path = _interopRequireDefault(require("path"));

var _lanceGg = require("lance-gg");

var _SpaaaceServerEngine = _interopRequireDefault(require("./server/SpaaaceServerEngine.js"));

var _SpaaaceGameEngine = _interopRequireDefault(require("./common/SpaaaceGameEngine.js"));

var _RoomManager = require("./server/RoomManager.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var PORT = process.env.PORT || 3000;

var INDEX = _path["default"].join(__dirname, "../dist/index.html"); // define routes and socket


var server = (0, _express["default"])();
var requestHandler = server.listen(PORT, function () {
  return console.log("Listening on ".concat(PORT));
});
var io = (0, _socket["default"])(requestHandler); // Game Instances

var gameEngine = new _SpaaaceGameEngine["default"]({
  traceLevel: _lanceGg.Lib.Trace.TRACE_NONE
});
var serverEngine = new _SpaaaceServerEngine["default"](io, gameEngine, {
  debug: {},
  updateRate: 6,
  timeoutInterval: 0 // no timeout

});
serverEngine.start();
server.use("/", /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // Redirects to Topia if visitor not in the world
            //   const name = await getRoomAndUsername(req.url, res);
            next(); //   res.redirect("https://topia.io");

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());
server.use("/", _express["default"]["static"](_path["default"].join(__dirname, "../dist/")));
server.get("/", function (req, res) {
  res.sendFile(INDEX);
}); // server.get("/api/getroom", function (req, res) {
//   //   const id = req;
//   //   console.log("Server Asset ID", id);
//   //   res.send(id);
// });
//# sourceMappingURL=main.js.map