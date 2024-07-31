import {ControlType} from "./control/Control.js";

export const ToolbarPosition = {
    TOOLBAR_TOP : -50,
    LINE_WIDTH_LEFT : -30,
    LINE_STYLE_LEFT : 10,
    LINE_COLOR_LEFT : 60,
    FILL_COLOR_LEFT : 100,
    FONT_COLOR_LEFT : 30,
}
export class ToolbarUtil {
    static instance;
    constructor() {
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = this;
            this.controlOptionToolbar = document.getElementById('control-option');
            this.lineWidthToolbar = document.getElementById('line-width');
            this.lineStyleToolbar = document.getElementById('line-style');
            this.lineColorToolbar = document.getElementById('line-color');
            this.fillColorToolbar = document.getElementById('fill-color');
            this.fillColorBtn = document.getElementById('fill-color-btn');

            this.fontOptionToolbar = document.getElementById('font-option');
            this.fontColorToolbar = document.getElementById('font-color');
            this.fontSize = document.getElementById('font-size');
        }
        return this.instance;
    }

    static showFontOptionToolbar(p, control) {
        this.fontOptionToolbar.classList.remove('hidden');
        this.fontOptionToolbar.style.top = p.y + 'px';
        this.fontOptionToolbar.style.left = p.x + 'px';
        this.fontSize.value = Math.round(control.fontSize);
        this.#checkTagXPosition(this.fontOptionToolbar, p.x);
    }

    static hideFontOptionToolbar() {
        this.fontOptionToolbar.classList.add('hidden');
        this.fontColorToolbar.classList.add('hidden');
    }

    static showControlOptionToolbar(e, control) {
        const p = e.originPoint;
        if (control.type === ControlType.LABEL) {
            this.clear();
            this.showFontOptionToolbar(p, control);
            return;
        }

        this.controlOptionToolbar.classList.remove('hidden');
        this.lineWidthToolbar.classList.add('hidden');
        this.lineStyleToolbar.classList.add('hidden');
        this.lineColorToolbar.classList.add('hidden');
        this.fillColorToolbar.classList.add('hidden');
        if (control.type === ControlType.LINE || control.type === ControlType.IMAGE) {
            this.fillColorBtn.classList.add('hidden');
        } else {
            this.fillColorBtn.classList.remove('hidden');
        }

        this.controlOptionToolbar.style.top = p.y + 'px';
        this.controlOptionToolbar.style.left = p.x + 'px';
        this.#checkTagXPosition(this.controlOptionToolbar, p.x);
        this.#checkTagYPosition(this.controlOptionToolbar, e);
    }

    static hideLineOptionToolbar() {
        this.controlOptionToolbar.classList.add('hidden');
        this.lineWidthToolbar.classList.add('hidden');
        this.lineStyleToolbar.classList.add('hidden');
        this.lineColorToolbar.classList.add('hidden');
        this.fillColorToolbar.classList.add('hidden');
    }

    static showLineWidthToolbar() {
        this.lineWidthToolbar.classList.remove('hidden');
        this.lineStyleToolbar.classList.add('hidden');
        this.lineColorToolbar.classList.add('hidden');
        this.fillColorToolbar.classList.add('hidden');
        this.#checkTagXPosition(this.lineWidthToolbar, ToolbarPosition.LINE_WIDTH_LEFT);
    }

    static showLineStyleToolbar() {
        this.lineStyleToolbar.classList.remove('hidden');
        this.lineWidthToolbar.classList.add('hidden');
        this.lineColorToolbar.classList.add('hidden');
        this.fillColorToolbar.classList.add('hidden');
    }

    static showLineColorToolbar() {
        this.lineColorToolbar.classList.remove('hidden');
        this.lineStyleToolbar.classList.add('hidden');
        this.lineWidthToolbar.classList.add('hidden');
        this.fillColorToolbar.classList.add('hidden');
        this.#checkTagXPosition(this.lineColorToolbar, ToolbarPosition.LINE_COLOR_LEFT);
    }

    static showFillColorToolbar() {
        this.fillColorToolbar.classList.remove('hidden');
        this.lineColorToolbar.classList.add('hidden');
        this.lineStyleToolbar.classList.add('hidden');
        this.lineWidthToolbar.classList.add('hidden');
        this.#checkTagXPosition(this.fillColorToolbar, ToolbarPosition.FILL_COLOR_LEFT);
    }

    static showFontColorToolbar() {
        this.fontColorToolbar.classList.remove('hidden');
        this.#checkTagXPosition(this.fontColorToolbar, ToolbarPosition.FONT_COLOR_LEFT);
    }

    static #checkTagXPosition(tag, tagLeft) {
        const rect = tag.getBoundingClientRect();
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;

        const gap = rect.right - windowWidth;
        let left = tag.style.left.replace("px", "");
        if (gap >= 0) {
            left = left - gap;
            tag.style.left = left + 'px';
        } else {
            tag.style.left = tagLeft + 'px';
        }
    }

    static #checkTagYPosition(tag, e) {
        const editorY = e.editor.canvas.getBoundingClientRect().y;
        const y = e.originPoint.y
        if (editorY > y) {
            tag.style.top = (y + Math.abs(ToolbarPosition.TOOLBAR_TOP)*2) + 'px';
        }
    }

    static clear() {
        this.hideLineOptionToolbar();
        this.hideFontOptionToolbar();
    }
}