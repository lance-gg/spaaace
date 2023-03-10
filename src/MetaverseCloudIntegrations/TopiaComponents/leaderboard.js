import axios from "axios";
import { publicAPI } from "./index.js.js.js";

export const updateLeaderboard = (req, res) => {
  let leaderboardObject = {};
  if (!req.body) return;
  let leaderboardArray = req.body.rows.split(",");

  // Create the object from raw data
  for (let i = 0; i < leaderboardArray.length; i++) {
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

const createLeaderboard = (leaderboardObject) => {
  let accuracyLeaderboard = Object.keys(leaderboardObject)
    .sort((a, b) => {
      if (leaderboardObject[b].accuracy === leaderboardObject[a].accuracy) {
        return leaderboardObject[b].completed - leaderboardObject[a].completed;
      }
      return leaderboardObject[b].accuracy - leaderboardObject[a].accuracy;
    })
    .map((element) => {
      return { ...leaderboardObject[element], department: element };
    });

  let completedLeaderboard = Object.keys(leaderboardObject)
    .sort((a, b) => {
      if (leaderboardObject[b].completed === leaderboardObject[a].completed) {
        return leaderboardObject[b].accuracy - leaderboardObject[a].accuracy;
      }
      return leaderboardObject[b].completed - leaderboardObject[a].completed;
    })
    .map((element) => {
      return { ...leaderboardObject[element], department: element };
    });

  publicAPI(process.env.LEADERBOARD_API_KEY)
    .get(`/world/${process.env.LEADERBOARD_URL_SLUG}/assets`, {})
    .then((response) => {
      const { data } = response;
      let existingLeaderboards = {
        AccuracyLeaderboard: {
          department: {},
          completed: {},
          accuracy: {},
        },
        CompletedLeaderboard: {
          department: {},
          completed: {},
          accuracy: {},
        },
      };

      data.forEach((element) => {
        const { uniqueName } = element;
        if (uniqueName && (uniqueName.includes("AccuracyLeaderboard") || uniqueName.includes("CompletedLeaderboard"))) {
          const tempArray = uniqueName.split("_");
          const board = tempArray[0];
          const category = tempArray[1].toLowerCase();
          const order = tempArray[2];
          existingLeaderboards[board][category][order] = element;
        }
      });

      for (let i = 0; i < completedLeaderboard.length; i++) {
        const boardString = "CompletedLeaderboard";
        prepareAssetText(boardString, existingLeaderboards[boardString], completedLeaderboard[i], i);
      }

      for (let i = 0; i < accuracyLeaderboard.length; i++) {
        const boardString = "AccuracyLeaderboard";
        prepareAssetText(boardString, existingLeaderboards[boardString], accuracyLeaderboard[i], i);
      }
    });
};

const prepareAssetText = (
  boardString,
  boardObj,
  newItem,
  index,
  // addedNewAssetCallback
) => {
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

  const prepByCategory = (cat) => {
    const asset = boardObj[cat][index];
    if (!asset) {
      // console.log("No asset for index", index);
      // prepCreateAsset(cat);
      return;
    }
    const { id, text } = asset;
    const newText = newItem[cat].toString();
    if (text !== newText) updateAssetText(id, newText);
  };

  prepByCategory("department");
  prepByCategory("completed");
  prepByCategory("accuracy");
};

const updateAssetText = (id, text, style) => {
  const toUpdate = { text };
  if (style) toUpdate.style = style;
  publicAPI(process.env.LEADERBOARD_API_KEY).put(
    `/world/${process.env.LEADERBOARD_URL_SLUG}/assets/${id}/set-custom-text`,
    toUpdate,
  );
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
