import express from "express";
import socketIO from "socket.io";
import path from "path";
// const url = require("url");
// const querystring = require("querystring");
import { Lib } from "lance-gg";
// Game Server
import SpaaaceServerEngine from "./server/SpaaaceServerEngine.js";
import SpaaaceGameEngine from "./common/SpaaaceGameEngine.js";
import { getRoomAndUsername } from "./server/RoomManager.js";

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, "../dist/index.html");

// define routes and socket
const server = express();
let requestHandler = server.listen(PORT, () => console.log(`Listening on ${PORT}`));
const io = socketIO(requestHandler);
// Game Instances
const gameEngine = new SpaaaceGameEngine({ traceLevel: Lib.Trace.TRACE_NONE });
const serverEngine = new SpaaaceServerEngine(io, gameEngine, {
  debug: {},
  updateRate: 6,
  timeoutInterval: 0, // no timeout
});
serverEngine.start();

server.use("/", async (req, res, next) => {
  // Redirects to Topia if visitor not in the world
  //   const name = await getRoomAndUsername(req.url, res);
  next();
  //   res.redirect("https://topia.io");
});
server.use("/", express.static(path.join(__dirname, "../dist/")));

server.get("/", function (req, res) {
  res.sendFile(INDEX);
});

// server.get("/api/getroom", function (req, res) {
//   //   const id = req;
//   //   console.log("Server Asset ID", id);
//   //   res.send(id);
// });
