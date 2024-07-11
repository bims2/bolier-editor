import {Command} from "./Command.js";
import {CreateCircleEventHandler} from "../event/CreateCircleEventHandler.js";

export class CreateCircle extends Command {
    constructor(editor) {
        super(editor);
        this.handler = new CreateCircleEventHandler(editor);
    }

    active() {
        this.editor.addEventHandler(this.handler);
    }

    deActive() {
        this.editor.removeEventHandler(this.handler);
    }
}