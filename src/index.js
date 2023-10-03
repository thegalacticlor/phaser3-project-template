import Phaser from 'phaser';
import Game from './scenes/game.js';
import Menu from './scenes/menu.js';
import CharSelect from './scenes/characterSelect.js';
import Win from './scenes/win.js'

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600,
        zoom: 4
    },
    scene: [
        Menu,
        CharSelect,
        Game,
        Win
    ]
};

const game = new Phaser.Game(config);
