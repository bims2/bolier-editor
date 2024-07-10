import {ControlType} from "./control/Control.js";

export const ToolbarPosition = {
    TOOLBAR_TOP : -50,
    LINE_WIDTH_LEFT : -30,
    LINE_STYLE_LEFT : 10,
    LINE_COLOR_LEFT : 60,
    FILL_COLOR_LEFT : 100,
}
export class ToolbarUtil {
    static instance;
    constructor() {
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = this;
            this.lineOptionToolbar = document.getElementById('line-option');
            this.lineWidthToolbar = document.getElementById('line-width');
            this.lineStyleToolbar = document.getElementById('line-style');
            this.lineColorToolbar = document.getElementById('line-color');
            this.fillColorToolbar = document.getElementById('fill-color');
            this.fillColorBtn = document.getElementById('fill-color-btn');

            this.fontOptionToolbar = document.getElementById('font-option');
        }
        return this.instance;
    }

    static showFontOptionToolbar(p) {
        this.fontOptionToolbar.classList.remove('hidden');
        this.fontOptionToolbar.style.top = p.y + 'px';
        this.fontOptionToolbar.style.left = p.x + 'px';
        this.#checkTagPosition(this.fontOptionToolbar, p.x);
    }

    static hideFontOptionToolbar() {
        this.fontOptionToolbar.classList.add('hidden');
    }

    static showControlOptionToolbar(p, control) {
        if (control.type === ControlType.LABEL) {
            this.clear();
            this.showFontOptionToolbar(p);
            return;
        }

        this.lineOptionToolbar.classList.remove('hidden');
        this.lineWidthToolbar.classList.add('hidden');
        this.lineStyleToolbar.classList.add('hidden');
        this.lineColorToolbar.classList.add('hidden');
        this.fillColorToolbar.classList.add('hidden');
        if (control.type === ControlType.LINE || control.type === ControlType.IMAGE) {
            this.fillColorBtn.classList.add('hidden');
        } else {
            this.fillColorBtn.classList.remove('hidden');
        }

        this.lineOptionToolbar.style.top = p.y + 'px';
        this.lineOptionToolbar.style.left = p.x + 'px';
        this.#checkTagPosition(this.lineOptionToolbar, p.x);
    }

    static hideLineOptionToolbar() {
        this.lineOptionToolbar.classList.add('hidden');
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
        this.#checkTagPosition(this.lineWidthToolbar, ToolbarPosition.LINE_WIDTH_LEFT);
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
        this.#checkTagPosition(this.lineColorToolbar, ToolbarPosition.LINE_COLOR_LEFT);
    }

    static showFillColorToolbar() {
        this.fillColorToolbar.classList.remove('hidden');
        this.lineColorToolbar.classList.add('hidden');
        this.lineStyleToolbar.classList.add('hidden');
        this.lineWidthToolbar.classList.add('hidden');
        this.#checkTagPosition(this.fillColorToolbar, ToolbarPosition.FILL_COLOR_LEFT);
    }

    static #checkTagPosition(tag, tagLeft) {
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

    static clear() {
        this.hideLineOptionToolbar();
        this.hideFontOptionToolbar();
    }
}