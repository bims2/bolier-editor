import {Action} from "./Action.js";

export class LineWidthAction extends Action {
    constructor(name, control) {
        const lineWidth = control.lineWidth;
        super(name, ()=> {
            control.lineWidth = lineWidth;
        });
    }
}