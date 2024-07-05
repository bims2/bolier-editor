import {EventHandler} from "./EventHandler.js";
import {EventType} from "./EventType.js";
import {DragPageEventHandler} from "./drag/DragPageEventHandler.js";
import {MoveControlEventHandler} from "./drag/MoveControlEventHandler.js";
import {CursorType} from "../editor/CursorType.js";
import {PointPosition} from "../editor/control/PointPosition.js";
import {ResizeControlEventHandler} from "./drag/ResizeControlEventHandler.js";
import {ToolbarUtil} from "../editor/ToolbarUtil.js";
import {ResizeAction} from "../command/undo/ResizeAction.js";

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
            e.editor.historyManager.startUndo(new ResizeAction('undo resize', page.selectControl.control));
            e.editor.startDragHandler(new ResizeControlEventHandler());
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

        page.selectControl = render;
        if (render === null) {
            ToolbarUtil.getInstance().hideLineOptionToolbar()
            e.editor.startDragHandler(new DragPageEventHandler());
        }

        page.render();
    }

    onMouseMove(e) {
        const page = e.editor.page;
        page.coordinate.curPoint = {x: e.originEvent.offsetX, y: e.originEvent.offsetY};

        if (e.down && page.selectControl != null) {
            page.setCursor(CursorType.MOVE);
            e.editor.historyManager.startUndo(new ResizeAction('undo move', page.selectControl.control));
            e.editor.startDragHandler(new MoveControlEventHandler());
            return;
        }

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
            } else if (resizeType === PointPosition.L || resizeType === PointPosition.R) {
                page.setCursor(CursorType.L_R)
            } else if (resizeType === PointPosition.T || resizeType === PointPosition.B) {
                page.setCursor(CursorType.T_B)
            } else if (render !== null && page.selectControl.control === render.control) {
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
        const page = e.editor.page;
        if (page.selectControl === null) {
            return;
        }

        ToolbarUtil.getInstance().showControlOptionToolbar(
            { x: e.originEvent.offsetX, y: e.originEvent.offsetY }, page.selectControl.control);
    }

    onMouseWheel(e) {
    }

    onKeyDown(e) {
    }

    onKeyUp(e) {
    }
}