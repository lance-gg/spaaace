'use strict';

const Serializer = require('incheon').serialize.Serializer;
const DynamicObject = require('incheon').serialize.DynamicObject;
const Utils = require('./Utils');

class Ship extends DynamicObject {

    static get netScheme() {
        return Object.assign({
            showThrust: { type: Serializer.TYPES.INT32 }
        }, super.netScheme);
    }

    toString() {
        return `${this.isBot?'Bot':'Player'}::Ship::${super.toString()}`;
    }

    get bendingAngleLocalMultiple() { return 0.0; }

    syncTo(other) {
        super.syncTo(other);
        this.showThrust = other.showThrust;
    }

    constructor(id, gameEngine, x, y) {
        super(id, x, y);
        this.class = Ship;
        this.gameEngine = gameEngine;
        this.showThrust = 0;
    };

    destroy() {
        if (this.fireLoop) {
            this.fireLoop.destroy();
        }
        if (this.onPreStep){
            this.gameEngine.removeListener('preStep', this.onPreStep);
            this.onPreStep = null;
        }
    }

    get maxSpeed() { return 3.0; }

    attachAI() {
        this.isBot = true;

        this.onPreStep = () => {
            this.steer();
        };

        this.gameEngine.on('preStep', this.onPreStep);

        let fireLoopTime = Math.round(250 + Math.random() * 100);
        this.fireLoop = this.gameEngine.timer.loop(fireLoopTime, () => {
            if (this.target && this.distanceToTarget(this.target) < 400) {
                this.gameEngine.makeMissile(this);
            }
        });
    }

    distanceToTarget(target) {
        let dx = this.position.x - target.position.x;
        let dy = this.position.y - target.position.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    steer() {
        let closestTarget = null;
        let closestDistance = Infinity;
        for (let objId of Object.keys(this.gameEngine.world.objects)) {
            let obj = this.gameEngine.world.objects[objId];
            let distance = this.distanceToTarget(obj);
            if (obj != this && distance < closestDistance) {
                closestTarget = obj;
                closestDistance = distance;
            }
        }
        this.target = closestTarget;

        if (this.target) {

            let newVX = this.target.position.x - this.position.x;
            let newVY = this.target.position.y - this.position.y

            let turnRight = -Utils.shortestArc(Math.atan2(newVX, newVY), Math.atan2(Math.sin(this.angle*Math.PI/180), Math.cos(this.angle*Math.PI/180)));

            if (turnRight > 0.05) {
                this.isRotatingRight = true;
            } else if (turnRight < -0.05) {
                this.isRotatingLeft = true;
            } else {
                this.isAccelerating = true;
                this.showThrust = 5;
            }

        }
    }
}

module.exports = Ship;
