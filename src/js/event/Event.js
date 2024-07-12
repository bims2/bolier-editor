export class Event {
    constructor(editor) {
        this._editor = editor;
        this._down = false;
        this._dragPoint = {x: 0, y: 0};
        this._downPoint = {x: 0, y: 0};
        this._point = {x: 0, y: 0};
        this._originPoint = {x: 0, y: 0};
        this._curPoint = {x: 0, y: 0};
        this._originEvent = null;

        this._clientPoint = {x: 0, y: 0};

        this._keyPressed = {};
    }

    get keyPressed() {
        return this._keyPressed;
    }

    get editor() {
        return this._editor;
    }

    get down() {
        return this._down;
    }

    set down(b) {
        this._down = b;
    }

    get dragPoint() {
        return this._dragPoint;
    }

    set dragPoint(value) {
        this._dragPoint = value;
    }

    get downPoint() {
        return this._downPoint;
    }

    set downPoint(p) {
        this._downPoint.x = p.x;
        this._downPoint.y = p.y;
    }

    get point() {
        return this._point;
    }

    set point(p) {
        this._point = p.x;
        this._point = p.y;
    }

    get originPoint() {
        return this._originPoint;
    }

    set originPoint(value) {
        this._originPoint = value;
    }

    get curPoint() {
        return this._curPoint;
    }

    set curPoint(value) {
        this._curPoint = value;
    }

    get originEvent() {
        return this._originEvent;
    }

    set originEvent(e) {
        return this._originEvent = e;
    }

    get clientPoint() {
        return this._clientPoint;
    }
}