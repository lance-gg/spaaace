"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ThrusterEmitterConfig = {
  alpha: {
    start: 0.62,
    end: 0
  },
  scale: {
    start: 0.25,
    end: 0.15
  },
  color: {
    start: "fff191",
    end: "ff622c"
  },
  speed: {
    start: 0,
    end: 0
  },
  startRotation: {
    min: 265,
    max: 275
  },
  rotationSpeed: {
    min: 50,
    max: 50
  },
  lifetime: {
    min: 0.1,
    max: 0.2
  },
  blendMode: "add",
  frequency: 0.001,
  emitterLifetime: 0,
  maxParticles: 300,
  pos: {
    x: 0,
    y: 0
  },
  addAtBack: false,
  spawnType: "circle",
  spawnCircle: {
    x: 0,
    y: 0,
    r: 0
  }
};
var ExplosionEmitterConfig = {
  alpha: {
    start: 0.67,
    end: 0.38
  },
  scale: {
    start: 0.5,
    end: 2,
    minimumScaleMultiplier: 1
  },
  color: {
    start: "#ff3838",
    end: "#f5b830"
  },
  speed: {
    start: 150,
    end: 120,
    minimumSpeedMultiplier: 1
  },
  acceleration: {
    x: 0,
    y: 0
  },
  maxSpeed: 20,
  startRotation: {
    min: 0,
    max: 360
  },
  noRotation: false,
  rotationSpeed: {
    min: 0,
    max: 0
  },
  lifetime: {
    min: 0.4,
    max: 0.4
  },
  blendMode: "screen",
  frequency: 0.003,
  emitterLifetime: 0.31,
  maxParticles: 500,
  pos: {
    x: 0,
    y: 0
  },
  addAtBack: false,
  spawnType: "circle",
  spawnCircle: {
    x: 1,
    y: 0,
    r: 30
  }
};
var PIXI = null;
var PixiParticles = null;

var ShipActor =
/*#__PURE__*/
function () {
  function ShipActor(renderer) {
    _classCallCheck(this, ShipActor);

    PIXI = require('pixi.js');
    PixiParticles = require('pixi-particles');
    this.gameEngine = renderer.gameEngine;
    this.backLayer = renderer.layer1;
    this.sprite = new PIXI.Container();
    this.shipContainerSprite = new PIXI.Container();
    this.shipSprite = new PIXI.Sprite(PIXI.loader.resources.ship.texture); // keep a reference to the actor from the sprite

    this.sprite.actor = this;
    this.shipSprite.anchor.set(0.5, 0.5);
    this.shipSprite.width = 50;
    this.shipSprite.height = 45;
    this.addThrustEmitter();
    this.sprite.addChild(this.shipContainerSprite);
    this.shipContainerSprite.addChild(this.shipSprite);
  }

  _createClass(ShipActor, [{
    key: "renderStep",
    value: function renderStep(delta) {
      if (this.thrustEmitter) {
        this.thrustEmitter.update(delta * 0.001);
        this.thrustEmitter.spawnPos.x = this.sprite.x - Math.cos(-this.shipContainerSprite.rotation) * 4;
        this.thrustEmitter.spawnPos.y = this.sprite.y + Math.sin(-this.shipContainerSprite.rotation) * 4;
        this.thrustEmitter.minStartRotation = this.shipContainerSprite.rotation * 180 / Math.PI + 180 - 1;
        this.thrustEmitter.maxStartRotation = this.shipContainerSprite.rotation * 180 / Math.PI + 180 + 1;
      }

      if (this.explosionEmitter) {
        this.explosionEmitter.update(delta * 0.001);
      }
    }
  }, {
    key: "addThrustEmitter",
    value: function addThrustEmitter() {
      this.thrustEmitter = new PIXI.particles.Emitter(this.backLayer, [PIXI.loader.resources.smokeParticle.texture], ThrusterEmitterConfig);
      this.thrustEmitter.emit = false;
      this.explosionEmitter = new PIXI.particles.Emitter(this.shipContainerSprite, [PIXI.loader.resources.smokeParticle.texture], ExplosionEmitterConfig);
      this.explosionEmitter.emit = false;
    }
  }, {
    key: "changeName",
    value: function changeName(name) {
      if (this.nameText != null) {
        this.nameText.destroy();
      }

      this.nameText = new PIXI.Text(name, {
        fontFamily: 'arial',
        fontSize: '12px',
        fill: 'white'
      });
      this.nameText.anchor.set(0.5, 0.5);
      this.nameText.y = -40;
      this.nameText.alpha = 0.3;
      this.sprite.addChild(this.nameText);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      var _this = this;

      return new Promise(function (resolve) {
        _this.explosionEmitter.emit = true;
        if (_this.nameText) _this.nameText.destroy({
          texture: false
        });
        if (_this.thrustEmitter) _this.thrustEmitter.destroy();
        if (_this.shipSprite) _this.shipSprite.destroy();
        _this.nameText = null;
        _this.thrustEmitter = null;
        _this.shipSprite = null;
        setTimeout(function () {
          _this.shipContainerSprite.destroy();

          _this.explosionEmitter.destroy();

          resolve();
        }, 300);
      });
    }
  }]);

  return ShipActor;
}();

exports.default = ShipActor;
//# sourceMappingURL=ShipActor.js.map