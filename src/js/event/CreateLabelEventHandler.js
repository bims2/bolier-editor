import {EventHandler} from "./EventHandler.js";
import {EventType} from "./EventType.js";
import {Action} from "../command/undo/Action.js";
import {CursorType} from "../editor/CursorType.js";

export class CreateLabelEventHandler extends EventHandler {
    constructor(editor) {
        super();
        this._label = editor.page.newControl;
        this.textEditor = editor.textEditor
        this.textEditor.updateLabel(this._label);
        editor.enabledShortcut = false;
        this.isDown = false;

        editor.page.setCursor(CursorType.TEXT);
        editor.historyManager.startUndo(new Action('undo create label', ()=> {
            editor.page.removeControl(this._label);
        }));
    }

    get type() {
        return EventType.CREATE_LABEL;
    }

    onMouseDown(e) {
        if (this.isDown) {
            e.editor.clearCommand();
            this._label.isEdit = false;
            if (this.textEditor.val === '') {
                this.textEditor.hide();
                return;
            }
            this._label.text = this.textEditor.val + '';

            const x = this._label.lt.x;
            const y = this._label.lt.y;
            const inputSize = this.textEditor.getSize();
            const x1 = x + inputSize.width + 5;
            const y1 = y + inputSize.height;

            this._label.rt.x = x1;
            this._label.rt.y = y;
            this._label.lb.x = x;
            this._label.lb.y = y1;
            this._label.rb.x = x1;
            this._label.rb.y = y1;

            this._label.updatePosition();
            e.editor.page.addControl(this._label);
            this.textEditor.hide();

            e.editor.historyManager.endUndo(new Action('redo create label', ()=> {
                e.editor.page.addControl(this._label);
            }));
            return;
        }
        this.isDown = true;

        this._label.lt.x = e.point.x;
        this._label.lt.y = e.point.y;
        e.originEvent.preventDefault();
        this.textEditor.show(e.clientPoint);
        this.textEditor.focus();
    }

    onMouseMove(e) {
        super.onMouseMove(e);
    }

    onMouseUp(e) {
        super.onMouseUp(e);
    }

    onMouseWheel(e) {
        super.onMouseWheel(e);
    }

    onKeyDown(e) {
        if (!this.isDown && e.originEvent.key === 'Escape') {
            e.editor.enabledShortcut = true;
            e.editor.page.setCursor(CursorType.DEFAULT);
            e.editor.tools.clear();
        }
    }
}