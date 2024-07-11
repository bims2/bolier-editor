import {Command} from "./Command.js";
import {CreateLabelEventHandler} from "../event/CreateLabelEventHandler.js";

export class CreateLabel extends Command {
    constructor(editor) {
        super(editor);
        this.handler = new CreateLabelEventHandler(editor);
    }


    active() {
        this.editor.addEventHandler(this.handler);
    }

    deActive() {
        this.editor.removeEventHandler(this.handler);
    }
}