"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.roomBasedOn = exports.getRoomAndUsername = void 0;

var _url = _interopRequireDefault(require("url"));

var _http = _interopRequireDefault(require("http"));

var _rtsdk = require("../MetaverseCloudIntegrations/rtsdk");

require("regenerator-runtime/runtime");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var getRoomAndUsername = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(URL, res) {
    var parts, query, username;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // console.log(URL);
            parts = _url["default"].parse(URL, true);
            query = parts.query;
            _context.next = 4;
            return checkWhetherVisitorInWorld(query, res);

          case 4:
            username = _context.sent;
            return _context.abrupt("return", {
              roomName: query[roomBasedOn()],
              username: username
            });

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getRoomAndUsername(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.getRoomAndUsername = getRoomAndUsername;

var roomBasedOn = function roomBasedOn() {
  // Can be changed to dynamically alter the query being used as basis of room name.
  return "assetId";
};

exports.roomBasedOn = roomBasedOn;

var checkWhetherVisitorInWorld = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(query, res) {
    var assetId, interactivePublicKey, interactiveNonce, urlSlug, visitorId, worldActivity, currentVisitors, visitor, privateZoneId, username;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // Check whether have access to interactive nonce, which means visitor is in world.
            assetId = query.assetId, interactivePublicKey = query.interactivePublicKey, interactiveNonce = query.interactiveNonce, urlSlug = query.urlSlug, visitorId = query.visitorId; // console.log("🚀 ~ file: RoomManager.js:20 ~ checkWhetherVisitorInWorld ~ query:", query);
            // const req = {};
            // req.body = { assetId, interactivePublicKey, interactiveNonce, urlSlug, visitorId };
            // get Visitor Info to verify that visitor is actually in world.  Also get their username to populate into ship.
            // if (assetId) {

            _context2.prev = 1;
            _context2.next = 4;
            return _rtsdk.WorldActivity.create(urlSlug, {
              credentials: {
                assetId: assetId,
                interactiveNonce: interactiveNonce,
                interactivePublicKey: interactivePublicKey,
                visitorId: visitorId
              }
            });

          case 4:
            worldActivity = _context2.sent;
            _context2.next = 7;
            return worldActivity.currentVisitors();

          case 7:
            currentVisitors = _context2.sent;
            // const visitor = await Visitor.get(visitorId, urlSlug, {
            //   credentials: {
            //     assetId,
            //     interactiveNonce,
            //     interactivePublicKey,
            //     visitorId,
            //   },
            // });
            // console.log("🚀 ~ file: RoomManager.js:27 ~ checkWhetherVisitorInWorld ~ visitor:", visitor);
            // const privateZoneId = visitor.privateZoneId;
            // const username = visitor.username;
            visitor = currentVisitors[visitorId];

            if (!(!visitor || !visitor.username)) {
              _context2.next = 11;
              break;
            }

            throw "Not in world";

          case 11:
            privateZoneId = visitor.privateZoneId, username = visitor.username;

            if (!(!privateZoneId || privateZoneId !== assetId)) {
              _context2.next = 16;
              break;
            }

            return _context2.abrupt("return", null);

          case 16:
            return _context2.abrupt("return", username);

          case 17:
            _context2.next = 22;
            break;

          case 19:
            _context2.prev = 19;
            _context2.t0 = _context2["catch"](1);
            // Not actually in the world.  Should prevent from seeing game.
            console.log("ERROR", _context2.t0); // if (res) res.redirect("https://topia.io");

          case 22:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 19]]);
  }));

  return function checkWhetherVisitorInWorld(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=RoomManager.js.map