export default class game extends Phaser.Scene {
    constructor() {
        super({
            key: 'Menu'
        })
    }

    //loads in assets
    preload() {
        this.load.image('button', 'src/assets/beginButton.png');
        this.load.image('background', 'src/assets/titlescreenUno.png');
    }

    //creates everything on the screen
    create() {
        //signifies which screen the user is on
        console.log("menu");

        this.background = this.add.image(400, 300, 'background');

        //switch scenes with the press of the button
        this.button1 = this.add.image(400, 500, 'button').setScale(0.9, 0.9).setInteractive();
        this.button1.once('pointerup', function (){
            this.scene.start('CharSelect');
        }, this);

    }

    update() {

    }
}