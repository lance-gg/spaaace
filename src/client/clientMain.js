import querystring from 'query-string';
import Trace from 'lance/lib/Trace';
import SpaaaceClientEngine from './SpaaaceClientEngine';
import SpaaaceGameEngine from '../common/SpaaaceGameEngine';
import '../../dist/assets/sass/main.scss';
const qsOptions = querystring.parse(location.search);

// sent to both game engine and client engine
const defaults = {
    traceLevel: Trace.TRACE_NONE,
    delayInputCount: 8,
    scheduler: 'render-schedule',
    syncOptions: {
        sync: qsOptions.sync || 'extrapolate',
        localObjBending: 0.2,
        remoteObjBending: 0.5
    }
};
let options = Object.assign(defaults, qsOptions);

// create a client engine and a game engine
const gameEngine = new SpaaaceGameEngine(options);
const clientEngine = new SpaaaceClientEngine(gameEngine, options);

clientEngine.start();
