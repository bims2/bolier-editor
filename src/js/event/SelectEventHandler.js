import {EventHandler} from "./EventHandler.js";
import {EventType} from "./EventType.js";
import {DragPageEventHandler} from "./drag/DragPageEventHandler.js";
import {MoveControlEventHandler} from "./drag/MoveControlEventHandler.js";
import {CursorType} from "../editor/CursorType.js";
import {PointPosition} from "../editor/control/PointPosition.js";
import {ResizeControlEventHandler} from "./drag/ResizeControlEventHandler.js";

export class SelectEventHandler extends EventHandler {
    constructor() {
        super();
    }

    get type() {
        return EventType.SELECT;
    }

    onMouseDown(e) {
        const page = e.editor.page;

        if (page.selectControl !== null && page.selectControl.resizeType !== PointPosition.NONE) {
            e.editor.setDragHandler(new ResizeControlEventHandler());
            return;
        }

        let render = null;
        const controls = page.controls;
        for (const control of controls) {
            render = control.ptInSelectControl(e.point);
            if (render !== null) {
                break;
            }
        }

        if (render === null) {
            e.editor.setDragHandler(new DragPageEventHandler());
            page.selectControl = null;
            return;
        }

        e.editor.setDragHandler(new MoveControlEventHandler());

        page.selectControl = render;
        page.render();
    }

    onMouseMove(e) {
        const page = e.editor.page;
        page.coordinate.curPoint = {x: e.originEvent.offsetX, y: e.originEvent.offsetY};

        let render = null;
        const controls = page.controls;
        for (const control of controls) {
            render = control.ptInHoverControl(e.point);
            if (render !== null) {
                break;
            }
        }

        if (page.selectControl !== null) {
            const selControl = page.selectControl.control;
            const resizeType = selControl.ptInResizePoint(e.point);
            page.selectControl.resizeType = resizeType;
            if (resizeType === PointPosition.LT || resizeType === PointPosition.RB) {
                page.setCursor(CursorType.LT_RB);
            } else if (resizeType === PointPosition.RT || resizeType === PointPosition.LB) {
                page.setCursor(CursorType.RT_LB);
            } else if (render !== null){
                page.setCursor(CursorType.MOVE);
            } else {
                page.setCursor(CursorType.DEFAULT);
            }
        } else {
            page.setCursor(CursorType.DEFAULT);
        }

        page.hoverControl = render;
        page.render();
    }

    onMouseUp(e) {
    }

    onMouseWheel(e) {
    }

    onKeyDown(e) {
        console.log(e.originEvent.key);
    }

    onKeyUp(e) {
    }
}