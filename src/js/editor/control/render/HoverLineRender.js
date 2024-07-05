import {ControlRender} from "./ControlRender.js";

export class HoverLineRender extends ControlRender {
    constructor(line) {
        super(line);
    }

    render(painter) {
        const line = this.control;
        painter.drawLine(line.p1, line.p2, 'rgb(53,155,255)', 3, 0.5);
    }
}