import { getAssetAndDataObject, World } from "../rtsdk";
import { createText, updateText } from "./text";
import { addFrame } from "./staticAssets";

const leaderboardLength = 10;

export const showLeaderboard = async ({ assetId, req, urlSlug }) => {
  // Check to see if leaderboard already exists.

  const arcadeAsset = await getAssetAndDataObject(req);
  const assetPos = arcadeAsset.position;
  const dataObject = arcadeAsset.dataObject;
  const { highScores } = dataObject;
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
  for (var i = 0; i < leaderboardLength; i++) {
    // Update players
    let name = "-";
    let kills = "-";
    if (leaderboardArray[i]) {
      name = leaderboardArray[i].data.name;
      kills = leaderboardArray[i].data.kills.toString() || "0";
    }
    console.log(`Updating text for pos ${i}`, { name, kills });
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
};
