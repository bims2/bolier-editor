import {Action} from "./Action.js";

export class FontColorAction extends Action {
    constructor(name, control) {
        const fontColor = control.fontColor;
        super(name, ()=> {
            control.fontColor = fontColor;
        });
    }
}