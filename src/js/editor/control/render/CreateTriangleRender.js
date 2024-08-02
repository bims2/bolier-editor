import {ControlRender} from "./ControlRender.js";

export class CreateTriangleRender extends ControlRender {
    constructor(triangle) {
        super(triangle);
    }

    render(painter) {
        painter.drawTriangle(this.control);
    }
}