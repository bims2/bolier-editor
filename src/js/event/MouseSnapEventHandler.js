import {EventHandler} from "./EventHandler.js";
import {EventType} from "./EventType.js";

export class MouseSnapEventHandler extends EventHandler {
    constructor() {
        super();
    }

    get type() {
        return EventType.SNAP;
    }

    onMouseDown(e) {
        e.down = true;
        e.downPoint.x = e.point.x;
        e.downPoint.y = e.point.y;
        e.dragPoint.x = e.point.x;
        e.dragPoint.y = e.point.y;
        this.#setEvent(e);
    }

    onMouseMove(e) {
        this.#setEvent(e);
        const page = e.editor.page;
        page.coordinate.curPoint = {x: e.originEvent.offsetX, y: e.originEvent.offsetY};
    }

    onMouseUp(e) {
        e.down = false;
        this.#setEvent(e);
    }

    onMouseWheel(e) {
    }

    onKeyDown(e) {
    }

    onKeyUp(e) {
    }

    #setEvent(e) {
        const coordinate = e.editor.page.coordinate;
        const dpr = coordinate.dpr;
        const point = e.point;
        const originPoint = e.originPoint;

        originPoint.x = e.originEvent.offsetX;
        originPoint.y = e.originEvent.offsetY;

        point.x = originPoint.x / dpr;
        point.y = originPoint.y / dpr;

        const dprOrigin = {x: coordinate.orgPoint.x / dpr, y: coordinate.orgPoint.y / dpr};
        const wX = -coordinate.wayPoint.x - dprOrigin.x;
        const wY = -coordinate.wayPoint.y - dprOrigin.y;

        point.x += wX;
        point.y += wY;
    }
}