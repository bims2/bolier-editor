import {Action} from "./Action.js";

export class FillColorAction extends Action {
    constructor(name, control) {
        const fillColor = control.fillColor;
        super(name, ()=> {
            control.fillColor = fillColor;
        });
    }
}