"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateLeaderboard = void 0;
var _axios = _interopRequireDefault(require("axios"));
var _indexJsJs = require("./index.js.js.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var updateLeaderboard = function updateLeaderboard(req, res) {
  var leaderboardObject = {};
  if (!req.body) return;
  var leaderboardArray = req.body.rows.split(",");

  // Create the object from raw data
  for (var i = 0; i < leaderboardArray.length; i++) {
    switch (i % 5) {
      case 0:
        leaderboardObject[leaderboardArray[i]] = {};
        break;
      case 1:
        leaderboardObject[leaderboardArray[i - 1]].completed = parseInt(leaderboardArray[i]);
        break;
      case 4:
        leaderboardObject[leaderboardArray[i - 4]].accuracy = parseFloat(leaderboardArray[i]).toFixed(0);
        break;
      default:
        break;
    }
  }
  createLeaderboard(leaderboardObject);
  res.send("Successfully updated!");
};
exports.updateLeaderboard = updateLeaderboard;
var createLeaderboard = function createLeaderboard(leaderboardObject) {
  var accuracyLeaderboard = Object.keys(leaderboardObject).sort(function (a, b) {
    if (leaderboardObject[b].accuracy === leaderboardObject[a].accuracy) {
      return leaderboardObject[b].completed - leaderboardObject[a].completed;
    }
    return leaderboardObject[b].accuracy - leaderboardObject[a].accuracy;
  }).map(function (element) {
    return _objectSpread(_objectSpread({}, leaderboardObject[element]), {}, {
      department: element
    });
  });
  var completedLeaderboard = Object.keys(leaderboardObject).sort(function (a, b) {
    if (leaderboardObject[b].completed === leaderboardObject[a].completed) {
      return leaderboardObject[b].accuracy - leaderboardObject[a].accuracy;
    }
    return leaderboardObject[b].completed - leaderboardObject[a].completed;
  }).map(function (element) {
    return _objectSpread(_objectSpread({}, leaderboardObject[element]), {}, {
      department: element
    });
  });
  (0, _indexJsJs.publicAPI)(process.env.LEADERBOARD_API_KEY).get("/world/".concat(process.env.LEADERBOARD_URL_SLUG, "/assets"), {}).then(function (response) {
    var data = response.data;
    var existingLeaderboards = {
      AccuracyLeaderboard: {
        department: {},
        completed: {},
        accuracy: {}
      },
      CompletedLeaderboard: {
        department: {},
        completed: {},
        accuracy: {}
      }
    };
    data.forEach(function (element) {
      var uniqueName = element.uniqueName;
      if (uniqueName && (uniqueName.includes("AccuracyLeaderboard") || uniqueName.includes("CompletedLeaderboard"))) {
        var tempArray = uniqueName.split("_");
        var board = tempArray[0];
        var category = tempArray[1].toLowerCase();
        var order = tempArray[2];
        existingLeaderboards[board][category][order] = element;
      }
    });
    for (var i = 0; i < completedLeaderboard.length; i++) {
      var boardString = "CompletedLeaderboard";
      prepareAssetText(boardString, existingLeaderboards[boardString], completedLeaderboard[i], i);
    }
    for (var _i = 0; _i < accuracyLeaderboard.length; _i++) {
      var _boardString = "AccuracyLeaderboard";
      prepareAssetText(_boardString, existingLeaderboards[_boardString], accuracyLeaderboard[_i], _i);
    }
  });
};
var prepareAssetText = function prepareAssetText(boardString, boardObj, newItem, index
// addedNewAssetCallback
) {
  // This isn't yet working properly
  // const prepCreateAsset = async (cat) => {
  //   const firstAsset = boardObj[cat][0];
  //   if (!firstAsset) return;
  //   let newAsset = firstAsset;
  //   delete newAsset.id;
  //   newAsset.position.y =
  //     firstAsset.position.y + firstAsset.textStyle.textSize + index;
  //   newAsset.uniqueName = `${boardString}_${cat}_${index}`;
  //   newAsset.text = newItem[cat].toString();
  //   // console.log(newItem[cat]);
  //   // addedNewAssetCallback(boardString, cat, index, newAsset);
  //   const id = await createAsset(newAsset);
  //   console.log(newAsset.text);
  //   updateAssetText(id, newAsset.text, firstAsset.textStyle);
  // };

  var prepByCategory = function prepByCategory(cat) {
    var asset = boardObj[cat][index];
    if (!asset) {
      // console.log("No asset for index", index);
      // prepCreateAsset(cat);
      return;
    }
    var id = asset.id,
      text = asset.text;
    var newText = newItem[cat].toString();
    if (text !== newText) updateAssetText(id, newText);
  };
  prepByCategory("department");
  prepByCategory("completed");
  prepByCategory("accuracy");
};
var updateAssetText = function updateAssetText(id, text, style) {
  var toUpdate = {
    text: text
  };
  if (style) toUpdate.style = style;
  (0, _indexJsJs.publicAPI)(process.env.LEADERBOARD_API_KEY).put("/world/".concat(process.env.LEADERBOARD_URL_SLUG, "/assets/").concat(id, "/set-custom-text"), toUpdate);
};

// Not yet working properly
// const createAsset = (assetObj) => {
//   return new Promise((resolve, reject) => {
//     const { assetId, position, uniqueName } = assetObj;
//     publicAPI(process.env.LEADERBOARD_API_KEY)
//       .post(`/world/${process.env.LEADERBOARD_URL_SLUG}/assets`, {
//         assetId,
//         position,
//         uniqueName,
//       })
//       .then((response) => {
//         return resolve(response.data.id);
//       });
//   });
// };
//# sourceMappingURL=leaderboard.js.map