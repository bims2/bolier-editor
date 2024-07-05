import {PointPosition} from "../PointPosition.js";

export class ControlRender {
    constructor(control) {
        this._control = control;
        this._resizeType = PointPosition.NONE;
    }

    get control() {
        return this._control;
    }

    get resizeType() {
        return this._resizeType;
    }

    set resizeType(value) {
        this._resizeType = value;
    }

    render(painter) {}
}