import {ControlType, HEIGHT, WIDTH} from "./Control.js";
import {Polygon} from "./Polygon.js";
import {HoverTriangleRender} from "./render/HoverTriangleRender.js";
import {Point} from "./Point.js";
import {PointPosition} from "./PointPosition.js";

export class Triangle extends Polygon {
    constructor() {
        super();
        this._top = new Point(PointPosition.T);
        this._left = new Point(PointPosition.LB);
        this._right = new Point(PointPosition.RB);
        this.points.push(this._top);
        this.points.push(this._left);
        this.points.push(this._right);
    }

    get type() {
        return ControlType.TRIANGLE;
    }

    get top() {
        return this._top;
    }

    get left() {
        return this._left;
    }

    get right() {
        return this._right;
    }

    updateSelectPosition() {
        super.updateSelectPosition();
    }

    updatePointPosition() {
        super.updatePointPosition();
        this.points.forEach(p => {
            switch (p.position) {
                case PointPosition.B:
                case PointPosition.T:
                    this._top = p;
                    break;
                case PointPosition.LT:
                case PointPosition.LB:
                    this._left = p;
                    break;
                case PointPosition.RT:
                case PointPosition.RB:
                    this._right = p;
                    break;
            }
        });
    }

    move(p) {
        super.move(p);
    }

    resize(resizeType, p) {
        return super.resize(resizeType, p);
    }

    setPosition(p) {
        this.top.x = p.x + WIDTH/2;
        this.top.y = p.y;
        this.left.x = p.x;
        this.left.y = p.y + HEIGHT;
        this.right.x = p.x + WIDTH;
        this.right.y = p.y + HEIGHT;
    }

    render(painter) {
        super.render(painter);
    }

    ptInControl(p) {
        return super.ptInControl(p);
    }

    ptInHoverControl(p) {
        if (this.ptInControl(p)) {
            return new HoverTriangleRender(this);
        }
        return null;
    }

    clone(control) {
        this.top.clone(control.top);
        this.left.clone(control.left);
        this.right.clone(control.right);
        super.clone(control);
    }
}