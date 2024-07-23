import {EventManager} from "../event/EventManager.js";
import {Page} from "./Page.js";
import {Tools} from "../Tools.js";
import {ToolbarUtil} from "./ToolbarUtil.js";
import {HistoryManager} from "./HistoryManager.js";
import {TextEditor} from "./text/TextEditor.js";
import {Toolbar} from "./Toolbar.js";

// import "../../css/style.css"

export class Editor {
    constructor(id, {width, height}) {
        const root = document.getElementById(id);
        root.className = 'm-5';

        this.canvas = document.createElement('canvas');
        this.canvas.style.border = 'solid 2px #000';
        const DEFAULT_WIDTH = 700;
        const rate = DEFAULT_WIDTH / width;
        this.canvas.width = DEFAULT_WIDTH;
        this.canvas.height = height * rate;

        this.ctx = this.canvas.getContext('2d');
        this.page = new Page(this.ctx);
        this.eventManager = new EventManager(this);
        this._historyManager = new HistoryManager(this);
        this._tools = new Tools(this);
        this._toolbar = new Toolbar(this);

        this._textEditor = new TextEditor(this);

        this.foregroundRender = null;
        this._enabledShortcut = true;

        this.#init(root);
    }

    #init(root) {
        this._toolbar.createToolbar(root);
        root.appendChild(this.canvas);

        this.page.render();

        this.canvas.addEventListener('dblclick', (e) => {
            this.eventManager.onDoubleClick(e);
        });

        this.canvas.addEventListener('mousedown', (e)=> {
            this.eventManager.onMouseDown(e);
        });

        this.canvas.addEventListener('mousemove', (e)=> {
            this.eventManager.onMouseMove(e);
        });

        this.canvas.addEventListener('mouseup', (e)=> {
            this.eventManager.onMouseUp(e);
        });

        this.canvas.addEventListener('wheel', (e) => {
            this.eventManager.onMouseWheel(e);
        });

        document.addEventListener('keydown', (e) => {
            this.eventManager.onKeyDown(e);
        });

        document.addEventListener('keyup', (e) => {
            this.eventManager.onKeyUp(e);
        });
    }

    capture() {
        this.#captureRender();

        const link = document.createElement('a');
        link.href = this.save();
        link.download = 'canvas_image.png';
        link.click();
    }

    save() {
        this.ctx.save();
        this.#captureRender();
        const base64 = this.canvas.toDataURL("image/png");
        this.ctx.restore();
        this.render();
        return base64;
    }

    #captureRender() {
        this.page.captureRender();
    }

    get enabledShortcut() {
        return this._enabledShortcut;
    }

    set enabledShortcut(value) {
        this._enabledShortcut = value;
    }

    addEventHandler(handler) {
        this.eventManager.addHandler(handler);
    }

    removeEventHandler(handler) {
        this.eventManager.removeHandler(handler);
    }

    addForegroundRender(render) {
        this.foregroundRender = render;
    }

    removeForegroundRender() {
        this.foregroundRender = null;
    }

    startDragHandler(handler) {
        ToolbarUtil.getInstance().clear();
        this.eventManager.startDragHandler(handler);
    }

    finishDragHandler() {
        this.eventManager.finishDragHandler();
    }

    clearCommand() {
        this._tools.clear();
    }

    render() {
        this.page.render();
        this.foregroundRender?.render(this.page.painter);
    }

    get toolbar() {
        return this._toolbar;
    }

    get tools() {
        return this._tools;
    }

    get textEditor() {
        return this._textEditor;
    }

    get historyManager() {
        return this._historyManager;
    }

    get width() {
        return this.canvas.width;
    }

    get height() {
        return this.canvas.height;
    }

    get maxPosition() {
        const canvasRect = this.canvas.getBoundingClientRect();
        const maxX = canvasRect.right;
        const maxY = canvasRect.y + canvasRect.height;

        return {x: maxX, y: maxY};
    }

    get minPosition() {
        const canvasRect = this.canvas.getBoundingClientRect();
        const borderWidth = Number(this.canvas.style.borderWidth.slice(0, -2));
        const minX = canvasRect.x + borderWidth;
        const minY = canvasRect.y + borderWidth;

        return {x: minX, y: minY};
    }
}