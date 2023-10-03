//tcpip connections - ip adress based


export default class game extends Phaser.Scene {
    constructor() {
        super({
            key: 'CharSelect'
        })
    }

    //loads in assets
    preload() {
        this.load.image('buttonStart', 'src/assets/startButton.png');
        this.load.atlas("chars","src/assets/characters/chars.png","src/assets/characters/chars.json");
        this.load.atlas("charicon","src/assets/characters/charicons.png","src/assets/characters/charicons.json");
    }

    //creates everything on the screen
    create() {
        //signifies which screen the user is on
        console.log("select");

        this.numberText = this.add.text(20, 20, ['2'], { font: "60px"});

        //switch scenes with the press of the button
        this.buttonStart = this.add.image(680, 33, 'buttonStart').setInteractive().setDepth(1);;
        this.buttonStart.on('pointerup', function (){
            console.log(character);
            if (character != "") {
                this.scene.start('Game', { character: character });
            } else {
                return;
            }
        }, this);

        //creates character sprite and establishes who is chosen
        var characterImg = this.add.sprite(400, 300, 'chars', 'charselect');
        var character = "";

        //creates squares based off of their sprite sheet
        let selection = null;

        let squareList = [];

        var square1 = this.add.sprite(490,140,"charicon","iconcomit").setScale(.17, .17).setInteractive();
        squareList.push(square1);
        var square2 = this.add.sprite(600,140,"charicon","iconsun").setScale(.17, .17).setInteractive();
        squareList.push(square2);
        var square3 = this.add.sprite(710,140,"charicon","iconnebula").setScale(.17, .17).setInteractive();
        squareList.push(square3);
        var square4 = this.add.sprite(490,260,"charicon","iconjuno").setScale(.17, .17).setInteractive();
        squareList.push(square4);
        var square5 = this.add.sprite(600,260,"charicon","iconblackhole").setScale(.17, .17).setInteractive();
        squareList.push(square5);
        var square6 = this.add.sprite(710,260,"charicon","iconneptune").setScale(.17, .17).setInteractive();
        squareList.push(square6);

        //SQUARE 1
        //1- on hovering over a square it turns red

        square1.on('pointerover', function (event) {
            if (selection != 0) {
                square1.setFrame("iconcomit2");
                console.log("over");
            }
        });
        //2- reverts the square back to normal after user is no longer hovering over it
        square1.on('pointerout', function (event) {
            if (selection != 0) {
                square1.setFrame("iconcomit");
                console.log("out");
            }
        });
        //3- when clicked the square turns red and remains red untill another square is clicked
        square1.on('pointerup', function (event) {
            selection = 0;
            console.log("0");
            square1.setFrame("iconcomit2");
            square2.setFrame("iconsun");
            square3.setFrame("iconnebula");
            square4.setFrame("iconjuno");
            square5.setFrame("iconblackhole");
            square6.setFrame("iconneptune");
            console.log("0");
            characterImg.setFrame("charcomit");
            character = "comit";
        });

        //SQUARE 2
        square2.on('pointerover', function (event) {
            if (selection != 1) {
                square2.setFrame("iconsun2");
                console.log("over");
            }
        });
        square2.on('pointerout', function (event) {
            if (selection != 1) {
                square2.setFrame("iconsun");
                console.log("out");
            }
        });
        square2.on('pointerup', function (event) {
            selection = 1;
            console.log("1");
            square1.setFrame("iconcomit");
            square2.setFrame("iconsun2");
            square3.setFrame("iconnebula");
            square4.setFrame("iconjuno");
            square5.setFrame("iconblackhole");
            square6.setFrame("iconneptune");
            console.log("1");
            characterImg.setFrame("charsun");
            character = "sun";
        });

        //SQUARE 3
        square3.on('pointerover', function (event) {
            if (selection != 2) {
                square3.setFrame("iconnebula2");
                console.log("over");
            }
        });
        square3.on('pointerout', function (event) {
            if (selection != 2) {
                square3.setFrame("iconnebula");
                console.log("out");
            }
        });
        square3.on('pointerup', function (event) {
            selection = 2;
            console.log("3");
            square1.setFrame("iconcomit");
            square2.setFrame("iconsun");
            square3.setFrame("iconnebula2");
            square4.setFrame("iconjuno");
            square5.setFrame("iconblackhole");
            square6.setFrame("iconneptune");
            console.log("3");
            characterImg.setFrame("charnebula");
            character = "nebula";
        });

        //SQUARE 4
        square4.on('pointerover', function (event) {
            if (selection != 3) {
                square4.setFrame("iconjuno2");
                console.log("over");
            }
        });
        square4.on('pointerout', function (event) {
            if (selection != 3) {
                square4.setFrame("iconjuno");
                console.log("out");
            }
        });
        square4.on('pointerup', function (event) {
            selection = 3;
            console.log("4");
            square1.setFrame("iconcomit");
            square2.setFrame("iconsun");
            square3.setFrame("iconnebula");
            square4.setFrame("iconjuno2");
            square5.setFrame("iconblackhole");
            square6.setFrame("iconneptune");
            console.log("4");
            characterImg.setFrame("charjuno");
            character = "juno";
        });

        //SQUARE 5
        square5.on('pointerover', function (event) {
            if (selection != 4) {
                square5.setFrame("iconblackhole2");
                console.log("over");
            }
        });
        square5.on('pointerout', function (event) {
            if (selection != 4) {
                square5.setFrame("iconblackhole");
                console.log("out");
            }
        });
        square5.on('pointerup', function (event) {
            selection = 4;
            console.log("5");
            square1.setFrame("iconcomit");
            square2.setFrame("iconsun");
            square3.setFrame("iconnebula");
            square4.setFrame("iconjuno");
            square5.setFrame("iconblackhole2");
            square6.setFrame("iconneptune");
            console.log("5");
            characterImg.setFrame("charblackhole");
            character = "blackhole";
        });

        //SQUARE 6
        square6.on('pointerover', function (event) {
            if (selection != 5) {
                square6.setFrame("iconneptune2");
                console.log("over");
            }
        });
        square6.on('pointerout', function (event) {
            if (selection != 5) {
                square6.setFrame("iconneptune");
                console.log("out");
            }
        });
        square6.on('pointerup', function (event) {
            selection = 5;
            console.log("6");
            square1.setFrame("iconcomit");
            square2.setFrame("iconsun");
            square3.setFrame("iconnebula");
            square4.setFrame("iconjuno");
            square5.setFrame("iconblackhole");
            square6.setFrame("iconneptune2");
            console.log("6");
            characterImg.setFrame("charneptune");
            character = "neptune";
        });
    }

    update() {

    }
}