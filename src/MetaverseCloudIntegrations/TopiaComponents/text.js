import { InteractiveAsset, World } from "../rtsdk";

export const createText = async ({ pos, req, text, textColor, textSize, textWidth, uniqueName, urlSlug }) => {
  try {
    const trackAsset = await InteractiveAsset({
      id: "rXLgzCs1wxpx96YLZAN5",
      req,
      position: pos,
      uniqueName,
      urlSlug,
    });

    await trackAsset.updateCustomTextAsset(
      {
        textColor, // Color the currently playing track a different color
        textFontFamily: "Arial",
        textSize,
        textWeight: "normal",
        textWidth,
      },
      text,
    );
    return trackAsset;
  } catch (e) {
    console.log("Error updating text", e);
  }
};

export const updateText = async ({ req, text, textOptions = {}, uniqueName }) => {
  const { urlSlug } = req.body;

  try {
    if (!uniqueName) return;
    const world = World.create(urlSlug, { credentials: req.body });

    const droppedAssets = await world.fetchDroppedAssetsWithUniqueName({
      uniqueName,
    });

    if (droppedAssets && droppedAssets[0]) {
      await droppedAssets[0].updateCustomTextAsset(textOptions, text);
      // await droppedAssets[0].updateDroppedAssetDataObject(newDataObject);
    }
  } catch (e) {
    // Don't need this console log.  Include it for dx, but it'll hit pretty frequently.
    console.log("Error updating text", e);
    // console.log("Error updating text", e.data.errors || e);
  }
};
