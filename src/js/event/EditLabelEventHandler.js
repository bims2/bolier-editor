import {EventHandler} from "./EventHandler.js";
import {TextUtil} from "../editor/text/TextUtil.js";

export class EditLabelEventHandler extends EventHandler {
    constructor(editor) {
        super();
        this._editor = editor;
        this._label = editor.page.selectRender.control;
        this._label.text = '';
    }

    onMouseDown(e) {
        const textEditor = e.editor.textEditor;
        e.editor.clearCommand();
        textEditor.hide();
        this._label.isEdit = false;

        if (textEditor.val === '') {
            e.editor.page.removeControl(this._label);
            return;
        }

        const text = textEditor.val + '';

        const x = this._label.lt.x;
        const y = this._label.lt.y;
        let size =
            TextUtil.calculatorFontWidthHeight(text, this._label.fontSize);

        const x1 = x + size.width + this.#getWhiteSpace(this._label.fontSize);
        const y1 = y + size.height;

        this._label.rt.x = x1;
        this._label.rt.y = y;
        this._label.lb.x = x;
        this._label.lb.y = y1;
        this._label.rb.x = x1;
        this._label.rb.y = y1;
        this._label.text = text;
    }

    #getWhiteSpace(fontSize) {
        const dpr = this._editor.page.coordinate.dpr;
        return dpr * (fontSize * dpr * 0.3);
    }
}