export class SelectionRect {
    constructor() {
        this._lt = { x:0, y:0 };
        this._rt = { x:0, y:0 };
        this._rb = { x:0, y:0 };
        this._lb = { x:0, y:0 };
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