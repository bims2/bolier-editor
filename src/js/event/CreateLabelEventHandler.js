import {EventHandler} from "./EventHandler.js";
import {EventType} from "./EventType.js";

export class CreateLabelEventHandler extends EventHandler {
    constructor(editor) {
        super();
        this.label = editor.page.newControl;
        this.textEditor = editor.textEditor
        this.textEditor.updateLabel(this.label);
        editor.enabledShortcut = false;
        this.isDown = false;
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
            const inputSize = this.textEditor.getInputSize();
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
            return;
        }
        this.isDown = true;

        this.label.lt.x = e.point.x;
        this.label.lt.y = e.point.y;
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
        // const regex = /^[a-zA-Z0-9]$/;
        // const key = e.originEvent.key;
        // if (regex.test(key)) {
        //     let text = this.label.text;
        //     console.log(text);
        //     text += key;
        //     this.label.text = text;
        //     e.editor.render();
        // }
        //
        // console.log(key);
        this.textEditor.update();
    }

    onKeyUp(e) {

    }
}