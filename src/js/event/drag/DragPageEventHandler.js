import {EventHandler} from "../EventHandler.js";
import {EventType} from "../EventType.js";

export class DragPageEventHandler extends EventHandler {
    constructor() {
        super();
    }

    get type() {
        return EventType.DRAG_PAGE;
    }

    onMouseMove(e) {
        if (!e.down) {
            return;
        }

        const page = e.editor.page;
        const coordinate = page.coordinate;
        const downPoint = e.downPoint;

        const mx = e.point.x - downPoint.x;
        const my = e.point.y - downPoint.y;

        coordinate.wayPoint.x += mx;
        coordinate.wayPoint.y += my;

        page.render();
    }

    onMouseUp(e) {
        e.editor.finishDragHandler();
    }
}