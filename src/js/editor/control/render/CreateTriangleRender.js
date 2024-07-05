import {ControlRender} from "./ControlRender.js";

export class CreateTriangleRender extends ControlRender {
    constructor(triangle) {
        super(triangle);
    }

    render(painter) {
        painter.start();
        painter.lineOption('grey', 1, 0.5);
        painter.drawTriangle(this.control);
        painter.fill(this.control.fillColor, 0.1);
        painter.end();
    }
}