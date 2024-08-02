import {ControlRender} from "./ControlRender.js";

export class CreateRectRender extends ControlRender {
    constructor(rect) {
        super(rect);
    }

    render(painter) {
        painter.drawRect(this.control);
    }
}