import {Command} from "./Command.js";
import {CreateLineEventHandler} from "../event/CreateLineEventHandler.js";

export class CreateLine extends Command {
    constructor(editor) {
        super();
        this.editor = editor;
        this.handler = new CreateLineEventHandler(editor);
    }

    active() {
        this.editor.addEventHandler(this.handler);
    }

    deActive() {
        this.editor.removeEventHandler(this.handler);
    }
}