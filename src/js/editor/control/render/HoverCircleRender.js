import {ControlRender} from "./ControlRender.js";
import {Circle} from "../Circle.js";

export class HoverCircleRender extends ControlRender {
    constructor(circle) {
        super(circle);
        this._hoverCircle = new Circle();
        this._hoverCircle.lineColor = 'rgb(129,138,138)';
        this._hoverCircle.fillColor = 'rgb(53,155,255)';
        this._hoverCircle.opacity = 0.5;
    }
    render(painter) {
        this._hoverCircle.clonePosition(this.control);
        painter.drawCircle(this._hoverCircle);
    }
}