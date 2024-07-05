import {ControlRender} from "./ControlRender.js";

export class CreateImageRender extends ControlRender {
    constructor(imageRect) {
        super();
        this.imageRect = imageRect;
    }

    render(painter) {
        const imageRect = this.imageRect;
        const width = imageRect.rb.x - imageRect.lt.x;
        const height = imageRect.rb.y - imageRect.lt.y;
        painter.drawImage(this.imageRect.image, imageRect.lt.x, imageRect.lt.y, width, height);
    }
}