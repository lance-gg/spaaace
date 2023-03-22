import moment from "moment";
import { getAssetAndDataObject, getDroppedAsset, World } from "../rtsdk";
import { createText, updateText } from "./text";
import { addFrame } from "./staticAssets";

const leaderboardLength = 10;

export const showLeaderboard = async ({ assetId, req, urlSlug }) => {
  // Check to see if leaderboard already exists.

  // const arcadeAsset = await getAssetAndDataObject(req);
  const arcadeAsset = await getDroppedAsset(req);
  const assetPos = arcadeAsset.position;
  // const assetPos = { x: 500, y: -75 };
  // const dataObject = arcadeAsset.dataObject;
  // const { highScores } = dataObject;
  const highScores = null;
  const posOffset = { x: assetPos.x, y: assetPos.y + 500 };

  addFrame({ assetId, pos: posOffset, req, urlSlug });

  // Doing this because we don't yet have layering in SDK.
  setTimeout(() => {
    const createLeaderText = ({ pos, uniqueNameId, text }) => {
      createText({
        pos,
        req,
        text: text || "-",
        textColor: "#000000",
        textSize: 12,
        textWidth: 300,
        uniqueName: `multiplayer_leaderboard_${assetId}_${uniqueNameId}_${i}`,
        urlSlug,
      });
    };
    const distBetweenRows = 23;
    const distBetweenColumns = 150;

    for (var i = 0; i < leaderboardLength; i++) {
      // Player Names
      const { x, y } = posOffset;
      const topOfLeaderboard = -10;
      // const topOfLeaderboard = -160;

      createLeaderText({
        pos: { x: x - distBetweenColumns / 2, y: topOfLeaderboard + y + i * distBetweenRows },
        uniqueNameId: `playerName`,
      });

      // Scores
      createLeaderText({
        pos: { x: x + distBetweenColumns / 2, y: topOfLeaderboard + y + i * distBetweenRows },
        uniqueNameId: `score`,
      });
    }

    for (var i = 0; i < 3; i++) {
      // Player Names
      const { x, y } = posOffset;
      const topOfLeaderboard = -125;

      let scoreObj = { name: "-", date: "-", score: "-" };
      if (highScores && highScores[i]) {
        scoreObj = highScores[i];
        scoreObj.date = moment(parseInt(highScores[i].date)).fromNow(); // Use moment to format
      }

      createLeaderText({
        pos: { x: x - distBetweenColumns / 2, y: topOfLeaderboard + y + i * distBetweenRows },
        uniqueNameId: `topPlayerName`,
        text: scoreObj.name,
      });

      createLeaderText({
        pos: { x: x, y: topOfLeaderboard + y + i * distBetweenRows },
        uniqueNameId: `topDate`,
        text: scoreObj.date,
      });

      // Scores
      createLeaderText({
        pos: { x: x + distBetweenColumns / 2, y: topOfLeaderboard + y + i * distBetweenRows },
        uniqueNameId: `topScore`,
        text: scoreObj.score,
      });
    }
  }, 500);
};

export const hideLeaderboard = async (req) => {
  const { assetId, urlSlug } = req.body;
  try {
    const world = World.create(urlSlug, { credentials: req.body });
    const droppedAssets = await world.fetchDroppedAssetsWithUniqueName({
      isPartial: true,
      uniqueName: `multiplayer_leaderboard_${assetId}`,
    });
    if (droppedAssets && droppedAssets.length)
      droppedAssets.forEach((droppedAsset) => {
        try {
          droppedAsset.deleteDroppedAsset();
        } catch (e) {
          console.log("Error on delete dropped asset", e);
        }
      });
  } catch (e) {
    console.log("Error removing leaderboard", e?.response?.status || e?.data?.errors);
  }
};

export const resetLeaderboard = () => {
  return;
};

export const updateLeaderboard = async ({ leaderboardArray, req }) => {
  let sanitizedArray = [];
  const date = new Date().valueOf();
  for (var i = 0; i < leaderboardLength; i++) {
    // Update players
    let name = "-";
    let kills = "-";
    if (leaderboardArray[i]) {
      const score = leaderboardArray[i].data.kills;
      const id = leaderboardArray[i].id;
      name = leaderboardArray[i].data.name;
      kills = score.toString() || "0";
      sanitizedArray.push({ id, score, name, date });
    }
    // console.log(`Updating text for pos ${i}`, { name, kills });
    updateText({
      req,
      text: name,
      uniqueName: `multiplayer_leaderboard_${req.body.assetId}_playerName_${i}`,
    });
    // Update scores
    updateText({
      req,
      text: kills,
      uniqueName: `multiplayer_leaderboard_${req.body.assetId}_score_${i}`,
    });
  }
  // Issue with API if don't have timeout.
  // Error without timeout: Firebase Database (${JSCORE_VERSION}) INTERNAL ASSERT FAILED: listen() called twice for same path/queryId.
  // setTimeout(() => updateHighScores(req, sanitizedArray), 2000);
};

// const checkHighScores = async ({ score, id, name, highScores }) => {
//   if (highScores && score) {
//     for (i = 0; i < highScores.length; i++) {
//       const item = highScores[i];
//       if (score > parseInt(item.score) && id !== item.id) {
//       }
//     }
//   }
// };

// Convert to object to dedupe
function dedupe(arr) {
  var rv = {};
  for (var i = 0; i < arr.length; ++i) {
    const item = arr[i];
    if (item) {
      const id = item.id;
      // Remove duplicate player IDs
      if (!rv[id]) rv[id] = item;
    }
  }
  const dedupedArray = Object.keys(rv).map((id) => rv[id]);
  return dedupedArray.sort((a, b) => {
    return b.score - a.score;
  });
}

const updateHighScores = async (req, sanitizedArray) => {
  const arcadeAsset = await getAssetAndDataObject(req); // This seems to be creating issues with API
  if (!arcadeAsset) return;
  const { dataObject } = arcadeAsset;
  const { highScores } = dataObject;

  if (highScores[2] && sanitizedArray[0].score < highScores[2].score) return;

  let newArray = sanitizedArray.concat(highScores);
  let sortedArray = newArray.sort((a, b) => {
    return b.score - a.score;
  });

  const objectArray = dedupe(sortedArray);
  const highScoreArray = objectArray.slice(0, 2);
  // If they are the same, no need to update object or text.
  if (highScores === highScoreArray) return;

  for (let i = 0; i < highScoreArray.length; i++) {
    let name = "-";
    let date = "-";
    let scoreString = "-";
    if (highScoreArray[i]) {
      const score = highScoreArray[i].score;
      name = highScoreArray[i].name;
      scoreString = score.toString() || "0";
      date = moment(parseInt(highScoreArray[i].date)).fromNow();
    }

    updateText({
      req,
      text: name,
      uniqueName: `multiplayer_leaderboard_${req.body.assetId}_topPlayerName_${i}`,
    });

    updateText({
      req,
      text: date,
      uniqueName: `multiplayer_leaderboard_${req.body.assetId}_topDate_${i}`,
    });
    // Update scores
    updateText({
      req,
      text: scoreString,
      uniqueName: `multiplayer_leaderboard_${req.body.assetId}_topScore_${i}`,
    });
  }

  arcadeAsset.updateDroppedAssetDataObject({ highScores: highScoreArray });
};
