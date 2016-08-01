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
        // super.start();

        var ship = new Ship(1, 2, 3);


        var createEvent = this.networkTransmitter.addNetworkedEvent("objectUpdate",{
            stepCount: 777,
            objectInstance: ship
        });



        let dataBuffer = createEvent.serialize(this.serializer);
        // var deser = this.serializer.deserialize(dataBuffer);
        // console.log(deser.stepCount);
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