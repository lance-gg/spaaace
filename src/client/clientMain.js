const SpaaaceClientEngine = require("../client/SpaaaceClientEngine");
const SpaaaceGameEngine = require('../common/SpaaaceGameEngine');

var gameEngine = new SpaaaceGameEngine();
var spaaaceClientEngine = new SpaaaceClientEngine(gameEngine);

var game = window.game = new Phaser.Game(800, 600, Phaser.AUTO, 'spaaace', { preload: preload, create: create, update: update });

function preload() {
    game.load.image('ship', 'assets/ship1.png');
    game.load.image('missile', 'assets/shot.png');
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
