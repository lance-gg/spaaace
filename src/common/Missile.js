import Serializer from 'lance/serialize/Serializer';
import DynamicObject from 'lance/serialize/DynamicObject';
import PixiRenderableComponent from 'lance/render/pixi/PixiRenderableComponent';

export default class Missile extends DynamicObject {

    constructor(gameEngine, options, props){
        super(gameEngine, options, props);

        this.addComponent(new PixiRenderableComponent({
            assetName: 'missile',
            width: 40,
            height: 23
        }));
    }

    // this is what allows usage of shadow object with input-created objects (missiles)
    // see https://medium.com/javascript-multiplayer-gamedev/chronicles-of-the-development-of-a-multiplayer-game-part-2-loops-and-leaks-10b453e843e0
    // in the future this will probably be embodied in a component

    static get netScheme() {
        return Object.assign({
            inputId: { type: Serializer.TYPES.INT32 }
        }, super.netScheme);
    }

    syncTo(other) {
        super.syncTo(other);
        this.inputId = other.inputId;
    }
}