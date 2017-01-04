'use strict';

const ServerEngine = require('incheon').ServerEngine;

class SpaaaceServerEngine extends ServerEngine {
    constructor(io, gameEngine, inputOptions) {
        super(io, gameEngine, inputOptions);

        this.serializer.registerClass(require('../common/Missile'));
        this.serializer.registerClass(require('../common/Ship'));

        this.scoreData = {

        }
    };

    start() {
        super.start();
        let bot1 = this.gameEngine.makeShip();
        bot1.attachAI();

        let bot2 = this.gameEngine.makeShip();
        bot2.attachAI();

        let bot3 = this.gameEngine.makeShip();
        bot3.attachAI();

        this.gameEngine.on('missileHit', (e)=>{
            if (this.scoreData[e.missile.shipOwnerId]){
                //add kills
                this.scoreData[e.missile.shipOwnerId].kills++;
                //remove score data for killed ship
                delete this.scoreData[e.ship.id]
            }
            this.updateScore();

            this.gameEngine.removeObjectFromWorld(e.ship.id);
            if(e.ship.isBot) {
                this.makeBot();
            }
        });
    };

    onPlayerConnected(socket) {
        super.onPlayerConnected(socket);

        let makePlayerShip = ()=>{
            let ship = this.gameEngine.makeShip();
            ship.playerId = socket.playerId;

            this.scoreData[ship.id] = {
                kills: 0,
                name: 'Ship' + socket.playerId
            };
            this.updateScore();
        };

        makePlayerShip();

        // handle client restart requests
        socket.on('requestRestart', makePlayerShip);
    };

    onPlayerDisconnected(socketId, playerId) {
        super.onPlayerDisconnected(socketId, playerId);

        // iterate through all objects, delete those that are associated with the player
        for (let objId of Object.keys(this.gameEngine.world.objects)) {
            let obj = this.gameEngine.world.objects[objId];
            if (obj.playerId == playerId) {
                //remove score data
                if (this.scoreData[objId]){
                    delete this.scoreData[objId]
                }
                delete this.gameEngine.world.objects[objId];
            }
        }

        this.updateScore();
    };

    makeBot() {
        let bot = this.gameEngine.makeShip();
        bot.attachAI();

        this.scoreData[bot.id] = {
            kills: 0,
            name: 'Bot' + bot.id
        };

        this.updateScore();
    }

    updateScore(){
        this.io.emit('scoreUpdate',this.scoreData);
    }
}

module.exports = SpaaaceServerEngine;
