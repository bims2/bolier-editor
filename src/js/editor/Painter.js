import {LineStyle} from "./control/LineStyle.js";
import {ControlUtil} from "./control/ControlUtil.js";

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

        this.ctx.save();
        this.ctx.font = `${label.fontSize}px Arial`;
        this.ctx.fillStyle = label.fontColor;
        // this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'bottom';
        this.ctx.fillText(label.text, x, y);
        this.ctx.restore();
    }

    drawText(p, text, fontSize = 10, fontColor = 'black') {
        this.start();
        this.ctx.font = `${fontSize}px Arial`;
        this.ctx.fillStyle = fontColor;
        this.ctx.fillText(text, p.x, p.y);
        this.end();
    }

    drawLine(p1, p2, color = 'rgb(0,0,0)', width = 1, opacity = 1, style = LineStyle.SOLID) {
        this.start();
        this.lineOption(color, width, opacity, style);
        this.line(p1, p2);
        this.lineEnd();
        this.end();
        return this;
    }

    lineOption(color = 'rgb(0,0,0)', width = 1, opacity = 1, style = LineStyle.SOLID) {
        const ctx = this._ctx;
        ctx.strokeStyle = ControlUtil.rgbToRgba(color, opacity);
        ctx.lineWidth = width;
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
        this.ctx.closePath();
        this.ctx.stroke();
    }

    start() {
        const ctx = this._ctx;
        ctx.save();
        ctx.beginPath();
    }

    end() {
        const ctx = this._ctx;
        ctx.restore();
    }

    drawRect(rect) {
        const lt = rect.lt;
        const rb = rect.rb;
        const width = rb.x - lt.x;
        const height = rb.y - lt.y;

        const ctx = this.ctx;
        ctx.save();
        // this.ctx.lineCap = 'round';
        // this.ctx.lineJoin = 'round';
        if (rect.fillColor !== '') {
            ctx.fillStyle = ControlUtil.rgbToRgba(rect.fillColor, rect.opacity?? 1);
            ctx.fillRect(lt.x, lt.y, width, height);
        }
        if (rect.lineColor !== '') {
            this.lineOption(rect.lineColor, rect.lineWidth ?? 0.5);
            ctx.strokeRect(lt.x, lt.y, width, height);
        }

        ctx.restore();
    }

    drawTriangle(triangle) {
        const top = triangle.top;
        const left = triangle.left;
        const right = triangle.right;

        const ctx = this.ctx;
        this.start();
        this.lineOption(triangle.lineColor, triangle.lineWidth, 1, triangle.lineStyle);
        ctx.beginPath();
        ctx.moveTo(top.x, top.y);
        ctx.lineTo(left.x, left.y);
        ctx.lineTo(right.x, right.y);
        ctx.lineTo(top.x, top.y);
        this.fill(triangle.fillColor, triangle.opacity);
        this.lineEnd();
        this.end();
    }

    drawCircle(circle) {
        const ctx = this.ctx;
        this.start();
        ctx.ellipse(circle.p.x, circle.p.y, circle.xRadius, circle.yRadius, 0, 0, 2*Math.PI);
        this.fill(circle.fillColor, circle.opacity);
        if (circle.lineColor !== '') {
            this.lineOption(circle.lineColor, circle.lineWidth, 1, circle.lineStyle);
            this.lineEnd();
        }
        this.end();
    }

    fill(color, opacity = 1) {
        const ctx = this.ctx;
        ctx.fillStyle = ControlUtil.rgbToRgba(color, opacity);
        ctx.fill();
    }

    drawImage(img, x, y, w, h) {
        this._ctx.drawImage(img, x, y, w, h);
    }
}