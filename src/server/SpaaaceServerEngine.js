import { debounce } from "throttle-debounce";
import {
  hideLeaderboard,
  showLeaderboard,
  // resetLeaderboard,
  updateLeaderboard,
} from "../MetaverseCloudIntegrations/TopiaComponents/LeaderboardManager";
import { getRoomAndUsername } from "../MetaverseCloudIntegrations/TopiaComponents/RoomManager";
import { ServerEngine } from "lance-gg";
import url from "url";
const nameGenerator = require("./NameGenerator");
const NUM_BOTS = 0;

export default class SpaaaceServerEngine extends ServerEngine {
  constructor(io, gameEngine, inputOptions) {
    super(io, gameEngine, inputOptions);
    this.scoreData = {};
  }

  // when the game starts, create robot spaceships, and register
  // on missile-hit events
  start() {
    super.start();

    // Room IDs https://github.com/jungbeomsu/Test/blob/fe9474c67073121937726deb54f0e53eb11eb4c4/src/gameServer/TownServerEngine.js

    // for (let x = 0; x < NUM_BOTS; x++) this.makeBot();

    this.gameEngine.on("missileHit", (e) => {
      // add kills
      const roomName = e.missile.roomName;
      if (this.scoreData[roomName][e.missile.ownerId]) this.scoreData[roomName][e.missile.ownerId].kills++;

      // remove score data for killed ship
      delete this.scoreData[roomName][e.ship.id];
      this.updateScore();

      //   console.log(`ship killed: ${e.ship.toString()}`);
      this.gameEngine.removeObjectFromWorld(e.ship.id);
      //   if (e.ship.isBot) {
      //     setTimeout(() => this.makeBot(), 5000);
      //   }
    });
  }

  // a player has connected
  onPlayerConnected(socket) {
    super.onPlayerConnected(socket);
    this.joinRoom(socket);
  }

  async joinRoom(socket) {
    const URL = socket.handshake.headers.referer;
    const parts = url.parse(URL, true);
    const query = parts.query;
    const { assetId, urlSlug } = query;
    const req = { body: query }; // Used for interactive assets

    // Only update leaderboard once every 5 seconds.
    const debounceLeaderboard = debounce(
      1000,
      (leaderboardArray, req, username) => {
        console.log(`${username} updating leaderboard`, leaderboardArray);
        updateLeaderboard({ leaderboardArray, req });
      },
      { atBegin: false },
    );

    const { isAdmin, roomName, username } = await getRoomAndUsername(query);

    if (isAdmin) {
      socket.emit("isadmin"); // Shows admin controls on landing page

      socket.on("showLeaderboard", () => showLeaderboard({ assetId, req, urlSlug }));
      socket.on("hideLeaderboard", () => hideLeaderboard(req));
      // socket.on("resetLeaderboard", resetLeaderboard); // Used to reset high score.
    }

    if (!roomName) {
      socket.emit("notinroom");
      return;
    }

    if (username === -1) {
      socket.emit("error");
      return;
    }

    if (this.rooms[roomName]) {
      super.assignPlayerToRoom(socket.playerId, roomName);
    } else {
      super.createRoom(roomName);
      // Prevent race condition of creating room above.
      setTimeout(() => super.assignPlayerToRoom(socket.playerId, roomName), 500);
    }

    this.scoreData[roomName] = this.scoreData[roomName] || {};

    if (username) {
      socket.on("updateLeaderboard", (leaderboardArray) => debounceLeaderboard(leaderboardArray, req, username));
      socket.emit("inzone");

      let makePlayerShip = () => {
        let ship = this.gameEngine.makeShip(socket.playerId);
        this.assignObjectToRoom(ship, roomName);

        this.scoreData[roomName][ship.id] = {
          kills: 0,
          name: username,
        };
        this.updateScore();
      };
      // handle client restart requests
      socket.on("requestRestart", makePlayerShip);
    } else {
      // User is spectating because not in private zone
      socket.emit("spectating");
      this.updateScore();
    }
  }

  // a player has disconnected
  onPlayerDisconnected(socketId, playerId) {
    super.onPlayerDisconnected(socketId, playerId);

    // iterate through all objects, delete those that are associated with the player (ship and missiles)
    let playerObjects = this.gameEngine.world.queryObjects({ playerId: playerId });
    playerObjects.forEach((obj) => {
      this.gameEngine.removeObjectFromWorld(obj.id);
      // remove score associated with this ship
      delete this.scoreData[obj._roomName][obj.id];
    });

    this.updateScore();
  }

  //   // create a robot spaceship
  //   makeBot() {
  //     let bot = this.gameEngine.makeShip(0);
  //     bot.attachAI();
  //     this.scoreData[bot.id] = {
  //       kills: 0,
  //       name: nameGenerator("general") + "Bot",
  //     };
  //     this.updateScore();
  //   }

  updateScore() {
    // delay so player socket can catch up
    setTimeout(() => {
      this.io.sockets.emit("scoreUpdate", this.scoreData);
    }, 1000);
  }
}
