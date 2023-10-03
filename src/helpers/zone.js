//class to create the drop zone and visuals for said zone
export default class Zone {
    constructor(scene) {
        //creates the zone of which cards can be dropped
        this.renderZone = () => {
            let dropZone = scene.add.zone(400, 300, 200, 200).setRectangleDropZone(200, 200);
            dropZone.setData({ cards: 0 });
            return dropZone;
        };
        //creates a visual of the zone
        this.renderOutline = (dropZone) => {
            let dropZoneOutline = scene.add.graphics();
            dropZoneOutline.lineStyle(4, 0xff69b4);
            dropZoneOutline.strokeRect(dropZone.x - dropZone.input.hitArea.width / 2, dropZone.y - dropZone.input.hitArea.height / 2, dropZone.input.hitArea.width, dropZone.input.hitArea.height)
        }
    }
}