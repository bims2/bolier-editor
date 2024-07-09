import {TextUtil} from "./TextUtil.js";

export class TextEditor {
    constructor(editor) {
        this.#init();
        this._editor = editor;
        //TODO: 정리해야할 코드
        this._coordinate = editor.page.coordinate;
        TextUtil.setEditor(editor);
    }

    updateLabel(label) {
        this._label = label;
        this._input.value = label.text;
        this._input.style.fontSize = label.fontSize + 'px';
        this._input.fontFamily = 'sans-serif';
        this._editor.ctx.font = label.fontSize + 'px sans-serif';
        this.#resizeInput();
    }

    #init() {
        const input = document.getElementById('text-editor');
        const curText = document.getElementById('cur-text');
        if (input) {
            this._input = input;
            this._curText =
            return;
        }

        this._input = document.createElement('input');
        this._input.id = 'text-editor';
        this._input.className = 'absolute pl-1 bg-transparent focus:border-transparent';

        this._curText = document.createElement('span');
        // this._curText
        document.body.appendChild(this._input);
    }

    #resizeInput() {
        let width = this.getSize(this._coordinate.dpr).width + TextUtil.getWhiteSpace();
        let right = this._input.getBoundingClientRect().x + width;
        const gap = right - this._editor.xPosition.max;
        if (gap > 0) {
            width -= gap;
        }

        this._input.style.width = width + 'px';
    }

    getSize(dpr) {
        let fontSize = this._label.fontSize;
        if (dpr) {
            fontSize *= dpr;
        }

        return TextUtil.calculatorFontWidthHeight(this._input.value, fontSize, getComputedStyle(this._input).fontFamily);
    }

    show(p) {
        const input = this._input;

        const editor = this._editor;
        const minX = Math.max(editor.xPosition.min, p.x);

        input.style.top = (p.y + window.scrollY) + 'px';
        input.style.left = (minX + window.scrollX) + 'px';
        input.style.fontSize = (this._label.fontSize * this._coordinate.dpr) + 'px';
        // input.style.backgroundColor = this._label.fillColor;
        input.classList.remove('hidden');
        this._editor.enabledShortcut = false;
        this.update();
        this.focus();
    }

    focus() {
        this._input.focus();
    }

    hide() {
        this._editor.enabledShortcut = true;
        this._input.classList.add('hidden');
    }

    update() {
        this.#resizeInput();
    }

    get val() {
        return this._input.value;
    }

    get width() {
        return this._width;
    }

    set width(value) {
        this._input.width = value;
        this._width = value;
    }

    get height() {
        return this._height;
    }

    set height(value) {
        this._input.height = value;
        this._height = value;
    }
}