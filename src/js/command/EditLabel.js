import {Command} from "./Command.js";
import {EditLabelEventHandler} from "../event/EditLabelEventHandler.js";

export class EditLabel extends Command {
    constructor(editor) {
        super(editor);
        this.handler = new EditLabelEventHandler(editor);
    }

    active() {
        this.editor.addEventHandler(this.handler);
    }

    deActive() {
        this.editor.removeEventHandler(this.handler);
    }
}