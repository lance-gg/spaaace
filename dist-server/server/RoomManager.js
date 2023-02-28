"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.roomBasedOn = exports.getRoomName = void 0;

var _url = _interopRequireDefault(require("url"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getRoomName = function getRoomName(URL) {
  var parts = _url["default"].parse(URL, true);

  var query = parts.query;
  return query[roomBasedOn()];
};

exports.getRoomName = getRoomName;

var roomBasedOn = function roomBasedOn() {
  // Can be changed to dynamically alter the query being used as basis of room name.
  return "assetId";
};

exports.roomBasedOn = roomBasedOn;
//# sourceMappingURL=RoomManager.js.map