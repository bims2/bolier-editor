import {Action} from "./Action.js";

export class LineStyleAction extends Action {
    constructor(name, control) {
        const lineStyle = control.lineStyle;
        super(name, ()=> {
            control.lineStyle = lineStyle;
        });
    }
}