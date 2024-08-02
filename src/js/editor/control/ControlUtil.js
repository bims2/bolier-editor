import {SelectionRect} from "./SelectionRect.js";

export class ControlUtil {
    static checkDragPosition(control, downPoint, p) {
        if (Math.abs(downPoint.x - p.x) <= 10 &&
            Math.abs(downPoint.y - p.y) <= 10) {
            control.setPosition(p);
        }
    }

    static generateResizeRect(p) {
        const rect = new SelectionRect();
        rect.fillColor = 'rgb(255, 255, 255)';
        rect.lineColor = 'rgb(0, 0, 0)';
        rect.updatePosition({x: p.x-3, y: p.y-3}, {x: p.x+3, y: p.y+3});
        return rect;
    }

    static ptInLine(p, line) {
        let x = p.x;
        let y = p.y;
        let x1 = line.p1.x;
        let y1 = line.p1.y;
        let x2 = line.p2.x;
        let y2 = line.p2.y;

        const a = Math.sqrt(((x2-x1)**2) + ((y2-y1)**2));
        const b = Math.sqrt(((x1-x)**2) + ((y1-y)**2));
        const c = Math.sqrt(((x2-x)**2) + ((y2-y)**2));
        const d = b + c - a;

        return d <= 1;
    }

    static rgbToRgba(color, opacity) {
        const st = color.indexOf('(');
        const ed = color.indexOf(')');
        const rgb = color.slice(st, ed);
        return 'rgba' + rgb + ',' + opacity + ')';
    }
}