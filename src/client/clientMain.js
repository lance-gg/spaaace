const SpaaaceClientEngine = require("../client/SpaaaceClientEngine");
const SpaaaceRenderer = require('../client/SpaaaceRenderer');
const SpaaaceGameEngine = require('../common/SpaaaceGameEngine');
const InterpolateStrategy = require('incheon').syncStrategies.InterpolateStrategy;
const ClientPredictionStrategy = require('incheon').syncStrategies.ClientPredictionStrategy;

const renderer = new SpaaaceRenderer();
const gameEngine = new SpaaaceGameEngine({ renderer });
const spaaaceClientEngine = new SpaaaceClientEngine(gameEngine);
new InterpolateStrategy(spaaaceClientEngine, {});
new ClientPredictionStrategy(spaaaceClientEngine, {});

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
