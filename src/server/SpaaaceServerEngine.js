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
    };

    onPlayerConnected(socket) {
        super.onPlayerConnected(socket);
        this.gameEngine.makeShip(socket.playerId);
    };

    onPlayerDisconnected(socketId, playerId) {
        super.onPlayerDisconnected(socketId, playerId);
        delete this.gameEngine.world.objects[playerId];
    };
}

module.exports = SpaaaceServerEngine;
