import {Rect} from "./Rect.js";
import {ControlType} from "./Control.js";
import {PointPosition} from "./PointPosition.js";
import {TextUtil} from "../text/TextUtil.js";

export class Label extends Rect {
    constructor() {
        super();
        this._text = '';
        this._fontSize = 20;
        this._fontColor = 'rgb(0, 0, 0)';
    }

    get type() {
        return ControlType.LABEL;
    }

    get text() {
        return this._text;
    }

    set text(value) {
        this._text = value;
    }

    get fontSize() {
        return this._fontSize;
    }

    set fontSize(value) {
        this._fontSize = value;
    }

    get fontColor() {
        return this._fontColor;
    }

    set fontColor(value) {
        this._fontColor = value;
    }

    resize(resizeType, p) {
        super.resize(resizeType, p);

        let width = Math.abs(this.rt.x - this.lt.x) ?? 0.1;
        this.fontSize = TextUtil.calculatorFontSize(this.text, width, this.fontSize);
        let height = TextUtil.calculatorFontWidthHeight(this.text, this.fontSize).height;
        let y = 0;

        switch (resizeType) {
            case PointPosition.LT:
            case PointPosition.RT:
                y = this.rb.y - height;
                this.lt.y = y;
                this.rt.y = y;
                break;
            case PointPosition.RB:
            case PointPosition.LB:
                y = this.rt.y + height;
                this.lb.y = y;
                this.rb.y = y;
                break;
        }

        this.updateSelectPosition();
    }

    render(painter) {
        // super.render(painter);
        painter.drawLabel(this);
    }
}