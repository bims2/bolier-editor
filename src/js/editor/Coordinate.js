export class Coordinate {
    constructor() {
        this._curPoint = {x: 0, y: 0};
        this._orgPoint = {x: 0, y: 0};
        this._wayPoint = {x: 0, y: 0};
        this._dpr = window.devicePixelRatio;
    }

    get curPoint() {
        return this._curPoint;
    }

    set curPoint(value) {
        this._curPoint = value;
    }

    get orgPoint() {
        return this._orgPoint;
    }

    set orgPoint(value) {
        this._orgPoint = value;
    }

    get wayPoint() {
        return this._wayPoint;
    }

    set wayPoint(p) {
        this._wayPoint.x = p.x;
        this._wayPoint.y = p.y;
    }

    get dpr() {
        return this._dpr;
    }

    set dpr(dpr) {
        this._dpr = dpr;
    }
}