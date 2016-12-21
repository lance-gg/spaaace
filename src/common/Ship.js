'use strict';

const DynamicObject= require('incheon').serialize.DynamicObject;
const Point = require("incheon").Point;

class Ship extends DynamicObject {

    constructor(id, gameEngine, x, y) {
        super(id, x, y);
        this.class = Ship;
        this.gameEngine = gameEngine;
    };

    get maxSpeed() { return 5.0; }

    attachAI(){
        this.isBot = true;
        this.gameEngine.on("preStep",()=>{
            this.steer();
        });
    }

    steer(){
        let closestTarget = null;
        let closestDistance = Infinity;
        for (let objId of Object.keys(this.gameEngine.world.objects)) {
            let obj = this.gameEngine.world.objects[objId];
            let dx = this.x - obj.x, dy = this.y - obj.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (obj != this && distance < closestDistance){
                closestTarget = obj;
                closestDistance = distance;
            }
        }
        this.target = closestTarget;

        if (this.target){
            let desiredVelocity = new Point();
            desiredVelocity.copyFrom(this.target).subtract(this.x, this.y);
            let turnRight = -shortestArc(Math.atan2(desiredVelocity.y,desiredVelocity.x),Math.atan2(Math.sin(this.angle*Math.PI/180), Math.cos(this.angle*Math.PI/180)));

            if (turnRight > 0.05) {
                this.isRotatingRight = true;
            }
            else if (turnRight < -0.05) {
                this.isRotatingLeft = true;
            }
            else {
                this.isAccelerating = true;
            }

        }
    }
}

function shortestArc(a, b) {
    if (Math.abs(b-a) < Math.PI) return b-a;
    if (b>a)  return b-a-Math.PI*2;
    return b-a+Math.PI*2;
}

module.exports = Ship;
