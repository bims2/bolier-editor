import {Command} from "./Command.js";
import {CreateRectEventHandler} from "../event/CreateRectEventHandler.js";

export class CreateRect extends Command {
    constructor(editor) {
        super();
        this.editor = editor;
        this.handler = new CreateRectEventHandler(editor);
    }

    active() {
        this.editor.addEventHandler(this.handler);
    }

    deActive() {
        this.editor.removeEventHandler(this.handler);
    }
}
