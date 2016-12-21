'use strict';

const ServerEngine = require('incheon').ServerEngine;

class SpaaaceServerEngine extends ServerEngine {
    constructor(io, gameEngine, inputOptions) {
        super(io, gameEngine, inputOptions);

        this.serializer.registerClass(require('../common/Missile'));
        this.serializer.registerClass(require('../common/Ship'));
    };

    start() {
        super.start();
        let bot1 = this.gameEngine.makeShip();
        bot1.attachAI();

        let bot2 = this.gameEngine.makeShip();
        bot2.attachAI();

        let bot3 = this.gameEngine.makeShip();
        bot3.attachAI();
    };

    onPlayerConnected(socket) {
        super.onPlayerConnected(socket);
        let ship = this.gameEngine.makeShip();
        ship.playerId = socket.playerId;
    };

    onPlayerDisconnected(socketId, playerId) {
        super.onPlayerDisconnected(socketId, playerId);

        //iterate through all objects, delete those that are associated with the player
        for (let objId of Object.keys(this.gameEngine.world.objects)){
            let obj = this.gameEngine.world.objects[objId];
            if (obj.playerId == playerId) {
                delete this.gameEngine.world.objects[objId];
            }
        }
    };
}

module.exports = SpaaaceServerEngine;
