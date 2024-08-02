import {Polygon} from "./Polygon.js";
import {ControlType, HEIGHT, WIDTH} from "./Control.js";
import {HoverRectRender} from "./render/HoverRectRender.js";
import {PointPosition} from "./PointPosition.js";
import {Point} from "./Point.js";

export class Rect extends Polygon {
    constructor() {
        super();
        this._lt = new Point(PointPosition.LT);
        this._rt = new Point(PointPosition.RT);
        this._rb = new Point(PointPosition.RB);
        this._lb = new Point(PointPosition.LB);
        this.points.push(this._lt);
        this.points.push(this._rt);
        this.points.push(this._rb);
        this.points.push(this._lb);
    }

    get type() {
        return ControlType.RECT;
    }

    get lt() {
        return this._lt;
    }

    get rt() {
        return this._rt;
    }

    get rb() {
        return this._rb;
    }

    get lb() {
        return this._lb;
    }

    updateSelectPosition() {
        super.updateSelectPosition();
    }

    updatePointPosition() {
        super.updatePointPosition();
        this.points.forEach(p => {
            switch (p.position) {
                case PointPosition.LT:
                    this._lt = p;
                    break;
                case PointPosition.RT:
                    this._rt = p;
                    break;
                case PointPosition.RB:
                    this._rb = p;
                    break;
                case PointPosition.LB:
                    this._lb = p;
                    break;
            }
        });
    }

    move(p) {
        super.move(p);
    }

    resize(resizeType, p) {
        super.resize(resizeType, p);
    }

    setPosition(p) {
        this._lt.x = p.x;
        this._lt.y = p.y;

        this._rt.x = p.x + WIDTH;
        this._rt.y = p.y;

        this._rb.x = p.x + WIDTH;
        this._rb.y = p.y + HEIGHT;

        this._lb.x = p.x;
        this._lb.y = p.y + HEIGHT;
    }

    render(painter) {
        super.render(painter);
    }

    ptInControl(p) {
        return super.ptInControl(p);
    }

    ptInHoverControl(p) {
        if (this.ptInControl(p)) {
            return new HoverRectRender(this);
        }
        return null;
    }

    clone(control) {
        this.clonePosition(control);
        super.clone(control);
    }

    clonePosition(control) {
        this.lt.clone(control.lt);
        this.rt.clone(control.rt);
        this.rb.clone(control.rb);
        this.lb.clone(control.lb);
    }
}