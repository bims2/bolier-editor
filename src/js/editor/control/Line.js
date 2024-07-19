import {HoverLineRender} from "./render/HoverLineRender.js";
import {PointPosition} from "./PointPosition.js";
import {Polygon} from "./Polygon.js";
import {Point} from "./Point.js";
import {ControlType} from "./Control.js";
import {ControlUtil} from "./ControlUtil.js";

export class Line extends Polygon {
    constructor() {
        super();
        this._p1 = new Point(PointPosition.LT);
        this._p2 = new Point(PointPosition.RB);
        this.points.push(this.p1);
        this.points.push(this.p2);
    }

    get type() {
        return ControlType.LINE;
    }

    get p1() {
        return this._p1;
    }

    get p2() {
        return this._p2;
    }

    setPosition(p) {
        this.p1.x = p.x;
        this.p1.y = p.y;
        this.p2.x = p.x + 50;
        this.p2.y = p.y + 50;
    }

    updateSelectPosition() {
        super.updateSelectPosition();
    }

    move(p) {
        super.move(p);
    }

    resize(resizeType, p) {
        super.resize(resizeType, p);
    }

    render(painter) {
        painter.drawLine(this.p1, this.p2, this.lineColor, this.lineWidth, 1, this.lineStyle);
    }

    ptInControl(p) {
        return ControlUtil.ptInLine(p, this);
    }

    ptInHoverControl(p) {
        if (this.ptInControl(p)) {
            return new HoverLineRender(this);
        }
        return null;
    }

    ptInSelectControl(p) {
        return super.ptInSelectControl(p);
    }

    clone(control) {
        this.p1.x = control.p1.x;
        this.p1.y = control.p1.y;
        this.p2.x = control.p2.x;
        this.p2.y = control.p2.y;
        super.clone(control);
    }
}