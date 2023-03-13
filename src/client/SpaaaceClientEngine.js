import Howler from "howler"; // eslint-disable-line no-unused-vars
import { ClientEngine, KeyboardControls } from "lance-gg";
import SpaaaceRenderer from "../client/SpaaaceRenderer";
import MobileControls from "./MobileControls";
import Ship from "../common/Ship";
import Utils from "../common/Utils";
import { roomBasedOn } from "../MetaverseCloudIntegrations/TopiaComponents/RoomManager";

export default class SpaaaceClientEngine extends ClientEngine {
  constructor(gameEngine, options) {
    super(gameEngine, options, SpaaaceRenderer);
  }

  start() {
    super.start();

    // handle gui for game condition
    this.gameEngine.on("objectDestroyed", (obj) => {
      if (obj instanceof Ship && this.gameEngine.isOwnedByPlayer(obj)) {
        document.body.classList.add("lostGame");
        document.querySelector("#tryAgain").disabled = false;
      }
    });

    this.gameEngine.once("renderer.ready", () => {
      // click event for "try again" button
      document.querySelector("#tryAgain").addEventListener("click", () => {
        if (Utils.isTouchDevice()) {
          this.renderer.enableFullScreen();
        }
        this.socket.emit("requestRestart");
      });

      document.querySelector("#joinGame").addEventListener("click", (clickEvent) => {
        if (Utils.isTouchDevice()) {
          this.renderer.enableFullScreen();
        }
        clickEvent.currentTarget.disabled = true;
        this.socket.emit("requestRestart");
      });

      document.querySelector("#reconnect").addEventListener("click", () => {
        window.location.reload();
      });

      //  Game input
      if (Utils.isTouchDevice()) {
        this.controls = new MobileControls(this);
        this.controls.on("fire", () => {
          this.sendInput("space");
        });
      } else {
        this.controls = new KeyboardControls(this);
        this.controls.bindKey("left", "left", { repeat: true });
        this.controls.bindKey("right", "right", { repeat: true });
        this.controls.bindKey("up", "up", { repeat: true });
        this.controls.bindKey("space", "space");
      }
    });

    // allow a custom path for sounds
    let assetPathPrefix = this.options.assetPathPrefix ? this.options.assetPathPrefix : "";

    // handle sounds
    this.sounds = {
      missileHit: new Howl({ src: [assetPathPrefix + "assets/audio/193429__unfa__projectile-hit.mp3"] }),
      fireMissile: new Howl({ src: [assetPathPrefix + "assets/audio/248293__chocobaggy__weird-laser-gun.mp3"] }),
    };

    this.gameEngine.on("fireMissile", () => {
      this.sounds.fireMissile.play();
    });
    this.gameEngine.on("missileHit", () => {
      // don't play explosion sound if the player is not in game
      if (this.renderer.playerShip) {
        this.sounds.missileHit.play();
      }
    });

    this.networkMonitor.on("RTTUpdate", (e) => {
      this.renderer.updateHUD(e);
    });
  }

  // extend ClientEngine connect to add own events
  connect() {
    return super.connect().then(() => {
      this.socket.on("spectating", () => {
        document.querySelector("#introText").innerHTML = "Enter the Game Zone to Participate";
        document.querySelector("#joinGame").innerHTML = "Spectating";
      });

      this.socket.on("notinroom", () => {
        document.querySelector("#introText").innerHTML = "You can only enter a game from within a world";
        document.querySelector("#joinGame").innerHTML =
          "<a href=https://github.com/metaversecloud-com/multiplayer-iframe-game-example>Find me on GitHub</a>";
      });

      this.socket.on("inzone", () => {
        document.querySelector("#introText").innerHTML = "You are in the Game Zone. Click Join Game to play";
        document.querySelector("#joinGame").innerHTML = "Join Game";
      });

      this.socket.on("isadmin", () => {
        function appendHtml(el, str) {
          var div = document.createElement("button"); //container to append to
          div.innerHTML = str;
          while (div.children.length > 0) {
            el.appendChild(div.children[0]);
          }
        }
        appendHtml(document.querySelector("#adminControls"), "<button id='showLeaderboard'>Show Leaderboard</button>");
        appendHtml(document.querySelector("#adminControls"), "<button id='hideLeaderboard'>Hide Leaderboard</button>");
        appendHtml(
          document.querySelector("#adminControls"),
          "<button id='resetLeaderboard'>Reset Leaderboard</button>",
        );

        setTimeout(() => {
          document.querySelector("#showLeaderboard").addEventListener("click", (clickEvent) => {
            this.socket.emit("showLeaderboard");
          });
          document.querySelector("#hideLeaderboard").addEventListener("click", (clickEvent) => {
            this.socket.emit("hideLeaderboard");
          });
          document.querySelector("#resetLeaderboard").addEventListener("click", (clickEvent) => {
            this.socket.emit("resetLeaderboard");
          });
        }, 250);
      });

      this.socket.on("error", () => {
        document.querySelector("#introText").innerHTML = "There was an error loading the game.  Please try reloading";
        document.querySelector("#joinGame").innerHTML = "<a href=.>Reload</a>";
      });

      this.socket.on("scoreUpdate", (e) => {
        const params = new Proxy(new URLSearchParams(window.location.search), {
          get: (searchParams, prop) => searchParams.get(prop),
        });
        let value = params[roomBasedOn];
        this.renderer.updateScore(e[value]);

        let scoreArray = [];
        for (let id of Object.keys(e[value])) {
          scoreArray.push({
            id,
            data: e[value][id],
          });
        }
        scoreArray.sort((a, b) => {
          return a.data.kills < b.data.kills;
        });
        // Only send update if you're in the lead
        if (this.renderer.playerShip && this.renderer.playerShip.id == parseInt(scoreArray[0].id)) {
          this.socket.emit("updateLeaderboard", scoreArray);
        }
      });

      this.socket.on("disconnect", (e) => {
        console.log("disconnected");
        document.body.classList.add("disconnected");
        document.body.classList.remove("gameActive");
        document.querySelector("#reconnect").disabled = false;
      });

      if ("autostart" in Utils.getUrlVars()) {
        this.socket.emit("requestRestart");
      }
    });
  }
}
