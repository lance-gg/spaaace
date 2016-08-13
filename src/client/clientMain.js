const SpaaaceClientEngine = require("../client/SpaaaceClientEngine");
const SpaaaceRenderer = require('../client/SpaaaceRenderer');
const SpaaaceGameEngine = require('../common/SpaaaceGameEngine');
const Synchronizer = require('incheon').Synchronizer;

// create a client engine, a game engine, a synchronizer, and a renderer
const renderer = new SpaaaceRenderer();
const gameEngine = new SpaaaceGameEngine({ renderer, clientIDSpace: 1000000 });
const spaaaceClientEngine = new SpaaaceClientEngine(gameEngine);
const synchronizer = new Synchronizer(spaaaceClientEngine);

// object synchronization:
// use client prediction for objects controlled by the client
// interpolate all the rest
synchronizer.interpolateObjectSelector = (obj) => { return !obj.isPlayerControlled; };
synchronizer.clientPredictionSelector = (obj) => { return obj.isPlayerControlled; };

var game = window.game = new Phaser.Game(800, 600, Phaser.AUTO, 'spaaace', { preload: preload, create: create, update: update });

function preload() {
    game.load.image('ship', 'assets/ship1.png');
    game.load.image('missile', 'assets/shot.png');

    game.load.audio('missileHit', 'assets/audio/193429__unfa__projectile-hit.mp3');
    game.load.audio('fireMissile', 'assets/audio/248293__chocobaggy__weird-laser-gun.mp3');
}

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.disableVisibilityChange = true;
    game.stage.backgroundColor = 'black';


    spaaaceClientEngine.start();
}

function update() {

    spaaaceClientEngine.step();
}
