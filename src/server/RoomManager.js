import url from "url";
import { getAssetAndDataObject, Visitor } from "../MetaverseCloudIntegrations/rtsdk";
import "regenerator-runtime/runtime";

export const getRoomAndUsername = async (URL) => {
  const parts = url.parse(URL, true);
  const query = parts.query;
  console.log("Query", query);
  const username = await checkWhetherVisitorInWorld(query);
  return { roomName: query[roomBasedOn()], username };
};

export const roomBasedOn = () => {
  // Can be changed to dynamically alter the query being used as basis of room name.
  return "assetId";
};

const checkWhetherVisitorInWorld = async (query) => {
  // Check whether have access to interactive nonce, which means visitor is in world.
  const { assetId, interactivePublicKey, interactiveNonce, urlSlug, visitorId } = query;
  console.log("🚀 ~ file: RoomManager.js:20 ~ checkWhetherVisitorInWorld ~ query:", query);
  const req = {};
  req.body = { assetId, interactivePublicKey, interactiveNonce, urlSlug, visitorId };
  // get Visitor Info to verify that visitor is actually in world.  Also get their username to populate into ship.

  if (assetId) {
    try {
      // const visitor = await Visitor.get(visitorId, urlSlug, {
      //   credentials: {
      //     assetId,
      //     interactiveNonce,
      //     interactivePublicKey,
      //     visitorId,
      //   },
      // });
      // console.log("🚀 ~ file: RoomManager.js:27 ~ checkWhetherVisitorInWorld ~ visitor:", visitor);
      // const result = await getAssetAndDataObject(req);
      // console.log("🚀 ~ file: RoomManager.js:25 ~ checkWhetherVisitorInWorld ~ result:", result);
    } catch (e) {
      console.log("ERROR", e);
      // console.log(e.data);
    }
  }
  // if (!result || !result.inPrivateZone || result.inPrivateZone === assetId) {
  // Route to page that says "You don't have access to this experience.  Please enter the gaming zone and try again."
  // } else {
  // const { displayName } = result;

  return "User 1";
  // }
};
