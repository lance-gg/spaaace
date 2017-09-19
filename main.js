'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, './index.html');
const FAKE_LAG = process.env.FAKE_LAG || 0;

// define routes and socket
const server = express();
server.get('/', function(req, res) { res.sendFile(INDEX); });
server.use('/', express.static(path.join(__dirname, '.')));
let requestHandler = server.listen(PORT, () => console.log(`Listening on ${ PORT }`));
const io = socketIO(requestHandler);

if (FAKE_LAG) {
  const origOn = io.on.bind(io);
  io.on = function(ev, cb) {
    return origOn(ev, function(socket) {
      const oldOn = socket.on.bind(socket);
      socket.on = function(ev, cb) {
        return oldOn(ev, function(...args) {
          setTimeout(() => cb(...args), FAKE_LAG);
        });
      };
      return cb(socket);
    });
  }
}

// Game Server
const SpaaaceServerEngine = require(path.join(__dirname, 'src/server/SpaaaceServerEngine.js'));
const SpaaaceGameEngine = require(path.join(__dirname, 'src/common/SpaaaceGameEngine.js'));
const SimplePhysicsEngine = require('lance-gg').physics.SimplePhysicsEngine;

// Game Instances
const physicsEngine = new SimplePhysicsEngine({ collisionOptions: { COLLISION_DISTANCE: 50 } } );
const gameEngine = new SpaaaceGameEngine({ physicsEngine });
const serverEngine = new SpaaaceServerEngine(io, gameEngine, { timeoutInterval: 60 * 5 , debug: {} });

// start the game
serverEngine.start();
