"use strict";


const Point= require('Incheon').Point;
const Serializable= require('Incheon').Composables.Serializable;

/**
 * Defines an objects which can move about in the game world
 */
class DynamicObject extends Serializable {

    static get netScheme(){
        return {
            id: { type: Serializable.TYPES.UINT8 },
            x: { type: Serializable.TYPES.INT16 },
            y: { type: Serializable.TYPES.INT16 },
            velX: { type: Serializable.TYPES.FLOAT32 },
            velY: { type: Serializable.TYPES.FLOAT32 },
            angle: { type: Serializable.TYPES.INT16 }
        }
    }

    constructor(id, x, y){
        super();
        this.id = id; //instance id
        this.x = x;
        this.y = y;
        this.velX = 0;
        this.velY = 0;
        this.angle = 90;
        this.rotationSpeed = 3;
        this.acceleration = 0.1;
        this.deceleration = 0.99;
        this.maxSpeed = 2;

        //todo deal with what goes over the wire
        this.velocity = new Point();
        this.temp={
            accelerationVector: new Point()
        };

    };

    step(worldSettings){
        if (this.isRotatingRight){ this.angle += this.rotationSpeed; }
        if (this.isRotatingLeft){this.angle -= this.rotationSpeed; }

        if(this.angle>360){ this.angle -= 360; }
        if(this.angle<0){ this.angle += 360; }

        if (this.isAccelerating) {
            this.temp.accelerationVector.set(
                Math.cos( this.angle * (Math.PI / 180) ),
                Math.sin( this.angle * (Math.PI / 180) )
            ).setMagnitude(this.acceleration);
        }
        else{
            this.temp.accelerationVector.set(0,0);
        }

        // console.log(this.temp.accelerationVector.x,this.temp.accelerationVector.y);
        // console.log(this.temp.accelerationVector.x, this.temp.accelerationVector.y);
        // console.log(this.temp.accelerationVector.x, this.temp.accelerationVector.y);
        Point.add(this.velocity,this.temp.accelerationVector, this.velocity);
        this.velocity.multiply(this.deceleration, this.deceleration);
        this.velocity.x = Math.round(this.velocity.x * 100)/100;
        this.velocity.y = Math.round(this.velocity.y * 100)/100;

        this.velX = this.velocity.x;
        this.velY = this.velocity.y;

        this.isAccelerating = false;
        this.isRotatingLeft = false;
        this.isRotatingRight = false;
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;

        if (this.x>=worldSettings.width){ this.x = worldSettings.width - this.x;}
        else if (this.y>=worldSettings.height){ this.y = worldSettings.height - this.y;}
        else if (this.x < 0){ this.x = worldSettings.width + this.x;}
        else if (this.y<0){ this.y = worldSettings.width + this.y;}
    };

}


module.exports = DynamicObject;