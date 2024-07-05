import {Action} from "./Action.js";

export class LineColorAction extends Action {
    constructor(name, control) {
        const lineColor = control.lineColor;
        super(name, ()=> {
            control.lineColor = lineColor;
        });
    }
}