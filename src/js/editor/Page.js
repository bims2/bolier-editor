import {Painter} from "./Painter.js";
import {Coordinate} from "./Coordinate.js";

const MAX_DPR = 10;
const MIN_DPR = 0.1;
export class Page {
    constructor(ctx) {
        this.ctx = ctx;
        this.ctx.canvas.cursor = 'move';
        this._painter = new Painter(ctx);
        this._coordinate = new Coordinate();
        this._controls = [];
        this._newControl = null;
        this._selectControls = [];
        this._selectControl = null;
        this._hoverControl = null;

        this.gridSize = 25;
        this.gridCount = 5;

        this.gridRender = true;
    }

    get controls() {
        return this._controls;
    }

    get newControl() {
        return this._newControl;
    }

    set newControl(value) {
        this._newControl = value;
    }

    get selectControls() {
        return this._selectControls;
    }

    get selectControl() {
        return this._selectControl;
    }

    set selectControl(value) {
        this._selectControl = value;
    }

    get hoverControl() {
        return this._hoverControl;
    }

    set hoverControl(value) {
        this._hoverControl = value;
    }

    get painter() {
        return this._painter;
    }

    setCursor(cursor) {
        this.ctx.canvas.style.cursor = cursor;
    }

    get coordinate() {
        return this._coordinate;
    }

    addControl(control) {
        this.controls.push(control);
        this.render();
    }

    removeControl(control) {
        this._controls = this.controls.filter(element => {
            return element !== control;
        });

        if (control === this.selectControl?.control) {
            this.selectControl = null;
            this.hoverControl = null;
        }
        this.render();
    }

    render() {
        this.transform();
        this.renderBackground();
        this._controls.forEach(control => {
            control.render(this.painter);
        });
        this.hoverControl?.render(this.painter);
        this.selectControl?.render(this.painter);
    }

    captureRender() {
        this.gridRender = false;
        this.render();
        this.gridRender = true;
    }

    renderBackground() {
        this.renderGrid();
    }

    renderGrid() {
        const coordinate = this.coordinate;
        const dpr = coordinate.dpr;
        const wayPoint = coordinate.wayPoint;
        const orgPoint = coordinate.orgPoint;
        const width = this.ctx.canvas.width / dpr;
        const height = this.ctx.canvas.height / dpr;

        const sX = -orgPoint.x / dpr - wayPoint.x;
        const eX = sX + width;
        const sY = -orgPoint.y / dpr - wayPoint.y;
        const eY = sY + height;

        this.ctx.clearRect(sX-1, sY-1, width+2, height+2);

        if (!this.gridRender) {
            return;
        }
        this.renderGridLine(sX, eX, sY, eY, true);
        this.renderGridLine(sY, eY, sX, eX, false);
    }

    renderGridLine(sP, eP, sP1, eP1, isVertical) {
        const gridSize = this.gridSize;
        let rX = sP % gridSize;
        let gridIdx = Math.floor(sP/gridSize);

        if (rX !== 0) {
            gridIdx = sP < 0 ? gridIdx-1 : gridIdx+1;
            sP = (gridIdx) * gridSize;
        }

        for (let i = sP; i < eP;) {
            const lineWidth = (gridIdx % this.gridCount) === 0 ? 2 : 1;
            const color = (gridIdx % this.gridCount) === 0 ?
                'rgba(0, 0, 0, 0.6)' :
                'rgb(129, 138, 138)';
            const line = this.getLinePoint({x: i, y:sP1}, {x: i, y: eP1}, isVertical);
            this.painter.drawLine(line.p1, line.p2, color, lineWidth, 0.5);
            i += gridSize;
            ++gridIdx;
        }
    }

    getLinePoint(p1, p2, isVertical) {
        if (isVertical) {
            return {p1, p2};
        }

        return {p1: {x: p1.y, y: p1.x}, p2: {x: p2.y, y: p2.x}};
    }

    scaleIn() {
        if (this._coordinate.dpr > MAX_DPR) {
            return;
        }
        this.scale(1.05);
        this.render();
    }

    scaleOut() {
        if (this._coordinate.dpr < MIN_DPR) {
            return;
        }
        this.scale(0.95);
        this.render();
    }

    scale(dpr) {
        const coordinate = this._coordinate;
        coordinate.dpr *= dpr;

        const oldOrigin = {
            x: coordinate.orgPoint.x,
            y: coordinate.orgPoint.y
        };
        coordinate.orgPoint = {
            x: coordinate.curPoint.x - (coordinate.curPoint.x - oldOrigin.x) * dpr,
            y: coordinate.curPoint.y - (coordinate.curPoint.y - oldOrigin.y) * dpr
        };

        this.transform();
    }

    transform() {
        const orgPoint = this.coordinate.orgPoint;
        const wayPoint = this.coordinate.wayPoint;
        const dpr = this.coordinate.dpr;

        const orgWayPoint = {
            x: wayPoint.x * dpr,
            y: wayPoint.y * dpr
        };

        this.ctx.setTransform(dpr, 0, 0, dpr, orgPoint.x + orgWayPoint.x, orgPoint.y + orgWayPoint.y);
    }
}