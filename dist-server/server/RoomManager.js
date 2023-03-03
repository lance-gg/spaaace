"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.roomBasedOn = exports.getRoomAndUsername = void 0;

var _url = _interopRequireDefault(require("url"));

var _rtsdk = require("../MetaverseCloudIntegrations/rtsdk");

require("regenerator-runtime/runtime");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var getRoomAndUsername = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(URL) {
    var parts, query, username;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            parts = _url["default"].parse(URL, true);
            query = parts.query;
            _context.next = 4;
            return checkWhetherVisitorInWorld(query);

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

  return function getRoomAndUsername(_x) {
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
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(query) {
    var assetId, interactivePublicKey, interactiveNonce, urlSlug, visitorId, req, visitor, result;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // Check whether have access to interactive nonce, which means visitor is in world.
            assetId = query.assetId, interactivePublicKey = query.interactivePublicKey, interactiveNonce = query.interactiveNonce, urlSlug = query.urlSlug, visitorId = query.visitorId;
            console.log("🚀 ~ file: RoomManager.js:20 ~ checkWhetherVisitorInWorld ~ query:", query);
            req = {};
            req.body = {
              assetId: assetId,
              interactivePublicKey: interactivePublicKey,
              interactiveNonce: interactiveNonce,
              urlSlug: urlSlug,
              visitorId: visitorId
            }; // get Visitor Info to verify that visitor is actually in world.  Also get their username to populate into ship.

            if (!assetId) {
              _context2.next = 13;
              break;
            }

            _context2.next = 7;
            return _rtsdk.Visitor.get(visitorId, urlSlug, {
              credentials: {
                assetId: assetId,
                interactiveNonce: interactiveNonce,
                interactivePublicKey: interactivePublicKey,
                visitorId: visitorId
              }
            });

          case 7:
            visitor = _context2.sent;
            console.log("🚀 ~ file: RoomManager.js:27 ~ checkWhetherVisitorInWorld ~ visitor:", visitor);
            _context2.next = 11;
            return (0, _rtsdk.getAssetAndDataObject)(req);

          case 11:
            result = _context2.sent;
            console.log("🚀 ~ file: RoomManager.js:25 ~ checkWhetherVisitorInWorld ~ result:", result);

          case 13:
            return _context2.abrupt("return", "User 1");

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function checkWhetherVisitorInWorld(_x2) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=RoomManager.js.map