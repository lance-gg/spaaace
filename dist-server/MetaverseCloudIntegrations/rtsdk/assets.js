"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InteractiveAsset = void 0;

var _index = require("./index.js");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var InteractiveAsset = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref) {
    var id, req, position, uniqueName, urlSlug, asset, droppedAsset;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            id = _ref.id, req = _ref.req, position = _ref.position, uniqueName = _ref.uniqueName, urlSlug = _ref.urlSlug;
            _context.prev = 1;
            asset = _index.Asset.create(id, {
              credentials: req.body
            });
            _context.next = 5;
            return _index.DroppedAsset.drop(asset, {
              position: position,
              uniqueName: uniqueName,
              urlSlug: urlSlug
            });

          case 5:
            droppedAsset = _context.sent;

            if (!droppedAsset) {
              _context.next = 9;
              break;
            }

            _context.next = 9;
            return droppedAsset.setInteractiveSettings({
              isInteractive: true // interactivePublicKey: process.env.INTERACTIVE_KEY,

            });

          case 9:
            return _context.abrupt("return", droppedAsset);

          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](1);
            console.log("Error creating interactive asset", _context.t0);

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 12]]);
  }));

  return function InteractiveAsset(_x) {
    return _ref2.apply(this, arguments);
  };
}();

exports.InteractiveAsset = InteractiveAsset;
//# sourceMappingURL=assets.js.map