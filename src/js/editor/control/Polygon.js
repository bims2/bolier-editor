import {Control, ControlType} from "./Control.js";
import {PointPosition} from "./PointPosition.js";

export class Polygon extends Control {
    constructor() {
        super();
        this._points = [];
    }

    get type() {
        return ControlType.POLYGON;
    }

    get points() {
        return this._points;
    }

    resize(resizeType, p) {
        this._points.forEach(p_=> {
            switch (resizeType) {
                case PointPosition.LT:
                    this.#resizeLeftTop(p, p_);
                    break;
                case PointPosition.RT:
                    this.#resizeRightTop(p, p_);
                    break;
                case PointPosition.RB:
                    this.#resizeRightBottom(p, p_);
                    break;
                case PointPosition.LB:
                    this.#resizeLeftBottom(p, p_);
                    break;
                case PointPosition.L:
                    this.#resizeLeft(p, p_);
                    break;
                case PointPosition.R:
                    this.#resizeRight(p, p_);
                    break;
                case PointPosition.T:
                    this.#resizeTop(p, p_);
                    break;
                case PointPosition.B:
                    this.#resizeBottom(p, p_);
                    break;
            }
        });
    }

    #resizeLeft(p1, p2) {
        switch (p2.position) {
            case PointPosition.T:
            case PointPosition.B:
                p2.x += p1.x * p2.xRatio;
                break;
            case PointPosition.L:
            case PointPosition.LT:
            case PointPosition.LB:
                p2.x += p1.x;
                break;
            case PointPosition.R:
            case PointPosition.RT:
            case PointPosition.RB:
                return;
            default:
                p2.x += p1.x * p2.xRatio;
                break;
        }
    }

    #resizeRight(p1, p2) {
        switch (p2.position) {
            case PointPosition.T:
            case PointPosition.B:
                p2.x += p1.x * p2.xRatio;
                break;
            case PointPosition.R:
            case PointPosition.RT:
            case PointPosition.RB:
                p2.x += p1.x;
                break;
            case PointPosition.L:
            case PointPosition.LT:
            case PointPosition.LB:
                return;
            default:
                p2.x += p1.x * p2.xRatio;
                break;
        }
    }

    #resizeTop(p1, p2) {
        switch (p2.position) {
            case PointPosition.L:
            case PointPosition.R:
                p2.y += p1.y * p2.yRatio;
                break;
            case PointPosition.T:
            case PointPosition.LT:
            case PointPosition.RT:
                p2.y += p1.y;
                break;
            case PointPosition.B:
            case PointPosition.LB:
            case PointPosition.RB:
                return;
            default:
                p2.y += p1.y * p2.yRatio;
                break;
        }
    }

    #resizeBottom(p1, p2) {
        switch (p2.position) {
            case PointPosition.L:
            case PointPosition.R:
                p2.y += p1.y * p2.yRatio;
                break;
            case PointPosition.B:
            case PointPosition.LB:
            case PointPosition.RB:
                p2.y += p1.y;
                break;
            case PointPosition.T:
            case PointPosition.LT:
            case PointPosition.RT:
                return;
            default:
                p2.y += p1.y * p2.yRatio;
                break;
        }
    }

    #resizeLeftTop(p1, p2) {
        this.#resizeLeft(p1, p2);
        this.#resizeTop(p1, p2);
    }

    #resizeRightTop(p1, p2) {
        this.#resizeRight(p1, p2);
        this.#resizeTop(p1, p2);
    }

    #resizeRightBottom(p1, p2) {
        this.#resizeRight(p1, p2);
        this.#resizeBottom(p1, p2);
    }

    #resizeLeftBottom(p1, p2) {
        this.#resizeLeft(p1, p2);
        this.#resizeBottom(p1, p2);
    }

    updateSelectPosition() {
        if (this.points.length === 0) {
            return;
        }

        this.minPoint.x = this.points[0].x;
        this.minPoint.y = this.points[0].y;
        this.maxPoint.x = this.points[0].x;
        this.maxPoint.y = this.points[0].y;
        this.points.forEach(p_=> {
            this.minPoint.x = Math.min(this.minPoint.x, p_.x);
            this.minPoint.y = Math.min(this.minPoint.y, p_.y);
            this.maxPoint.x = Math.max(this.maxPoint.x, p_.x);
            this.maxPoint.y = Math.max(this.maxPoint.y, p_.y);
        });
    }

    updatePointPosition() {
        this.points.forEach(p => {
            if (p.x === this.minPoint.x && p.y === this.minPoint.y) {
                p.position = PointPosition.LT;
            } else if (p.x === this.maxPoint.x && p.y === this.maxPoint.y) {
                p.position = PointPosition.RB;
            } else if (p.x === this.maxPoint.x && p.y === this.minPoint.y) {
                p.position = PointPosition.RT;
            } else if (p.x === this.minPoint.x && p.y === this.maxPoint.y) {
                p.position = PointPosition.LB;
            } else if (p.x === this.minPoint.x) {
                p.position = PointPosition.L;
            } else if (p.x === this.maxPoint.x) {
                p.position = PointPosition.R;
            } else if (p.y === this.minPoint.y) {
                p.position = PointPosition.T;
            } else if (p.y === this.maxPoint.y) {
                p.position = PointPosition.B;
            } else {
                p.position = PointPosition.NONE;
            }
        });
    }

    updatePointRatio() {
        this._points.forEach(p_=> {
            const curWidth = p_.x - this.minPoint.x;
            const curHeight = p_.y - this.minPoint.y;
            p_.xRatio = (curWidth / this.width);
            p_.yRatio = (curHeight / this.height);
        });
    }

    move(p) {
        this._points.forEach(p_=> {
            p_.x += p.x;
            p_.y += p.y;
        });
    }

    render(painter) {
        const points = this._points;
        const ctx = painter.ctx;

        painter.start();
        painter.lineOption(this.lineColor, this.lineWidth, 1, this.lineStyle);

        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; ++i) {
            const p = points[i];
            ctx.lineTo(p.x, p.y);
        }
        const st = points[0];
        const sd = points[1];
        ctx.lineTo(st.x, st.y);
        // ctx.lineTo(sd.x, sd.y);

        if (this.fillColor !== 'none') {
            painter.fill(this.fillColor, this.opacity);
        }

        painter.lineEnd();
        painter.end();
    }

    ptInControl(p) {
        let x = p.x, y = p.y;
        let inside = false;
        const points = this.points;
        for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
            let xi = points[i].x, yi = points[i].y;
            let xj = points[j].x, yj = points[j].y;
            let intersect = ((yi > y) !== (yj > y)) &&
                (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    }

    ptInHoverControl(p) {
        super.ptInHoverControl(p);
    }

    ptInSelectControl(p) {
        return super.ptInSelectControl(p);
    }

    clone(control) {
        super.clone(control);
    }
}