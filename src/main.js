const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
import { Lib } from 'lance-gg';

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, '../dist/index.html');

// define routes and socket
const server = express();
server.get('/', function(req, res) { res.sendFile(INDEX); });
server.use('/', express.static(path.join(__dirname, '../dist/')));
let requestHandler = server.listen(PORT, () => console.log(`Listening on ${ PORT }`));
const io = socketIO(requestHandler);

// Game Server
import SpaaaceServerEngine from './server/SpaaaceServerEngine.js';
import SpaaaceGameEngine from './common/SpaaaceGameEngine.js';

// Game Instances
const gameEngine = new SpaaaceGameEngine({ traceLevel: Lib.Trace.TRACE_NONE });
const serverEngine = new SpaaaceServerEngine(io, gameEngine, {
    debug: {},
    updateRate: 6,
    timeoutInterval: 0 // no timeout
});

// start the game
serverEngine.start();
