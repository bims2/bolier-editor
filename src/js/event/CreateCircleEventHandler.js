import {EventHandler} from "./EventHandler.js";
import {EventType} from "./EventType.js";
import {ControlUtil} from "../editor/control/ControlUtil.js";
import {CreateCircleRender} from "../editor/control/render/CreateCircleRender.js";
import {Action} from "../command/undo/Action.js";

export class CreateCircleEventHandler extends EventHandler {
    constructor(editor) {
        super();
        this.editor = editor;
        this.circle = editor.page.newControl;
        editor.addForegroundRender(new CreateCircleRender(this.circle));
        editor.historyManager.startUndo(new Action('undo create circle', ()=> {
            editor.page.removeControl(this.circle);
        }));
    }

    get type() {
        return EventType.CREATE_CIRCLE;
    }

    onMouseDown(e) {
        e.editor.page.selectControl = null;
    }

    onMouseMove(e) {
        if (!e.down) {
            this.circle.setPosition(e.point);
        } else {
            this.circle.lt.x = e.downPoint.x;
            this.circle.lt.y = e.downPoint.y;

            this.circle.rt.x = e.point.x;
            this.circle.rt.y = e.downPoint.y;

            this.circle.rb.x = e.point.x;
            this.circle.rb.y = e.point.y;

            this.circle.lb.x = e.downPoint.x;
            this.circle.lb.y = e.point.y;
        }
        this.editor.render();
    }

    onMouseUp(e) {
        ControlUtil.checkDragPosition(this.circle, e.downPoint, e.point);
        this.circle.updatePosition();
        this.editor.removeForegroundRender();
        this.editor.clearCommand();

        e.editor.historyManager.endUndo(new Action('redo create circle', ()=> {
            this.editor.page.addControl(this.circle);
        }));
        e.editor.page.addControl(this.circle);
    }
}