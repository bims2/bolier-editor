import {ControlRender} from "./ControlRender.js";

export class CreateCircleRender extends ControlRender {
    constructor(circle) {
        super(circle);
    }

    render(painter) {
        const circle = this.control;
        painter.drawCircle(circle);
    }
}