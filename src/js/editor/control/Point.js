import {PointPosition} from "./PointPosition.js";

export class Point {
    constructor(position) {
        this._x = 0;
        this._y = 0;
        this._xRatio = 0;
        this._yRatio = 0;
        this._position = position ?? PointPosition.NONE;
        return this;
    }

    get x() {
        return this._x;
    }

    set x(value) {
        this._x = value;
    }

    get xRatio() {
        return this._xRatio;
    }

    set xRatio(value) {
        this._xRatio = value;
    }

    get yRatio() {
        return this._yRatio;
    }

    set yRatio(value) {
        this._yRatio = value;
    }

    get y() {
        return this._y;
    }

    set y(value) {
        this._y = value;
    }

    get position() {
        return this._position;
    }

    set position(value) {
        this._position = value;
    }

    copy() {
        const p = new Point(this.position);
        p.x = this.x;
        p.y = this.y;
        p.xRatio = this.xRatio;
        p.yRatio = this.yRatio;
        return p;
    }
}