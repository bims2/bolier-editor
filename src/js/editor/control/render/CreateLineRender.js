import {ControlRender} from "./ControlRender.js";

export class CreateLineRender extends ControlRender {
    constructor(line) {
        super(line);
    }

    render(painter) {
        const line = this.control;
        painter.drawLine(line.p1, line.p2, 'grey', 1, 0.5);
    }
}