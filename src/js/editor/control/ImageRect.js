import {Rect} from "./Rect.js";
import {ControlType} from "./Control.js";

export class ImageRect extends Rect {
    constructor(image) {
        super();
        this._image = image;
        this.fillColor = 'none';
    }

    get type() {
        return ControlType.IMAGE;
    }

    get image() {
        return this._image;
    }

    set image(value) {
        this._image = value;
    }

    setPosition(p) {
        super.setPosition(p);
    }

    render(painter) {
        const width = this.rb.x - this.lt.x;
        const height = this.rb.y - this.lt.y;
        painter.drawImage(this._image, this.lt.x, this.lt.y, width, height);
        super.render(painter);
    }

    clone(control) {
        super.clone(control);
        this._image = control.image;
    }
}