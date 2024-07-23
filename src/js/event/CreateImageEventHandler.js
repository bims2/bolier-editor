import {EventHandler} from "./EventHandler.js";
import {CreateImageRender} from "../editor/control/render/CreateImageRender.js";
import {EventType} from "./EventType.js";
import {ControlUtil} from "../editor/control/ControlUtil.js";
import {ImageRect} from "../editor/control/ImageRect.js";
import {Action} from "../command/undo/Action.js";

export class CreateImageEventHandler extends EventHandler {
    constructor(editor, image) {
        super();
        this.editor = editor;
        this.image = new ImageRect(image);
        editor.addForegroundRender(new CreateImageRender(this.image));
        editor.historyManager.startUndo(new Action('undo create image', ()=> {
            editor.page.removeControl(this.image);
        }));

        this._maxImage = false;
    }

    get type() {
        return EventType.CREATE_IMAGE;
    }

    onMouseDown(e) {
        e.editor.page.selectRender = null;
    }

    onMouseMove(e) {
        this._maxImage = false;
        const image = this.image;
        if (!e.down) {
            image.setPosition(e.point);
        } else {
            image.lt.x = e.downPoint.x;
            image.lt.y = e.downPoint.y;

            image.rt.x = e.point.x;
            image.rt.y = e.downPoint.y;

            image.rb.x = e.point.x;
            image.rb.y = e.point.y;

            image.lb.x = e.downPoint.x;
            image.lb.y = e.point.y;
        }
        this.editor.render();
    }

    onMouseUp(e) {
        if (!this._maxImage) {
            ControlUtil.checkDragPosition(this.image, e.downPoint, e.point);
        }
        this.image.updatePosition();
        this.editor.removeForegroundRender();
        this.editor.clearCommand();

        e.editor.page.addControl(this.image);
        e.editor.historyManager.endUndo(new Action('redo create image', ()=> {
            this.editor.page.addControl(this.image);
        }));
    }

    onKeyDown(e) {
        if (e.originEvent.key !== ' ') {
            return;
        }

        this._maxImage = true;
        const image = this.image;
        const width = e.editor.width;
        const height = e.editor.height;
        image.lt.x = 0;
        image.lt.y = 0;

        image.rt.x = width;
        image.rt.y = 0;

        image.rb.x = width;
        image.rb.y = height;

        image.lb.x = 0;
        image.lb.y = height;
        e.editor.render();
    }
}