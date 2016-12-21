'use strict';

const GameEngine = require('incheon').GameEngine;
const Missile= require('./Missile');
const Ship = require('./Ship');

class SpaaaceGameEngine extends GameEngine {

    start() {
        let that = this;
        super.start();

        this.worldSettings = {
            worldWrap: true,
            width: 3000,
            height: 3000
        };

        this.on('collisionStart', function(e) {
            let collisionObjects = Object.keys(e).map(k => e[k]);
            let ship = collisionObjects.find(o => o.class === Ship);
            let missile = collisionObjects.find(o => o.class === Missile);

            if (!ship || !missile)
                return;

            if (missile.playerId !== ship.playerId) {
                that.destroyMissile(missile.id);
                that.emit('missileHit', { missile, ship });
                console.log(`ouch.  that hurts.`);
            }
        });
    };

    processInput(inputData, playerId) {

        super.processInput(inputData, playerId);

        // get the player ship tied to the player socket
        let playerShip;

        for (let objId in this.world.objects) {
            if (this.world.objects[objId].playerId == playerId) {
                playerShip = this.world.objects[objId];
                break;
            }
        }

        if (playerShip) {
            if (inputData.input == 'up') {
                playerShip.isAccelerating = true;
            } else if (inputData.input == 'right') {
                playerShip.isRotatingRight = true;
            } else if (inputData.input == 'left') {
                playerShip.isRotatingLeft = true;
            } else if (inputData.input == 'space') {
                this.makeMissile(playerShip, inputData.messageIndex);
                this.emit('fireMissile');
            }
        }
    };

    makeShip() {
        let newShipX = Math.floor(Math.random()*(this.worldSettings.width-200)) + 200;
        let newShipY = Math.floor(Math.random()*(this.worldSettings.height-200)) + 200;

        let ship = new Ship(++this.world.idCount, this, newShipX, newShipY);
        this.addObjectToWorld(ship);

        return ship;
    };

    makeMissile(playerShip, inputId) {
        let missile = new Missile(++this.world.idCount);
        missile.x = playerShip.x;
        missile.y = playerShip.y;
        missile.angle = playerShip.angle;
        missile.playerId = playerShip.playerId;
        missile.inputId = inputId;
        missile.velocity.set(
            Math.cos(missile.angle * (Math.PI / 180)),
            Math.sin(missile.angle * (Math.PI / 180))
        ).setMagnitude(10)
        .add(playerShip.velocity.x, playerShip.velocity.y);
        missile.velX = missile.velocity.x;
        missile.velY = missile.velocity.y;

        this.trace.trace(`missile created vx=${missile.velocity.x} vy=${missile.velocity.y}`);


        this.addObjectToWorld(missile);
        this.timer.add(40, this.destroyMissile, this, [missile.id]);

        return missile;
    }

    // destroy the missile if it still exists
    destroyMissile(missileId) {
        if (this.world.objects[missileId])
            this.removeObjectFromWorld(missileId);
    }
}

module.exports = SpaaaceGameEngine;
