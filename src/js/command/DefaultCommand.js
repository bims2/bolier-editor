import {Command} from "./Command.js";
import {SelectEventHandler} from "../event/SelectEventHandler.js";
import {PageZoomEventHandler} from "../event/PageZoomEventHandler.js";

export class DefaultCommand extends Command {
    constructor(editor) {
        super();
        this.editor = editor;
        this.handlers = [];
        this.handlers.push(new PageZoomEventHandler());
        this.handlers.push(new SelectEventHandler());
    }

    active() {
        this.handlers.forEach(handler => {this.editor.addEventHandler(handler)})
    }

    deActive() {
        this.handlers.forEach(handler => {this.editor.removeEventHandler(handler)})
    }
}