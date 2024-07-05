import {ControlRender} from "./ControlRender.js";
import {SelectControlRender} from "./SelectControlRender.js";

export class SelectLineRender extends ControlRender {
    constructor(line) {
        super(line);
        this.selectRender = new SelectControlRender(line);
    }
    render(painter) {
        this.selectRender.render(painter);
    }
}