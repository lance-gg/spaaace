const qsOptions = require("query-string").parse(location.search);
const SpaaaceClientEngine = require("../client/SpaaaceClientEngine");
const SpaaaceRenderer = require('../client/SpaaaceRenderer');
const SpaaaceGameEngine = require('../common/SpaaaceGameEngine');
const Synchronizer = require('incheon').Synchronizer;

// default options, overwritten by query-string options
// is sent to both game engine and client engine
const defaults = {
    traceLevel: 1,
    delayInputCount: 3,
    clientIDSpace: 1000000
};
let options = Object.assign(defaults, qsOptions);

// create a client engine, a game engine, a synchronizer, and a renderer
const renderer = new SpaaaceRenderer();
const gameOptions = Object.assign({ renderer }, options);
const gameEngine = new SpaaaceGameEngine(gameOptions);
const spaaaceClientEngine = new SpaaaceClientEngine(gameEngine, options);
const synchronizer = new Synchronizer(spaaaceClientEngine);

// object synchronization:
synchronizer.extrapolateObjectSelector = (obj) => { return true; };

var game = window.game = new Phaser.Game(800, 600, Phaser.AUTO, 'spaaace', { preload, create, update });

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
