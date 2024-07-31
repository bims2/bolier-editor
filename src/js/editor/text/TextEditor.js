import {TextUtil} from "./TextUtil.js";

export class TextEditor {
    constructor(editor) {
        this.#init();
        this._editor = editor;
        //FIXME: 정리해야할 코드
        this._coordinate = editor.page.coordinate;
        TextUtil.setEditor(editor);
    }

    updateLabel(label) {
        this._label = label;
        this._label.isEdit = true;
        this._input.value = label.text;
        // this._input.style.fontSize = label.fontSize + 'px';
        // this._input.fontFamily = 'sans-serif';
        // this._editor.ctx.font = label.fontSize + 'px sans-serif';
        this.#resizeInput();
    }

    #init() {
        const input = document.getElementById('text-editor');
        if (input) {
            this._input = input;
            return;
        }

        this._input = document.createElement('input');
        this._input.id = 'text-editor';
        this._input.className = 'hidden absolute outline-0 pl-1 bg-transparent focus:border-transparent';

        this._input.addEventListener('keydown', (e)=> {
            this.update();
        });

        document.body.appendChild(this._input);
    }

    #resizeInput() {
        const inputRect = this._input.getBoundingClientRect();

        let width = this.getSize(this._coordinate.dpr).width + TextUtil.getWhiteSpace(this._label.fontSize);
        let right = inputRect.x + width;
        const maxPosition = this._editor.maxPosition;
        const xGap = right - maxPosition.x;
        if (xGap > 0) {
            width -= xGap;
        }

        let bottom = inputRect.y + inputRect.height;
        const yGap = bottom - maxPosition.y;
        if (yGap > 0) {
            const top = Number(this._input.style.top.slice(0, -2));
            this._input.style.top = `${top - yGap}px`;
        }

        this._input.style.width = width + 'px';
    }

    getSize(dpr) {
        let fontSize = this._label.fontSize;
        if (dpr) {
            fontSize *= dpr;
        }

        return TextUtil.calculatorFontWidthHeight(this._input.value, fontSize);
    }

    show(p) {
        const input = this._input;

        const editor = this._editor;
        const minPosition = editor.minPosition;
        const minX = Math.max(minPosition.x, p.x);
        const minY = Math.max(minPosition.y, p.y);

        input.style.top = (minY + window.scrollY) + 'px';
        input.style.left = (minX + window.scrollX) + 'px';
        input.style.fontSize = (this._label.fontSize * this._coordinate.dpr) + 'px';
        input.style.backgroundColor = this.#combineBackgroundColor();
        input.style.borderColor = this._label.lineColor;
        input.style.borderStyle = this._label.lineStyle;
        input.style.borderWidth = this._label.lineWidth + 'px';
        input.classList.remove('hidden');
        this._editor.enabledShortcut = false;
        this.update();
        this.focus();
    }

    #combineBackgroundColor() {
        const color = this._label.fillColor;
        const st = this._label.fillColor.indexOf('(');
        const ed = this._label.fillColor.indexOf(')');
        const rgb = color.slice(st, ed);
        return 'rgba' + rgb + ',' + this._label.opacity + ')';
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
        return Math.round(this._input.style.width.slice(0, -2));
    }
}