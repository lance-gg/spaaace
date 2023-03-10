import { DroppedAsset, getAssetAndDataObject } from "./index.js";

export const getDroppedAsset = async (req, res) => {
  const { assetId, urlSlug } = req.body;
  try {
    const droppedAsset = await getAsset({
      assetId,
      urlSlug,
    });
    res.json(droppedAsset);
  } catch (e) {
    console.log("Error getting dropped asset", e);
  }
};

export const getDataObject = async (req, res) => {
  try {
    const droppedAsset = await getAssetAndDataObject(req);
    if (droppedAsset) {
      return res.json({
        success: true,
        assetId: req.body.assetId,
        dataObject: droppedAsset.dataObject,
      });
    } else {
      console.log("No dropped asset");
      return res.status(502).send({ error: "No dropped asset with that assetId", success: false });
    }
  } catch (e) {
    console.log("Error getting data object", e);
  }
};

export const updateTextAsset = async (req, res) => {
  try {
    const { assetId, assetText, urlSlug } = req.body;
    // Doing a create here instead of a .get because don't need all the data inside the dropped asset.
    const droppedAsset = DroppedAsset.create(assetId, urlSlug, {
      credentials: req.body,
    });
    await droppedAsset.updateCustomTextAsset({}, assetText);
    return res.json({ success: true });
  } catch (e) {
    // Don't need this console log.  Include it for dx, but it'll hit pretty frequently.
    // console.log("Error updating text asset", e);
  }
};
