import {ControlRender} from "./ControlRender.js";
import {SelectionRect} from "../SelectionRect.js";
import {ControlUtil} from "../ControlUtil.js";

export class SelectControlRender extends ControlRender {
    constructor(control) {
        super(control);
        this.selectionRect = new SelectionRect();
    }

    render(painter) {
        const control = this.control;
        control.updateSelectPosition();
        this.selectionRect.updatePosition(control.minPoint, control.maxPoint);

        const selRect = this.selectionRect;
        painter.start();
        painter.drawRect(selRect);
        painter.end();

        painter.start();
        let resizeRect = ControlUtil.generateResizeRect(selRect.lt);
        painter.drawRect(resizeRect);
        resizeRect = ControlUtil.generateResizeRect(selRect.rt);
        painter.drawRect(resizeRect);
        resizeRect = ControlUtil.generateResizeRect(selRect.rb);
        painter.drawRect(resizeRect);
        resizeRect = ControlUtil.generateResizeRect(selRect.lb);
        painter.drawRect(resizeRect);
        painter.end();
    }
}