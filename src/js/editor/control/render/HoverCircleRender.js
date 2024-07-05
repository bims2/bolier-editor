import {ControlRender} from "./ControlRender.js";

export class HoverCircleRender extends ControlRender {
    constructor(circle) {
        super(circle);
    }
    render(painter) {
        const circle = this.control;
        painter.start();
        painter.lineOption(circle.lineColor, 0, 0.5);
        painter.drawCircle(circle);
        painter.fill('rgb(53,155,255)', 0.5);
        painter.end();
    }
}