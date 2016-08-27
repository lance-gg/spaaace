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

    // TODO:
    // 1. rather than tell the gameEngine to process the input now, it should
    //    be queued with a list of inputs to be processed at the beginning of the
    //    next step
    // 2. this should actually be done by the base class ServerEngine
    onReceivedInput(inputData, socket){
        super.onReceivedInput(inputData, socket);
        this.gameEngine.processInput(inputData, socket.playerId)
    }

}

module.exports = SpaaaceServerEngine;
