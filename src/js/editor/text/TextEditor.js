export class TextEditor {
    constructor(editor) {
        this.#init();
        this._editor = editor;
        //TODO: 정리해야할 코드
        this._coordinate = editor.page.coordinate;
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
        if (input) {
            this._input = input;
            return;
        }

        this._input = document.createElement('input');
        this._input.id = 'text-editor';
        this._input.className = 'absolute pl-1 bg-transparent focus:border-transparent';
        document.body.appendChild(this._input);
    }

    #resizeInput() {
        let width = this.#getSize(this._coordinate.dpr).width + (this._coordinate.dpr * 16);
        let right = this._input.getBoundingClientRect().x + width;
        const gap = right - this._editor.xPosition.max;
        if (gap > 0) {
            width -= gap;
        }

        this._input.style.width = width + 'px';
    }

    getInputSize() {
        return this.#getSize();
    }

    #getSize(dpr) {
        let fontSize = this._label.fontSize;
        if (dpr) {
            fontSize *= dpr;
        }

        const span = document.createElement('span');
        span.style.visibility = 'hidden';
        span.style.whiteSpace = 'pre';
        span.style.fontSize = fontSize + 'px';
        span.style.fontFamily = getComputedStyle(this._input).fontFamily;
        span.textContent = this._input.value || this._input.placeholder;

        // const ctx = this._editor.ctx;
        // ctx.fontSize = this._label.fontSize + 'px';
        // ctx.fontFamily = getComputedStyle(this._input).fontFamily;
        // const width_ = ctx.measureText(this._input.value).width + 4;

        document.body.appendChild(span);
        let width = span.offsetWidth;
        const height = span.offsetHeight;
        document.body.removeChild(span);
        return {width: width, height: height};
    }

    show(p) {
        const input = this._input;

        const editor = this._editor;
        const minX = Math.max(editor.xPosition.min, p.x);

        input.style.top = (p.y + window.scrollY) + 'px';
        input.style.left = (minX + window.scrollX) + 'px';
        input.style.fontSize = (this._label.fontSize * this._coordinate.dpr) + 'px';
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
        // const text = this._input.value;
        // const width = this._editor.ctx.measureText(text).width;
        // this._input.style.width = width + 'px';
        // console.log('input width', width);
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