import {ControlRender} from "./ControlRender.js";

export class CreateRectRender extends ControlRender {
    constructor(rect) {
        super(rect);
    }

    render(painter) {
        painter.start();
        painter.lineOption('grey', 1, 0.5);
        painter.drawRect(this.control);
        painter.fill(this.control.fillColor, 0.1);
        painter.end();
    }
}