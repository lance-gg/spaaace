import { DroppedAsset } from "./index.js";
import "regenerator-runtime/runtime";

// Middleware to get the asset and object
export const getAssetAndDataObject = async (req) => {
  const { assetId, interactivePublicKey, interactiveNonce, urlSlug, visitorId } = req.body;

  try {
    // Can do .create instead of .get if you don't need all the data inside the dropped asset
    const droppedAsset = await DroppedAsset.get(assetId, urlSlug, {
      credentials: {
        assetId,
        interactiveNonce,
        interactivePublicKey,
        visitorId,
      },
    });

    await droppedAsset.fetchDroppedAssetDataObject();
    return droppedAsset;
  } catch (e) {
    console.log("Error getting asset and data object", e);
  }
};
