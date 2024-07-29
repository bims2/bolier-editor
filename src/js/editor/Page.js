import {Painter} from "./Painter.js";
import {Coordinate} from "./Coordinate.js";

const MAX_DPR = 10;
const MIN_DPR = 1;
export class Page {
    constructor(ctx) {
        this.ctx = ctx;
        this.ctx.canvas.cursor = 'move';
        this._painter = new Painter(ctx);
        this._coordinate = new Coordinate();
        this._controls = [];
        this._newControl = null;
        this._selectControls = [];
        this._selectRender = null;
        this._hoverRender = null;
        this._copyControl = null;

        this.gridSize = 25;
        this.gridCount = 5;

        this._viewControlOrder = false;
        this._viewOutLine = false;
    }

    get width() {
        return this.ctx.canvas.width;
    }

    get height() {
        return this.ctx.canvas.height;
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

    get selectRender() {
        return this._selectRender;
    }

    set selectRender(value) {
        this._selectRender = value;
    }

    get hoverRender() {
        return this._hoverRender;
    }

    set hoverRender(value) {
        this._hoverRender = value;
    }

    get copyControl() {
        return this._copyControl;
    }

    set copyControl(control) {
        this._copyControl = control;
    }

    get painter() {
        return this._painter;
    }

    setCursor(cursor) {
        this.ctx.canvas.style.cursor = cursor;
    }

    get viewControlOrder() {
        return this._viewControlOrder;
    }

    set viewControlOrder(value) {
        this._viewControlOrder = value;
    }

    get viewOutLine() {
        return this._viewOutLine;
    }

    set viewOutLine(value) {
        this._viewOutLine = value;
    }

    get coordinate() {
        return this._coordinate;
    }

    addControl(control, idx) {
        if (idx) {
            this.controls.splice(idx, 0, control);
        } else {
            this.controls.push(control);
        }
        this.render();
    }

    removeControl(control) {
        this._controls = this.controls.filter(element => {
            return element !== control;
        });

        if (control === this.selectRender?.control) {
            this.selectRender = null;
            this.hoverRender = null;
        }
        this.render();
    }

    render() {
        this.transform();
        this.renderBackground();
        this._controls.forEach((control, idx) => {
            control.render(this.painter);
            if (!this.viewControlOrder) {
                return;
            }
            this.painter.drawText(control.minPoint, idx); // 순서 체크용 코드
        });
        this.hoverRender?.render(this.painter);
        this.selectRender?.render(this.painter);
    }

    captureRender() {
        this.initTransform();
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this._controls.forEach(control => {
            control.render(this.painter);
        });
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

        // console.log('sX', sX, 'sY', sY, 'orgPoint', {x: orgPoint.x / dpr, y: orgPoint.y / dpr}, 'wayPoint', wayPoint);
        this.ctx.clearRect(sX-1, sY-1, width+2, height+2);

        //100% 화면 영역표시
        if (this._viewOutLine) {
            const orgWidth = this.ctx.canvas.width;
            const orgHeight = this.ctx.canvas.height;
            this.painter.drawLine({x: 0, y: 0}, {x: orgWidth, y: 0}, 'blue', 3, 1);
            this.painter.drawLine({x: orgWidth, y: 0}, {x: orgWidth, y: orgHeight}, 'blue', 3, 1);
            this.painter.drawLine({x: orgWidth, y: orgHeight}, {x: 0, y: orgHeight}, 'blue', 3, 1);
            this.painter.drawLine({x: 0, y: orgHeight}, {x: 0, y: 0}, 'blue', 3, 1);
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
        const coordinate = this.coordinate;
        if (coordinate.dpr === MAX_DPR) {
            return;
        }

        let dpr = 1.05;
        if (coordinate.dpr > MAX_DPR) {
            dpr = MAX_DPR / coordinate.dpr;
        }
        this.scale(dpr);
        this.render();
    }

    scaleOut() {
        const coordinate = this.coordinate;
        if (coordinate.dpr === MIN_DPR) {
            return;
        }

        let dpr = 0.95;
        if (coordinate.dpr < MIN_DPR) {
            dpr = MIN_DPR / coordinate.dpr;
        }
        this.scale(dpr);
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

        // FIXME: 배율이 100일때 zoom out시 화면이 튀는 현상
        const orgPoint = coordinate.orgPoint;
        const wayPoint = coordinate.wayPoint;
        let minX = -orgPoint.x / coordinate.dpr - wayPoint.x;
        const maxX = this.width;
        const oldOrgX = oldOrigin.x;
        if (minX < 0) {
            // console.log('min');
            let orgX = orgPoint.x + (minX * coordinate.dpr);
            let curX = (orgX-oldOrgX*dpr)/(1-dpr);
            orgX = curX - (curX - oldOrigin.x) * dpr
            // console.log('curX', coordinate.curPoint.x, 'change curX', curX, 'dpr', dpr, 'orgPoint', orgPoint);
            coordinate.curPoint.x = curX;
            orgPoint.x = orgX;
        } else if (maxX < this.width/coordinate.dpr + minX) {
            // console.log('max');
            const xGap = (this.width/coordinate.dpr + minX) - maxX;
            // console.log(this.width/coordinate.dpr + minX, 'xGap', xGap);
            let orgX = orgPoint.x + xGap * coordinate.dpr;
            let curX = (orgX-oldOrgX*dpr)/(1-dpr);
            orgX = curX - (curX - oldOrigin.x) * dpr;

            coordinate.curPoint.x = curX;
            orgPoint.x = orgX;
        }

        let minY = -orgPoint.y / coordinate.dpr - wayPoint.y;
        const maxY = this.height;
        const oldOrgY = oldOrigin.y;
        if (minY < 0) {
            let orgY = orgPoint.y + (minY * coordinate.dpr);
            let curY = (orgY-oldOrgY*dpr)/(1-dpr);
            orgY = curY - (curY - oldOrigin.y) * dpr
            coordinate.curPoint.y = curY;
            orgPoint.y = orgY;
        } else if (maxY < this.height/coordinate.dpr + minY) {
            // console.log('max');
            const yGap = (this.height/coordinate.dpr + minY) - maxY;
            // console.log(this.height/coordinate.dpr + minY, 'yGap', yGap);
            let orgY = orgPoint.y + yGap * coordinate.dpr;
            let curY = (orgY-oldOrgY*dpr)/(1-dpr);
            orgY = curY - (curY - oldOrigin.y) * dpr;

            coordinate.curPoint.y = curY;
            orgPoint.y = orgY;
        }

        const curPoint = coordinate.curPoint;
        // console.log('sX', minX, 'sY', minY, 'orgPoint', {x: orgPoint.x / dpr, y: orgPoint.y / dpr}, 'wayPoint', wayPoint, 'curPoint', curPoint, 'dpr', coordinate.dpr);
        // console.log('pageWidth dpr', this.width / coordinate.dpr, 'pageHeight dpr', this.height / coordinate.dpr);

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

    initTransform() {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
}