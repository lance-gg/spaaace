'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, './dist/index.html');

// define routes and socket
const server = express();
server.get('/', function(req, res) { res.sendFile(INDEX); });
server.use('/', express.static(path.join(__dirname, './dist/')));
let requestHandler = server.listen(PORT, () => console.log(`Listening on ${ PORT }`));
const io = socketIO(requestHandler);

// Game Server
import MyServerEngine from './src/server/SpaaaceServerEngine.js';
import MyGameEngine from './src/common/SpaaaceGameEngine.js';


// Game Instances
const gameEngine = new MyGameEngine({ traceLevel: 1000 });
const serverEngine = new MyServerEngine(io, gameEngine, {
    debug: {},
    updateRate: 6,
    timeoutInterval: 0 // no timeout
});

// start the game
serverEngine.start();
