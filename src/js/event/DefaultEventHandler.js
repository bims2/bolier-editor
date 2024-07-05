import {EventHandler} from "./EventHandler.js";
import {MouseSnapEventHandler} from "./MouseSnapEventHandler.js";
import {ShortCutKeyEventHandler} from "./ShortCutKeyEventHandler.js";

export class DefaultEventHandler extends EventHandler {
    constructor() {
        super();
        this.handlers = [];
        this.handlers.push(new MouseSnapEventHandler());
        this.handlers.push(new ShortCutKeyEventHandler());
    }

    onMouseDown(e) {
        this.handlers.forEach(h => {
            h.onMouseDown(e);
        });
    }

    onMouseMove(e) {
        this.handlers.forEach(h => {
            h.onMouseMove(e);
        });
    }

    onMouseUp(e) {
        this.handlers.forEach(h => {
            h.onMouseUp(e);
        });
    }

    onMouseWheel(e) {
        this.handlers.forEach(h => {
            h.onMouseWheel(e);
        });
    }

    onKeyDown(e) {
        this.handlers.forEach(h => {
            h.onKeyDown(e);
        });
    }

    onKeyUp(e) {
        this.handlers.forEach(h => {
            h.onKeyUp(e);
        });
    }
}