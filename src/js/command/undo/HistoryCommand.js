import {Command} from "../Command.js";

export class HistoryCommand extends Command{
    constructor(undo, redo) {
        super();
        this.undo = undo;
        this.redo = redo;
    }

    active() {
        this.undo();
    }

    deActive() {
        this.redo();
    }
}