import Card from "./card";

//Creates the cards each player has and renders them correctly on each players screens
export default class Dealer {
    constructor(scene) {
        this.dealCards = () => {
            const frames = scene.textures.get('cardsprite').getFrameNames();
            frames.pop();
            let opponentSprite = 'unocardback';

            for (let i = 0; i < 7; i++) {
                let cardID = Phaser.Math.RND.pick(frames)
                let playerCard = new Card(scene);
                scene.playerCardsSpot.push(playerCard.render(200 + (i * 75), 500, cardID));
                scene.playerCards.push(cardID);

                let opponentCard = new Card(scene);
                scene.opponentCards.push(opponentCard.render(200 + (i * 75), 100, opponentSprite).disableInteractive());
            }
            console.log(scene.playerCards);
        }
        this.drawCard = () => {
            const frames = scene.textures.get('cardsprite').getFrameNames();
            frames.pop();
            let cardID = Phaser.Math.RND.pick(frames);
            let playerCard = new Card(scene);
            scene.playerCardsSpot.push(playerCard.render(200, 500, cardID));
            scene.playerCards.push(cardID);
            let len = 525/scene.playerCards.length;

            Phaser.Actions.GridAlign(scene.playerCardsSpot, {
                width: scene.playerCards.length,
                height: 1,
                cellWidth: len,
                cellHeight: 1,
                y: 95,
                x: -50
            });
        }
    }
}