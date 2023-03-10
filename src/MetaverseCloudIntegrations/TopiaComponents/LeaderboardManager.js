import { World } from "../rtsdk";
import { createText, updateText } from "./text";
import { addFrame } from "./staticAssets";

const leaderboardLength = 5;

export const showLeaderboard = ({ assetId, posOffset, req, urlSlug }) => {
  // Check to see if leaderboard already exists.

  addFrame({ assetId, pos: posOffset, req, urlSlug });

  const createLeaderText = ({ pos, uniqueNameId }) => {
    createText({
      pos,
      req,
      text: "-",
      textColor: "#000000",
      textSize: 12,
      textWidth: 300,
      uniqueName: `multiplayer_leaderboard_${assetId}_${uniqueNameId}_${i}`,
      urlSlug,
    });
  };
  for (var i = 0; i < leaderboardLength; i++) {
    // Player Names
    const { x, y } = posOffset;
    createLeaderText({
      pos: { x: x - 50, y: y + i * 10 },
      uniqueNameId: `playerName`,
    });

    // Scores
    createLeaderText({
      pos: { x: x + 50, y: y + i * 10 },
      uniqueNameId: `score`,
    });
  }
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
    console.log("Error removing leaderboard", e?.response?.status || e);
  }
};

export const resetLeaderboard = () => {
  return;
};

export const updateLeaderboard = async ({ leaderboardArray, req }) => {
  for (var i = 0; i < leaderboardLength; i++) {
    // Update players
    updateText({
      req,
      text: leaderboardArray[i]?.player || "-",
      uniqueName: `multiplayer_leaderboard_${assetId}_player_${i}`,
    });
    // Update scores
    updateText({
      req,
      text: leaderboardArray[i]?.score || "-",
      uniqueName: `multiplayer_leaderboard_${assetId}_score_${i}`,
    });
  }
};
