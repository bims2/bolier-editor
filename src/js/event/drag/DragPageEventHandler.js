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

        let mx = e.point.x - downPoint.x;
        let my = e.point.y - downPoint.y;

        const orgPoint = coordinate.orgPoint;
        const dpr = coordinate.dpr;
        const wayPoint = coordinate.wayPoint;

        const minX = -orgPoint.x / dpr;
        const maxX = page.width;
        const x = wayPoint.x + mx;
        if (minX < x) {
            mx = minX - wayPoint.x;
        } else if (maxX < (page.width/dpr - x + minX)) {
            mx = (page.width/dpr - wayPoint.x + minX) - maxX;
        }
        wayPoint.x += mx;

        const minY = -orgPoint.y / dpr;
        const maxY = page.height;
        const y = wayPoint.y + my
        if (minY < y) {
            my = minY - wayPoint.y;
        } else if (maxY < (page.height/dpr - y + minY)) {
            my = (page.height/dpr - wayPoint.y + minY) - maxY;
        }
        wayPoint.y += my;

        page.render();
    }

    onMouseUp(e) {
        e.editor.finishDragHandler();
    }
}