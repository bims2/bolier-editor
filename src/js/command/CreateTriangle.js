import {Command} from "./Command.js";
import {CreateTriangleEventHandler} from "../event/CreateTriangleEventHandler.js";

export class CreateTriangle extends Command {
    constructor(editor) {
        super();
        this.editor = editor;
        this.handler = new CreateTriangleEventHandler(editor);
    }
    active() {
        this.editor.addEventHandler(this.handler);
    }

    deActive() {
        this.editor.removeEventHandler(this.handler);
    }
}