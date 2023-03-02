import { Asset, DroppedAsset } from "./index.js";

export const InteractiveAsset = async ({
  id,
  req,
  position,
  uniqueName,
  urlSlug,
}) => {
  try {
    const asset = Asset.create(id, { credentials: req.body });

    const droppedAsset = await DroppedAsset.drop(asset, {
      position,
      uniqueName,
      urlSlug,
    });

    // This adds your public developer key to the dropped asset so visitors can interact with it in-world.
    if (droppedAsset)
      await droppedAsset.setInteractiveSettings({
        isInteractive: true,
        interactivePublicKey: process.env.INTERACTIVE_KEY,
      });
    return droppedAsset;
  } catch (e) {
    console.log("Error creating interactive asset", e);
  }
};
