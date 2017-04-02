'use strict';

const ServerEngine = require('lance-gg').ServerEngine;
const nameGenerator = require('./NameGenerator');
const NUM_BOTS = 3;

class SpaaaceServerEngine extends ServerEngine {
    constructor(io, gameEngine, inputOptions) {
        super(io, gameEngine, inputOptions);

        this.serializer.registerClass(require('../common/Missile'));
        this.serializer.registerClass(require('../common/Ship'));

        this.scoreData = {};
    }

    start() {
        super.start();
        for (let x = 0; x < NUM_BOTS; x++) this.makeBot();

        this.gameEngine.on('missileHit', (e) => {
            // add kills
            if (this.scoreData[e.missile.ownerId]) this.scoreData[e.missile.ownerId].kills++;
            // remove score data for killed ship
            delete this.scoreData[e.ship.id];
            this.updateScore();

            console.log(`ship killed: ${e.ship.toString()}`);
            this.gameEngine.removeObjectFromWorld(e.ship.id);
            if (e.ship.isBot) {
                setTimeout(() => this.makeBot(), 5000);
            }
        });
    }

    onPlayerConnected(socket) {
        super.onPlayerConnected(socket);

        let makePlayerShip = () => {
            let ship = this.gameEngine.makeShip(socket.playerId);

            this.scoreData[ship.id] = {
                kills: 0,
                name: nameGenerator('general')
            };
            this.updateScore();
        };

        // handle client restart requests
        socket.on('requestRestart', makePlayerShip);
    }

    onPlayerDisconnected(socketId, playerId) {
        super.onPlayerDisconnected(socketId, playerId);

        // iterate through all objects, delete those that are associated with the player
        for (let objId of Object.keys(this.gameEngine.world.objects)) {
            let obj = this.gameEngine.world.objects[objId];
            if (obj.playerId == playerId) {
                // remove score data
                if (this.scoreData[objId]) {
                    delete this.scoreData[objId];
                }
                delete this.gameEngine.world.objects[objId];
            }
        }

        this.updateScore();
    }

    makeBot() {
        let bot = this.gameEngine.makeShip(0);
        bot.attachAI();

        this.scoreData[bot.id] = {
            kills: 0,
            name: nameGenerator('general') + 'Bot'
        };

        this.updateScore();
    }

    updateScore() {
        // delay so player socket can catch up
        setTimeout(() => {
            this.io.sockets.emit('scoreUpdate', this.scoreData);
        }, 1000);

    }
}

module.exports = SpaaaceServerEngine;
