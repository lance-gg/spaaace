const express = require("express");
const socketIO = require("socket.io");
const path = require("path");
const url = require("url");
const querystring = require("querystring");
import { Lib } from "lance-gg";
// Game Server
import SpaaaceServerEngine from "./server/SpaaaceServerEngine.js";
import SpaaaceGameEngine from "./common/SpaaaceGameEngine.js";

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, "../dist/index.html");

// define routes and socket
const server = express();
server.use("/", express.static(path.join(__dirname, "../dist/")));
server.get("/", function (req, res) {
  res.sendFile(INDEX);
});
let requestHandler = server.listen(PORT, () => console.log(`Listening on ${PORT}`));
const io = socketIO(requestHandler);
// Game Instances
const gameEngine = new SpaaaceGameEngine({ traceLevel: Lib.Trace.TRACE_NONE });
const serverEngine = new SpaaaceServerEngine(io, gameEngine, {
  debug: {},
  updateRate: 6,
  timeoutInterval: 0, // no timeout
});

// server.get("/api/getroom", function (req, res) {
//   //   const id = req;
//   //   console.log("Server Asset ID", id);
//   //   res.send(id);
// });

// start the game
serverEngine.start();
