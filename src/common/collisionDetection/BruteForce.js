"use strict";

class BruteForce {
    
    constructor(gameEngine){
        this.gameEngine = gameEngine;

        this.collisionPairs = {};

        this.gameEngine.on("poststep",this.updateObjects.bind(this));
    };
    
    updateObjects(){

        for(let objAId in this.gameEngine.world.objects){
            for(let objBId in this.gameEngine.world.objects){
                if (objBId == objAId) continue;
                let x1 = this.gameEngine.world.objects[objAId].x;
                let y1 = this.gameEngine.world.objects[objAId].y;

                let x2 = this.gameEngine.world.objects[objBId].x;
                let y2 = this.gameEngine.world.objects[objBId].y;


                // console.log(objAId, objB, x1,y1, x2,y2);
                let distance = Math.sqrt( (x2-=x1)*x2 + (y2-=y1)*y2 );
                let pairId =[objAId, objBId].sort().join(",");

                if (distance < 50){
                    if (!(pairId in this.collisionPairs)){
                        this.collisionPairs[pairId] = true;
                        this.gameEngine.emit("collisionStart", {
                            a: this.gameEngine.world.objects[objAId],
                            b: this.gameEngine.world.objects[objBId]
                        });
                        // console.log("collision start", pairId);
                    }
                }
                else{
                    if (pairId in this.collisionPairs){
                        this.gameEngine.emit("collisionStop", {
                            a: this.gameEngine.world.objects[objAId],
                            b: this.gameEngine.world.objects[objBId]
                        });
                        delete this.collisionPairs[pairId];
                        // console.log("collision stop", pairId);
                    }
                }
            }
        }

    }

}


module.exports = BruteForce;