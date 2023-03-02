"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.World = exports.User = exports.DroppedAsset = exports.Asset = void 0;
var _dotenv = _interopRequireDefault(require("dotenv"));
var _topia = require("@rtsdk/topia");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
_dotenv["default"].config();
var config = {
  apiDomain: process.env.INSTANCE_DOMAIN || "https://api.topia.io/",
  // apiKey: process.env.API_KEY,
  interactiveKey: process.env.INTERACTIVE_KEY,
  interactiveSecret: process.env.INTERACTIVE_SECRET
};
var myTopiaInstance = new _topia.Topia(config);
var Asset = new _topia.AssetFactory(myTopiaInstance);
exports.Asset = Asset;
var DroppedAsset = new _topia.DroppedAssetFactory(myTopiaInstance);
exports.DroppedAsset = DroppedAsset;
var User = new _topia.UserFactory(myTopiaInstance);
exports.User = User;
var World = new _topia.WorldFactory(myTopiaInstance);
exports.World = World;
//# sourceMappingURL=topiaInit.js.map