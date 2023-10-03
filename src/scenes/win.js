export default class win extends Phaser.Scene {
    constructor() {
        super({
            key: 'Win'
        })
    }
    init (data) {
        console.log('init', data);
        this.didWin = data.didWin;
        this.character = data.character;
    }

    //loads in assets
    preload() {
        this.load.image('restartButton', 'src/assets/restartButton.png');
        this.load.image('lostBack', 'src/assets/lostBack.png');
        this.load.image('winBack', 'src/assets/winBack.png');
        this.load.atlas("charicon","src/assets/characters/charicons.png","src/assets/characters/charicons.json");
    }

    //creates everything on the screen
    create() {
        //signifies which screen the user is on
        console.log("win screen");
        let winImage = this.add.image(400, 300, 'winBack').setVisible(false);
        let lossImage = this.add.image(400, 300, 'lostBack').setVisible(false);

        //background
        if (this.didWin == true) {
            winImage.setVisible(true);
        } else {
            lossImage.setVisible(true);
        }

        //loads correct icon character
        if (this.character === 'comit') {
            var charI = this.add.sprite(400, 150,"charicon", "iconcomit").setScale(.3, .3).setInteractive();
        } else if (this.character === 'sun') {
            var charI = this.add.sprite(400, 150,"charicon", "iconsun").setScale(.3, .3).setInteractive();
        } else if (this.character === 'nebula') {
            var charI = this.add.sprite(400, 150,"charicon", "iconnebula").setScale(.3, .3).setInteractive();
        } else if (this.character === 'juno') {
            var charI = this.add.sprite(400, 150,"charicon", "iconjuno").setScale(.3, .3).setInteractive();
        } else if (this.character === 'blackhole') {
            var charI = this.add.sprite(400, 150,"charicon", "iconblackhole").setScale(.3, .3).setInteractive();
        } else if (this.character === 'neptune') {
            var charI = this.add.sprite(400, 150,"charicon", "iconneptune").setScale(.3, .3).setInteractive();
        }

        //switch scenes with the press of the button
        this.button1 = this.add.image(400, 500, 'restartButton').setInteractive();
        this.button1.once('pointerup', function (){
            location.reload();
        }, this);

    }

    update() {

    }
}