"use strict";

const path = require('path');
const Ship = require('../common/Ship');
const ServerEngine = require('Incheon').ServerEngine;

class SpaaaceServerEngine extends ServerEngine{
    constructor(io, gameEngine, inputOptions){
        super(io, gameEngine, inputOptions);
    };

    start(){
        super.start();
    };

    onPlayerConnected(socket){
        super.onPlayerConnected(socket);

        var that=this;

        this.gameEngine.makeShip(socket.playerId);



    };

    onPlayerDisconnected(socketId, playerId){
        super.onPlayerDisconnected(socketId, playerId);

        delete this.gameEngine.world.objects[playerId];
    };

    onReceivedInput(inputData, socket){
        super.onReceivedInput(inputData, socket);
        this.gameEngine.processInput(inputData, socket.playerId)
    }

}

module.exports = SpaaaceServerEngine;