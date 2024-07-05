import {ControlRender} from "./ControlRender.js";

export class CreateCircleRender extends ControlRender {
    constructor(circle) {
        super(circle);
    }

    render(painter) {
        const circle = this.control;
        painter.start();
        painter.lineOption(circle.lineColor, circle.lineWidth, 0.5);
        painter.drawCircle(circle);
        painter.fill(circle.fillColor, 0.1);
        painter.end();
    }
}