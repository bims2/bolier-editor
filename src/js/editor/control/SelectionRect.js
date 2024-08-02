export class SelectionRect {
    constructor() {
        this._lt = { x:0, y:0 };
        this._rt = { x:0, y:0 };
        this._rb = { x:0, y:0 };
        this._lb = { x:0, y:0 };
        this._fillColor = '';
        this._lineColor = 'rgb(53,155,255)';
        this._lineWidth = 1;
        this._opacity = 1;
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

    get fillColor() {
        return this._fillColor;
    }

    set fillColor(value) {
        this._fillColor = value;
    }

    get lineColor() {
        return this._lineColor;
    }

    set lineColor(value) {
        this._lineColor = value;
    }

    get lineWidth() {
        return this._lineWidth;
    }

    get opacity() {
        return this._opacity;
    }

    updatePosition(p1, p2) {
        this.lt.x = p1.x;
        this.lt.y = p1.y;
        this.rb.x = p2.x;
        this.rb.y = p2.y;
        this.rt.x = p2.x;
        this.rt.y = p1.y;
        this.lb.x = p1.x;
        this.lb.y = p2.y;
    }
}