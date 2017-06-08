const qsOptions = require('query-string').parse(location.search);
const SpaaaceClientEngine = require('../client/SpaaaceClientEngine');
const SpaaaceGameEngine = require('../common/SpaaaceGameEngine');
require('../../assets/sass/main.scss');

// default options, overwritten by query-string options
// is sent to both game engine and client engine
const defaults = {
    traceLevel: 1000,
    delayInputCount: 8,
    clientIDSpace: 1000000,
    syncOptions: {
        sync: qsOptions.sync || 'extrapolate',
        localObjBending: 0.2,
        remoteObjBending: 0.5
    },
    physics: {
        collisionOptions: {
            COLLISION_DISTANCE: 25
        }
    }
};

let options = Object.assign(defaults, qsOptions);

// create a client engine and a game engine
const gameEngine = new SpaaaceGameEngine(options);
const clientEngine = new SpaaaceClientEngine(gameEngine, options);

clientEngine.start();
