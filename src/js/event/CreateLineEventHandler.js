import {EventHandler} from "./EventHandler.js";
import {EventType} from "./EventType.js";
import {ControlUtil} from "../editor/control/ControlUtil.js";
import {CreateLineRender} from "../editor/control/render/CreateLineRender.js";
import {Action} from "../command/undo/Action.js";

export class CreateLineEventHandler extends EventHandler {
    constructor(editor) {
        super();
        this.line = editor.page.newControl;
        this.editor = editor;
        editor.addForegroundRender(new CreateLineRender(this.line));
        editor.historyManager.startUndo(new Action('undo create line', ()=> {
            editor.page.removeControl(this.line);
        }));
    }

    get type() {
        return EventType.CREATE_LINE;
    }

    onMouseDown(e) {
        e.editor.page.selectControl = null;
    }

    onMouseMove(e) {
        if (!e.down) {
            this.line.setPosition(e.point);
        } else {
            this.line.p1.x = e.downPoint.x;
            this.line.p1.y = e.downPoint.y;
            this.line.p2.x = e.point.x;
            this.line.p2.y = e.point.y;
        }
        this.editor.render();
    }

    onMouseUp(e) {
        ControlUtil.checkDragPosition(this.line, e.downPoint, e.point);
        this.line.updatePosition();
        this.editor.removeForegroundRender();
        this.editor.clearCommand();
        e.editor.page.addControl(this.line);

        e.editor.historyManager.endUndo(new Action('redo create line', ()=> {
            this.editor.page.addControl(this.line);
        }));
    }

    onMouseWheel(e) {
    }

    onKeyDown(e) {
    }

    onKeyUp(e) {
    }
}