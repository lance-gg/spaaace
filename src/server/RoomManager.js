import url from "url";
import http from "http";
import { getAssetAndDataObject, Visitor, WorldActivity } from "../MetaverseCloudIntegrations/rtsdk";
import "regenerator-runtime/runtime";

export const getRoomAndUsername = async (URL, res) => {
  // console.log(URL);
  const parts = url.parse(URL, true);
  const query = parts.query;
  const username = await checkWhetherVisitorInWorld(query, res);
  return { roomName: query[roomBasedOn()], username };
};

export const roomBasedOn = () => {
  // Can be changed to dynamically alter the query being used as basis of room name.
  return "assetId";
};

const checkWhetherVisitorInWorld = async (query, res) => {
  // Check whether have access to interactive nonce, which means visitor is in world.
  const { assetId, interactivePublicKey, interactiveNonce, urlSlug, visitorId } = query;
  // console.log("🚀 ~ file: RoomManager.js:20 ~ checkWhetherVisitorInWorld ~ query:", query);
  // const req = {};
  // req.body = { assetId, interactivePublicKey, interactiveNonce, urlSlug, visitorId };
  // get Visitor Info to verify that visitor is actually in world.  Also get their username to populate into ship.

  // if (assetId) {
  try {
    const worldActivity = await WorldActivity.create(urlSlug, {
      credentials: {
        assetId,
        interactiveNonce,
        interactivePublicKey,
        visitorId,
      },
    });
    const currentVisitors = await worldActivity.currentVisitors();

    // const visitor = await Visitor.get(visitorId, urlSlug, {
    //   credentials: {
    //     assetId,
    //     interactiveNonce,
    //     interactivePublicKey,
    //     visitorId,
    //   },
    // });
    // console.log("🚀 ~ file: RoomManager.js:27 ~ checkWhetherVisitorInWorld ~ visitor:", visitor);
    // const privateZoneId = visitor.privateZoneId;
    // const username = visitor.username;

    const visitor = currentVisitors[visitorId];
    if (!visitor || !visitor.username) throw "Not in world";

    const { privateZoneId, username } = visitor;

    if (!privateZoneId || privateZoneId !== assetId) {
      // Not in the private Zone.  Can watch ships fly around, but can't play.
      return null;
    } else {
      return username;
    }
  } catch (e) {
    // Not actually in the world.  Should prevent from seeing game.
    console.log("ERROR", e);
    // if (res) res.redirect("https://topia.io");
  }
};
