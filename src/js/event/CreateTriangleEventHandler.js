import {EventHandler} from "./EventHandler.js";
import {EventType} from "./EventType.js";
import {ControlUtil} from "../editor/control/ControlUtil.js";
import {CreateTriangleRender} from "../editor/control/render/CreateTriangleRender.js";
import {Action} from "../command/undo/Action.js";

export class CreateTriangleEventHandler extends EventHandler {
    constructor(editor) {
        super();
        this.editor = editor;
        this.triangle = editor.page.newControl;
        editor.addForegroundRender(new CreateTriangleRender(this.triangle));
        editor.historyManager.startUndo(new Action('undo create triangle', ()=> {
            editor.page.removeControl(this.triangle);
        }));
    }


    get type() {
        return EventType.CREATE_TRIANGLE;
    }

    onMouseDown(e) {
        e.editor.page.selectRender = null;
    }

    onMouseMove(e) {
        if (!e.down) {
            this.triangle.setPosition(e.point);
        } else {
            const width = e.point.x - e.downPoint.x;

            this.triangle.top.x = e.downPoint.x + width/2;
            this.triangle.top.y = e.downPoint.y;
            this.triangle.left.x = e.downPoint.x;
            this.triangle.left.y = e.point.y;
            this.triangle.right.x = e.point.x;
            this.triangle.right.y = e.point.y;
        }
        e.editor.render();
    }

    onMouseUp(e) {
        ControlUtil.checkDragPosition(this.triangle, e.downPoint, e.point);
        this.triangle.updatePosition();
        this.editor.removeForegroundRender();
        this.editor.clearCommand();
        e.editor.page.addControl(this.triangle);
        e.editor.historyManager.endUndo(new Action('redo create triangle', ()=> {
            this.editor.page.addControl(this.triangle);
        }));
    }

    onKeyUp(e) {
        super.onKeyUp(e);
    }
}