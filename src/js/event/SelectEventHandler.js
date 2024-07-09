import {EventHandler} from "./EventHandler.js";
import {EventType} from "./EventType.js";
import {DragPageEventHandler} from "./drag/DragPageEventHandler.js";
import {MoveControlEventHandler} from "./drag/MoveControlEventHandler.js";
import {CursorType} from "../editor/CursorType.js";
import {PointPosition} from "../editor/control/PointPosition.js";
import {ResizeControlEventHandler} from "./drag/ResizeControlEventHandler.js";
import {ToolbarUtil} from "../editor/ToolbarUtil.js";
import {ResizeAction} from "../command/undo/ResizeAction.js";
import {ControlType} from "../editor/control/Control.js";

export class SelectEventHandler extends EventHandler {
    constructor() {
        super();
    }

    get type() {
        return EventType.SELECT;
    }

    onDoubleClick(e) {
        const page = e.editor.page;
        if (page?.selectControl?.control?.type === ControlType.LABEL) {
            const label = e.editor.page.selectControl.control;
            e.editor.textEditor.updateLabel(label);

            const p1 = label.lt;
            const p2 = e.point;
            const p3 = {x: p2.x - p1.x, y: p2.y - p1.y};
            const dpr = e.editor.page.coordinate.dpr;
            p3.x *= dpr;
            p3.y *= dpr;

            e.editor.textEditor.show({x: e.clientPoint.x - p3.x, y: e.clientPoint.y - p3.y});

            e.editor.tools.editeLabel();
            ToolbarUtil.getInstance().clear();
        }
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

            if ((page.selectControl.control.type === ControlType.LABEL) &&
                (resizeType === PointPosition.L || resizeType === PointPosition.R) ||
                (resizeType === PointPosition.T || resizeType === PointPosition.B)) {
                page.setCursor(CursorType.DEFAULT);
                page.selectControl.resizeType = PointPosition.NONE;
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
            e.originPoint, page.selectControl.control);
    }

    onMouseWheel(e) {
    }

    onKeyDown(e) {
    }

    onKeyUp(e) {
    }
}