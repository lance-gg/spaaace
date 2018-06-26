import Howler from 'howler'; // eslint-disable-line no-unused-vars
import ClientEngine from 'lance/ClientEngine';
import SpaaaceRenderer from '../client/SpaaaceRenderer';
import KeyboardControls from 'lance/controls/KeyboardControls';
import MobileControls from './MobileControls';
import Ship from '../common/Ship';
import Utils from '../common/Utils';

export default class SpaaaceClientEngine extends ClientEngine {

    constructor(gameEngine, options) {
        super(gameEngine, options, SpaaaceRenderer);
    }

    start() {
        super.start();

        // handle gui for game condition
        this.gameEngine.on('objectDestroyed', (obj) => {
            if (obj instanceof Ship && this.gameEngine.isOwnedByPlayer(obj)) {
                document.body.classList.add('lostGame');
                document.querySelector('#tryAgain').disabled = false;
            }
        });

        this.gameEngine.once('renderer.ready', () => {
            // click event for "try again" button
            document.querySelector('#tryAgain').addEventListener('click', () => {
                if (Utils.isTouchDevice()){
                    this.renderer.enableFullScreen();
                }
                this.socket.emit('requestRestart');
            });

            document.querySelector('#joinGame').addEventListener('click', (clickEvent) => {
                if (Utils.isTouchDevice()){
                    this.renderer.enableFullScreen();
                }
                clickEvent.currentTarget.disabled = true;
                this.socket.emit('requestRestart');
            });

            document.querySelector('#reconnect').addEventListener('click', () => {
                window.location.reload();
            });

            //  Game input
            if (Utils.isTouchDevice()){
                this.controls = new MobileControls(this);
                this.controls.on('fire', () => {
                    this.sendInput('space');
                });
            } else {
                this.controls = new KeyboardControls(this);
                this.controls.bindKey('left', 'left', { repeat: true });
                this.controls.bindKey('right', 'right', { repeat: true });
                this.controls.bindKey('up', 'up', { repeat: true } );
                this.controls.bindKey('space', 'space');
            }

        });

        // allow a custom path for sounds
        let assetPathPrefix = this.options.assetPathPrefix ? this.options.assetPathPrefix : '';

        // handle sounds
        this.sounds = {
            missileHit: new Howl({ src: [assetPathPrefix + 'assets/audio/193429__unfa__projectile-hit.mp3'] }),
            fireMissile: new Howl({ src: [assetPathPrefix + 'assets/audio/248293__chocobaggy__weird-laser-gun.mp3'] })
        };

        this.gameEngine.on('fireMissile', () => { this.sounds.fireMissile.play(); });
        this.gameEngine.on('missileHit', () => {
            // don't play explosion sound if the player is not in game
            if (this.renderer.playerShip) {
                this.sounds.missileHit.play();
            }
        });

        this.networkMonitor.on('RTTUpdate', (e) => {
            this.renderer.updateHUD(e);
        });
    }

    // extend ClientEngine connect to add own events
    connect() {
        return super.connect().then(() => {
            this.socket.on('scoreUpdate', (e) => {
                this.renderer.updateScore(e);
            });

            this.socket.on('disconnect', (e) => {
                console.log('disconnected');
                document.body.classList.add('disconnected');
                document.body.classList.remove('gameActive');
                document.querySelector('#reconnect').disabled = false;
            });

            if ('autostart' in Utils.getUrlVars()) {
                this.socket.emit('requestRestart');
            }
        });
    }

}
