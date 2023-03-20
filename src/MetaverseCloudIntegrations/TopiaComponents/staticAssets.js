import { InteractiveAsset } from "../rtsdk";

export const addFrame = async ({ assetId, pos, req, urlSlug }) => {
  try {
    // const frameAsset = await
    InteractiveAsset({
      id: "UaJENXLHNkuBI4pzFH50",
      // id: "NpPd9WTiQMJxoOspx6w1",
      req,
      position: {
        x: pos ? pos.x : 0,
        y: pos ? pos.y : 0,
      },
      uniqueName: `multiplayer_leaderboard_${assetId}_frame`,
      urlSlug,
    });

    // frameAsset.updateScale(1.35);
  } catch (e) {
    console.log("Error adding frame", e);
  }
};
