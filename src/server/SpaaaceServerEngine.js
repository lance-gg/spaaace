"use strict";

const path = require('path');
const Ship = require('../common/Ship');
const ServerEngine = require('incheon').ServerEngine;

class SpaaaceServerEngine extends ServerEngine{
    constructor(io, gameEngine, inputOptions){
        super(io, gameEngine, inputOptions);

        this.serializer.registerClass(require('../common/Ship'));
        this.serializer.registerClass(require('../common/Missile'));
    };

    start(){
        super.start();
    };

    onPlayerConnected(socket){
        super.onPlayerConnected(socket);

        var that = this;
        this.gameEngine.makeShip(socket.playerId);
    };

    onPlayerDisconnected(socketId, playerId){
        super.onPlayerDisconnected(socketId, playerId);

        delete this.gameEngine.world.objects[playerId];
    };
}

module.exports = SpaaaceServerEngine;
