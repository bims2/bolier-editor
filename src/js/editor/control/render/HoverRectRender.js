import {ControlRender} from "./ControlRender.js";

export class HoverRectRender extends ControlRender {
    constructor(rect) {
        super(rect);
    }
    render(painter) {
        painter.start();
        painter.lineOption('grey', 0);
        painter.drawRect(this.control);
        painter.fill('rgb(53,155,255)', 0.5);
        painter.end();
    }
}