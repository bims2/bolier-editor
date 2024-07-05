import {HistoryCommand} from "../command/undo/HistoryCommand.js";

export class HistoryManager {
    constructor(editor) {
        this.editor = editor;
        this.undoQue = [];
        this.redoQue = [];
        this.undoAction = null;
    }

    undo() {
        if (this.undoQue.length === 0) {
            return;
        }
        const item = this.undoQue.pop();
        // console.log('undoQue len', this.undoQue.length);
        item.active();
        this.editor.render();
        this.redoQue.push(item);
    }

    redo() {
        if (this.redoQue.length === 0) {
            return;
        }
        const item = this.redoQue.pop();
        // console.log('redoQue len', this.redoQue.length);
        item.deActive();
        this.editor.render();
        this.undoQue.push(item);
    }

    startUndo(undoAction) {
        this.undoAction = undoAction;
    }

    endUndo(redoAction) {
        const undoAction = this.undoAction;
        const item = new HistoryCommand(()=> undoAction.run(), ()=> redoAction.run());
        this.undoQue.push(item);
        this.redoQue = [];
        this.undoAction = null;
    }
}