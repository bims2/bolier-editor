import {EventHandler} from "./EventHandler.js";
import {EventType} from "./EventType.js";
import {Action} from "../command/undo/Action.js";

export class CreateLabelEventHandler extends EventHandler {
    constructor(editor) {
        super();
        this.label = editor.page.newControl;
        this._editor = editor;
        this.textEditor = editor.textEditor
        this.textEditor.updateLabel(this.label);
        editor.enabledShortcut = false;
        this.isDown = false;

        editor.historyManager.startUndo(new Action('undo create line', ()=> {
            editor.page.removeControl(this.label);
        }));
    }

    get type() {
        return EventType.CREATE_LABEL;
    }

    onMouseDown(e) {
        if (this.isDown) {
            e.editor.clearCommand();
            if (this.textEditor.val === '') {
                this.textEditor.hide();
                return;
            }
            this.label.text = this.textEditor.val + '';

            const x = this.label.lt.x;
            const y = this.label.lt.y;
            const inputSize = this.textEditor.getSize();
            const x1 = x + inputSize.width + 5;
            const y1 = y + inputSize.height;

            this.label.rt.x = x1;
            this.label.rt.y = y;
            this.label.lb.x = x;
            this.label.lb.y = y1;
            this.label.rb.x = x1;
            this.label.rb.y = y1;

            this.label.updatePosition();
            e.editor.page.addControl(this.label);
            this.textEditor.hide();

            this._editor.historyManager.endUndo(new Action('redo create line', ()=> {
                this._editor.page.addControl(this.label);
            }));
            return;
        }
        this.isDown = true;

        this.label.lt.x = e.point.x;
        this.label.lt.y = e.point.y;
        e.originEvent.preventDefault();
        this.textEditor.show(e.clientPoint);
        this.textEditor.focus();
    }
}