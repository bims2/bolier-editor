import {Command} from "./Command.js";
import {CreateImageEventHandler} from "../event/CreateImageEventHandler.js";

export class CreateImage extends Command {
    constructor(editor, image) {
        super();
        this.editor = editor;
        this.handler = new CreateImageEventHandler(editor, image);
    }

    active() {
        this.editor.addEventHandler(this.handler);
    }

    deActive() {
        this.editor.removeEventHandler(this.handler);
    }
}