import {ControlRender} from "./ControlRender.js";
import {Rect} from "../Rect.js";

export class HoverRectRender extends ControlRender {
    constructor(rect) {
        super(rect);
        this._hoverRect = new Rect();
        this._hoverRect.lineColor = 'rgb(129,138,138)';
        this._hoverRect.fillColor = 'rgb(53,155,255)';
        this._hoverRect.opacity = 0.5;
    }

    render(painter) {
        this._hoverRect.clonePosition(this.control);
        painter.drawRect(this._hoverRect);
    }
}