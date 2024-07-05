import {EventHandler} from "./EventHandler.js";

export class EditLabelEventHandler extends EventHandler {
    constructor(editor) {
        super();
        this._label = editor.page.selectControl.control;
        this._label.text = '';
    }

    onMouseDown(e) {
        const textEditor = e.editor.textEditor;
        e.editor.clearCommand();
        textEditor.hide();

        if (textEditor.val === '') {
            e.editor.page.removeControl()
            return;
        }

        const x = this._label.lt.x;
        const y = this._label.lt.y;
        const inputSize = textEditor.getInputSize();
        const x1 = x + inputSize.width + 5;
        const y1 = y + inputSize.height;

        this._label.rt.x = x1;
        this._label.rt.y = y;
        this._label.lb.x = x;
        this._label.lb.y = y1;
        this._label.rb.x = x1;
        this._label.rb.y = y1;
        this._label.text = textEditor.val + '';
    }

    onKeyDown(e) {
        e.editor.textEditor.update();
    }
}