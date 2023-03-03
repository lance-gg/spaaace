"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAssetAndDataObject = void 0;

var _index = require("./index.js");

require("regenerator-runtime/runtime");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// Middleware to get the asset and object
var getAssetAndDataObject = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req) {
    var _req$body, assetId, interactivePublicKey, interactiveNonce, urlSlug, visitorId, droppedAsset;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _req$body = req.body, assetId = _req$body.assetId, interactivePublicKey = _req$body.interactivePublicKey, interactiveNonce = _req$body.interactiveNonce, urlSlug = _req$body.urlSlug, visitorId = _req$body.visitorId;
            _context.prev = 1;
            _context.next = 4;
            return _index.DroppedAsset.get(assetId, urlSlug, {
              credentials: {
                assetId: assetId,
                interactiveNonce: interactiveNonce,
                interactivePublicKey: interactivePublicKey,
                visitorId: visitorId
              }
            });

          case 4:
            droppedAsset = _context.sent;
            _context.next = 7;
            return droppedAsset.fetchDroppedAssetDataObject();

          case 7:
            return _context.abrupt("return", droppedAsset);

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](1);
            console.log("Error getting asset and data object", _context.t0);

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 10]]);
  }));

  return function getAssetAndDataObject(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.getAssetAndDataObject = getAssetAndDataObject;
//# sourceMappingURL=dataObject.js.map