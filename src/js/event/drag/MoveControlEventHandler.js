import {EventHandler} from "../EventHandler.js";
import {ResizeAction} from "../../command/undo/ResizeAction.js";

export class MoveControlEventHandler extends EventHandler {

    onMouseMove(e) {
        const control = e.editor.page.selectControl.control;

        const mx = e.point.x - e.downPoint.x;
        const my = e.point.y - e.downPoint.y;

        control.move({x: mx, y: my});

        e.downPoint.x = e.point.x;
        e.downPoint.y = e.point.y;

        e.editor.page.render();
    }

    onMouseUp(e) {
        e.editor.finishDragHandler();
        //TODO: duplicate
        const xGap = Math.abs(e.dragPoint.x - e.point.x);
        const yGap = Math.abs(e.dragPoint.y - e.point.y);
        if (xGap <= 1 &&  yGap <= 1) {
            return;
        }
        e.editor.historyManager.endUndo(new ResizeAction('redo move', e.editor.page.selectControl.control));
    }
}