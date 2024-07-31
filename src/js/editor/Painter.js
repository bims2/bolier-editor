import {LineStyle} from "./control/LineStyle.js";

export class Painter {
    constructor(ctx) {
        this._ctx = ctx;
    }

    get ctx() {
        return this._ctx;
    }

    drawLabel(label) {
        const x = label.minPoint.x;
        const y = label.maxPoint.y;

        this.ctx.font = `${label.fontSize}px Arial`;
        this.ctx.fillStyle = label.fontColor;
        // this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'bottom';
        this.ctx.fillText(label.text, x, y);
    }

    drawText(p, text, fontSize = 10, fontColor = 'black') {
        this.start();
        this.ctx.font = `${fontSize}px Arial`;
        this.ctx.fillStyle = fontColor;
        this.ctx.fillText(text, p.x, p.y);
        this.end();
    }

    drawLine(p1, p2, color = 'black', width = 1, opacity = 1, style = LineStyle.SOLID) {
        this.start();
        this.lineOption(color, width, opacity, style);
        this.line(p1, p2);
        this.lineEnd();
        this.end();
        return this;
    }

    lineOption(color = 'black', width = 1, opacity = 1, style = LineStyle.SOLID) {
        const ctx = this._ctx;
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.globalAlpha = opacity;
        if (style !== LineStyle.SOLID) {
            this.ctx.setLineDash([5, 5]);
        }
    }

    line(p1, p2) {
        const ctx = this._ctx;
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
    }

    lineEnd() {
        this.ctx.stroke();
    }

    start() {
        const ctx = this._ctx;
        ctx.save();
        ctx.beginPath();
    }

    end() {
        const ctx = this._ctx;
        ctx.closePath();
        ctx.restore();
    }

    drawRect(rect) {
        const lt = rect.lt;
        const rt = rect.rt;
        const rb = rect.rb;
        const lb = rect.lb;

        const ctx = this.ctx;
        ctx.moveTo(lt.x, lt.y);
        ctx.lineTo(rt.x, rt.y);
        ctx.lineTo(rb.x, rb.y);
        ctx.lineTo(lb.x, lb.y);
        ctx.lineTo(lt.x, lt.y);
        this.lineEnd();
    }

    drawTriangle(triangle) {
        const top = triangle.top;
        const left = triangle.left;
        const right = triangle.right;

        const ctx = this.ctx;
        ctx.moveTo(top.x, top.y);
        ctx.lineTo(left.x, left.y);
        ctx.lineTo(right.x, right.y);
        ctx.lineTo(top.x, top.y);
        this.lineEnd();
    }

    drawCircle(circle) {
        const ctx = this.ctx;
        ctx.ellipse(circle.p.x, circle.p.y, circle.xRadius, circle.yRadius, 0, 0, 2*Math.PI);
        this.lineEnd();
    }

    fill(color, opacity = 1) {
        const ctx = this.ctx;
        ctx.fillStyle = color;
        ctx.globalAlpha = opacity;
        ctx.fill();
    }

    drawImage(img, x, y, w, h) {
        this._ctx.drawImage(img, x, y, w, h);
    }
}