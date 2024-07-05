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
        painter.lineOption('rgb(53,155,255)', 1, 0.8);
        painter.drawRect(selRect);
        painter.end();

        painter.start();
        painter.lineOption('black');
        let resizeRect = ControlUtil.generateResizeRect(selRect.lt);
        painter.drawRect(resizeRect);
        resizeRect = ControlUtil.generateResizeRect(selRect.rt);
        painter.drawRect(resizeRect);
        resizeRect = ControlUtil.generateResizeRect(selRect.rb);
        painter.drawRect(resizeRect);
        resizeRect = ControlUtil.generateResizeRect(selRect.lb);
        painter.drawRect(resizeRect);
        painter.fill('white');
        painter.end();

    }
}