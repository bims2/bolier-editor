import {ControlRender} from "./ControlRender.js";
import {Triangle} from "../Triangle.js";

export class HoverTriangleRender extends ControlRender {
    constructor(triangle) {
        super(triangle);
        this._hoverTriangle = new Triangle();
        this._hoverTriangle.lineColor = 'rgb(129,138,138)';
        this._hoverTriangle.fillColor = 'rgb(53,155,255)';
        this._hoverTriangle.opacity = 0.5;
    }

    render(painter) {
        this._hoverTriangle.clonePosition(this.control);
        painter.drawTriangle(this._hoverTriangle);
    }
}