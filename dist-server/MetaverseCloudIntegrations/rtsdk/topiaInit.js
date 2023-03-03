"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Visitor = exports.World = exports.User = exports.DroppedAsset = exports.Asset = void 0;

// import dotenv from "dotenv";
// dotenv.config();
var _require = require("@rtsdk/topia/dist/index.cjs"),
    AssetFactory = _require.AssetFactory,
    DroppedAssetFactory = _require.DroppedAssetFactory,
    Topia = _require.Topia,
    UserFactory = _require.UserFactory,
    WorldFactory = _require.WorldFactory,
    VisitorFactory = _require.VisitorFactory;

var config = {
  // apiDomain: process.env.INSTANCE_DOMAIN || "https://api.topia.io/",
  // // apiKey: process.env.API_KEY,
  // apiProtocol: process.env.INSTANCE_PROTOCOL || "https",
  // interactiveKey: process.env.INTERACTIVE_KEY,
  // interactiveSecret: process.env.INTERACTIVE_SECRET,
  apiDomain: "api-stage.topia.io",
  apiProtocol: "http",
  interactiveKey: "3HFkkXhQJ2P921jDJe9g",
  interactiveSecret: "0c0bf776-4f6f-4d3c-9837-66415d6b9368"
};
var myTopiaInstance = new Topia(config);
var Asset = new AssetFactory(myTopiaInstance);
exports.Asset = Asset;
var DroppedAsset = new DroppedAssetFactory(myTopiaInstance);
exports.DroppedAsset = DroppedAsset;
var User = new UserFactory(myTopiaInstance);
exports.User = User;
var World = new WorldFactory(myTopiaInstance);
exports.World = World;
var Visitor = new VisitorFactory(myTopiaInstance);
exports.Visitor = Visitor;
//# sourceMappingURL=topiaInit.js.map