export const addFrame = async ({ assetId, pos, req, urlSlug }) => {
  try {
    // const frameAsset = await
    InteractiveAsset({
      id: "5OLYa5QDTos6qupPp26X",
      req,
      position: {
        x: pos ? pos.x : 0,
        y: pos ? pos.y + 570 : 570,
      },
      uniqueName: `multiplayer_leaderboard_${assetId}_frame`,
      urlSlug,
    });

    // frameAsset.updateScale(1.35);
  } catch (e) {
    console.log("Error adding frame", e);
  }
};
