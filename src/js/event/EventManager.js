import {Event} from './Event.js'
import {DefaultEventHandler} from "./DefaultEventHandler.js";

export class EventManager {
    constructor(editor) {
        this.event = new Event(editor);
        this.handler = new DefaultEventHandler();
        this.handlers = new Map();
        this.dragHandler = null;
    }

    addHandler(handler) {
        this.handlers.set(handler.type, handler);
    }

    removeHandler(handler) {
        this.handlers.delete(handler.type);
    }

    startDragHandler(handler) {
        this.dragHandler = handler;
    }

    finishDragHandler() {
        this.dragHandler = null;
    }

    onMouseDown(e) {
        this.#setEvent(e);
        this.handler.onMouseDown(this.event);
        if (this.dragHandler !== null) {
            this.dragHandler.onMouseDown(this.event);
            return;
        }

        this.handlers.forEach(h => {
            h.onMouseDown(this.event);
        });
    }

    onMouseMove(e) {
        this.#setEvent(e);
        this.handler.onMouseMove(this.event);
        if (this.dragHandler !== null) {
            this.dragHandler.onMouseMove(this.event);
            return;
        }

        this.handlers.forEach(h => {
            h.onMouseMove(this.event);
        });
    }

    onMouseUp(e) {
        this.#setEvent(e);
        this.handler.onMouseUp(this.event);
        if (this.dragHandler !== null) {
            this.dragHandler.onMouseUp(this.event);
            return;
        }

        this.handlers.forEach(h => {
            h.onMouseUp(this.event);
        });
    }

    onKeyDown(e) {
        this.#setEvent(e);
        this.handler.onKeyDown(this.event);
        if (this.dragHandler !== null) {
            this.dragHandler.onKeyDown(this.event);
            return;
        }

        this.handlers.forEach(h => {
            h.onKeyDown(this.event);
        });
    }

    onMouseWheel(e) {
        this.#setEvent(e);
        this.handler.onMouseWheel(this.event);
        if (this.dragHandler !== null) {
            this.dragHandler.onMouseWheel(this.event);
            return;
        }

        this.handlers.forEach(h => {
            h.onMouseWheel(this.event);
        });
    }

    onKeyUp(e) {
        this.#setEvent(e);
        this.handler.onKeyUp(this.event);
        if (this.dragHandler !== null) {
            this.dragHandler.onKeyUp(this.event);
            return;
        }

        this.handlers.forEach(h => {
            h.onKeyUp(this.event);
        });
    }

    #setEvent(e) {
        this.event.originEvent = e;
    }
}