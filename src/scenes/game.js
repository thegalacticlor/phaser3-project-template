import io from 'socket.io-client';
import Zone from '../helpers/zone';
import Dealer from '../helpers/dealer';
import Card from '../helpers/card';

export default class game extends Phaser.Scene {
    constructor() {
        super({
            key: 'Game'
        })
    }

    init (data) {
        console.log('init', data);
        this.character = data.character;
    }

    //loads in assets
    preload() {
        this.load.image('drawButton', 'src/assets/drawButton.png');
        this.load.image('dealButton', 'src/assets/dealButton.png');
        this.load.image('gameBack', 'src/assets/gameBack.png');
        this.load.atlas('cardsprite',"src/assets/cards/cardsprite.png","src/assets/cards/cardsprite.json");
    }

    //creates everything on the screen
    create() {
        //SCENE MOVEMENT
        //signifies which screen the user is on and the character they are
        console.log("game");
        console.log("my character is " + this.character);
        let character2 = this.character;

        //background img
        let gameBack = this.add.image(400, 300, 'gameBack');

        //lets the player know if its their turn or not
        this.turnText = this.add.text(75, 375, ["Not your turn"]).setFontSize(18).setFontFamily('Trebuchet MS').setColor('#00ffff');

        //testing function to make sure scene is working
        hhr();

        //VARIABLES AND ASSORTED
        //Will fix eventually to be more accomadating and easier to configure- very rigid.
        //create the variables that will be used/create new assets under a name
        this.isPlayerA = false;
        var isMyTurn = false;
        let turn = 0;
        let block = 0;
        this.opponentCards = [];
        this.playerCards = [];
        this.playerCardsSpot = [];

        const frames = this.textures.get('cardsprite').getFrameNames();
        frames.pop();

        var cardInPlay;
        var cardNum;
        var cardColor;

        //create the zone to drag the cards into
        this.zone = new Zone(this);
        this.dropZone = this.zone.renderZone();
        this.outline = this.zone.renderOutline(this.dropZone);

        //create the cards for this scene
        this.dealer = new Dealer(this);

        //self helps create a distinction between players and what they see
        let self = this;

        //where the files can send their data to
        this.socket = io('http://localhost:3000');

        this.socket.on('connect', function () {
            console.log('Connected!');
        });

        //If they are the first player on scene 3, they are set as PlayerA (the host)
        this.socket.on('isPlayerA', function () {
            self.isPlayerA = true;
            console.log("I am playerA!")
        })

        //checks to make sure PlayerA is the same on both server and local,
        //create a sprite based off of the opponent card and delete one from their hand,
        //create a new card rendered in the middle to display the card just played
        this.socket.on('cardPlayed', function (gameObject, isPlayerA, cardInPlay) {
            if (isPlayerA !== self.isPlayerA) {
                let sprite = cardInPlay;
                console.log(sprite);
                self.opponentCards.shift().destroy();
                self.dropZone.data.values.cards++;
                let card = new Card(self);
                card.render((self.dropZone.x), (self.dropZone.y), sprite).disableInteractive();
            }
        })

        //gets rid of opponent card in hand
        this.socket.on('cardRid', function () {
            if (isMyTurn == false) {
                self.opponentCards.shift().destroy();
            }
        })

        //DRAW A CARD
        //adds a card to players deck on opponents side
        this.socket.on('cardGained', function () {
            console.log(isMyTurn);
            if (isMyTurn == false) {
                let opponentCard = new Card(self);
                self.opponentCards.push(opponentCard.render(200, 100, 'unocardback').disableInteractive());
                let len = 525/self.opponentCards.length;

                Phaser.Actions.GridAlign(self.opponentCards, {
                    width: self.opponentCards.length,
                    height: 1,
                    cellWidth: len,
                    cellHeight: 1,
                    y: -310,
                    x: -50
                });
            }
        })

        //DRAW A CARD FOR SUN
        //adds a card to players deck on opponents side
        this.socket.on('cardGainedSun', function (cardID) {
            console.log(isMyTurn);
            if (isMyTurn == false) {
                let playerCard = new Card(self);
                self.playerCardsSpot.push(playerCard.render(200, 500, cardID));
                self.playerCards.push(cardID);
                let len = 525/self.playerCards.length;

                Phaser.Actions.GridAlign(self.playerCardsSpot, {
                    width: self.playerCards.length,
                    height: 1,
                    cellWidth: len,
                    cellHeight: 1,
                    y: 95,
                    x: -50
                });
            }
        })

        //create the text button
        this.drawButton = this.add.image(120, 300, 'drawButton').setVisible(false);

        //when the deal text is pressed it deals the player cards
        this.drawButton.on('pointerdown', function () {
            if (isMyTurn) {
                self.dealer.drawCard();
                self.socket.emit("cardGained");
                console.log(self.playerCards);
                console.log(self.playerCardsSpot);
            }
        })

        //DEAL CARDS
        //create the text button
        this.dealButton = this.add.image(120, 300, 'dealButton').setInteractive();

        //when the deal text is pressed it deals the player cards
        this.dealButton.on('pointerdown', function () {
            cardInPlay = Phaser.Math.RND.pick(frames);
            cardNum = cardInPlay.replace(/[^0-9]/g, '');
            cardColor = cardInPlay.slice(0, -1);
            console.log(cardNum + " SDFGHJKLKJHGFDFGHJKLKJHG " + cardColor);
            self.socket.emit('updateCard', cardInPlay);
            self.socket.emit("firstCard", cardInPlay, cardNum, cardColor);
            self.socket.emit("dealCards", cardInPlay, cardNum, cardColor);
        })

        //deals cards to all players
        this.socket.on('dealCards', function () {
            self.dealer.dealCards();
            self.dealButton.disableInteractive().setVisible(false);
            self.drawButton.setInteractive().setVisible(true);
        })

        //creates a first card
        this.socket.on('firstCard', function (cardInPlay, cardNum, cardColor) {
            let sprite = cardInPlay;
            cardNum = sprite.replace(/[^0-9]/g, '');
            cardColor = sprite.slice(0, -1);
            console.log(cardNum + " SDFGHJKLKJHGFDFGHJKLKJHG " + cardColor);
            let startCard = new Card(self);
            startCard.render(400, 300, sprite).disableInteractive();
            console.log(sprite);
        })

        //CARDS MOVEMENT
        //creates cards being able to be dragged where the mouse is
        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        })

        //brings card to the front when being dragged
        this.input.on('dragstart', function (pointer, gameObject) {
            gameObject.setTint(0xff69b4);
            self.children.bringToTop(gameObject);
        })

        //if card is dragged and does not land on the zone it is sent back to its original place
        this.input.on('dragend', function (pointer, gameObject, dropped) {
            gameObject.setTint();
            if (!dropped) {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        })

        //when the card is dropped into the drop zone, it is rendered into the middle and is unable to leave
        this.input.on('drop', function (pointer, gameObject, dropZone) {
            if (isMyTurn) {
                let tempNum = gameObject.frame.name.replace(/[^0-9]/g, '');
                let tempColor = gameObject.frame.name.slice(0, -1);
                if ((tempColor === "charcar")) {
                    if (block != 0) {
                        self.socket.emit("updateBlockSub");
                        console.log(block);
                    } else if (self.character === "comit") {
                        turn = 2;
                        console.log(turn);

                    } else if (self.character === "sun") {
                        for (var i = 0; i < 6; i++) {
                            let opponentCard = new Card(self);
                            self.opponentCards.push(opponentCard.render(200, 100, 'unocardback').disableInteractive());
                            let len = 525/self.opponentCards.length;
        
                            Phaser.Actions.GridAlign(self.opponentCards, {
                                width: self.opponentCards.length,
                                height: 1,
                                cellWidth: len,
                                cellHeight: 1,
                                y: -310,
                                x: -50
                            });
                            let cardID = Phaser.Math.RND.pick(frames);
                            self.socket.emit("cardGainedSun", cardID);
                        }
                    } else if (self.character === "nebula") {
                        for (var i = 0; i<2; i++) {
                            self.playerCardsSpot[0].disableInteractive().setVisible(false);
                            self.playerCards.splice(0, 1);
                            self.playerCardsSpot.splice(0, 1);

                            self.socket.emit("cardRid");
                        }
                        console.log(self.playerCardsSpot);
                        console.log(self.playerCards);
                    } else if (self.character === "juno") {
                        self.socket.emit("updateBlockAdd");
                        console.log(block);

                    } else if (self.character === "blackhole") {
                        console.log(turn);
                        let opponentCard = new Card(self);
                        self.opponentCards.push(opponentCard.render(200, 100, 'unocardback').disableInteractive());
                        let len = 525/self.opponentCards.length;
    
                        Phaser.Actions.GridAlign(self.opponentCards, {
                            width: self.opponentCards.length,
                            height: 1,
                            cellWidth: len,
                            cellHeight: 1,
                            y: -310,
                            x: -50
                        });
                        let cardID = cardInPlay;
                        self.socket.emit("cardGainedSun", cardID);

                    } else if (self.character === "neptune") {
                        let opponentCard = new Card(self);
                        self.opponentCards.push(opponentCard.render(200, 100, 'unocardback').disableInteractive());
                        let len = 525/self.opponentCards.length;
    
                        Phaser.Actions.GridAlign(self.opponentCards, {
                            width: self.opponentCards.length,
                            height: 1,
                            cellWidth: len,
                            cellHeight: 1,
                            y: -310,
                            x: -50
                        });
                        let cardID = Phaser.Math.RND.pick(frames);
                        self.socket.emit("cardGainedSun", cardID);

                        let randIn = Phaser.Math.Between(0, self.playerCards.length - 1);
                        self.playerCards.splice(randIn, 1);   
                        self.playerCardsSpot[randIn].destroy();
                        self.socket.emit("cardRid");
                        for (var i = self.playerCards.length; i>0; i--) {
                            self.children.bringToTop(self.playerCardsSpot[i - 1]);
                        }
                    }
                    cardInPlay = gameObject.frame.name;
                    cardNum = 0;
                    console.log(cardInPlay);
                    dropZone.data.values.cards++;
                    gameObject.x = dropZone.x;
                    gameObject.y = dropZone.y;
                    gameObject.disableInteractive();
                    let cardIndex = self.playerCards.indexOf(cardInPlay);
                    self.playerCards.splice(cardIndex, 1);   
                    self.playerCardsSpot.splice(cardIndex, 1);
                    console.log(self.playerCards);
                    self.socket.emit('cardPlayed', gameObject, self.isPlayerA, cardInPlay, cardNum, cardColor);
                } else if ((cardNum == tempNum) || (cardColor == tempColor) || (cardNum == 0)) {
                    cardInPlay = gameObject.frame.name;
                    console.log(cardInPlay);
                    console.log(cardNum + " " + cardColor);
                    dropZone.data.values.cards++;
                    gameObject.x = dropZone.x;
                    gameObject.y = dropZone.y;
                    gameObject.disableInteractive();
                    let cardIndex = self.playerCards.indexOf(cardInPlay);
                    self.playerCards.splice(cardIndex, 1);
                    self.playerCardsSpot.splice(cardIndex, 1); 
                    console.log(self.playerCards);
                    self.socket.emit('cardPlayed', gameObject, self.isPlayerA, cardInPlay, cardNum, cardColor);
                } else {
                    console.log("nope");
                    console.log(cardNum + " " + cardColor);
                    console.log(tempNum + " " + tempColor)
                    gameObject.x = gameObject.input.dragStartX;
                    gameObject.y = gameObject.input.dragStartY; 
                }
            } else {
                console.log(isMyTurn);
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        })

        //TURN IMPLEMENTATION
        //server function that updates who's turn it is supposed to be
        this.socket.on('switchTurn', function () {
            console.log(turn);
            if (turn == 0) {
                isMyTurn = !isMyTurn;
                console.log("isMyTurn: " + isMyTurn);
                for (var i = self.playerCards.length; i>0; i--) {
                    self.children.bringToTop(self.playerCardsSpot[i - 1]);
                }
            } else {
                turn--;
            }
            if (isMyTurn) {
                self.turnText.setText("Your turn");
            } else if (isMyTurn == false) {
                self.turnText.setText("Not your turn");
            }
        })

        //UPDATE ACTIVE CARD
        //makes sure both players have correct card data
        this.socket.on("updateCard", function (cardInPlay) {
            cardNum = cardInPlay.replace(/[^0-9]/g, '');
            cardColor = cardInPlay.slice(0, -1);
            console.log("OOGA BOOGA TESTTTTTTTTTTTTTTTTTTT");
            console.log("cardNum " + cardNum);
        })

        //UPDATE BLOCK
        //makes sure both players have correct block number
        this.socket.on("updateBlockAdd", function () {
            block++;
            console.log(block + " count");
        })
        this.socket.on("updateBlockSub", function () {
            block--;
            console.log(block + " count");
        })

        //WIN CHECK
        //makes sure no one has won yet
        this.socket.on('winCheck', function() {
            if (self.playerCards.length == 0) {
                console.log("win");
                self.scene.start('Win', { didWin: true, character: character2});
                self.socket.emit('winCheck');
            } else if (self.opponentCards.length == 0) {
                console.log("lost");
                self.scene.start('Win', { didWin: false, character: character2});
            }
        })
    }

    update() {

    }
}

//testing function- if this does not play there is something wrong
function hhr() {
    console.log("it work yay");
}