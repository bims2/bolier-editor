export class TextUtil {
    static _editor;

    static setEditor(editor) {
        if (!this._editor) {
            this._editor = editor;
        }
    }
    static calculatorFontSize(text, maxWidth, initialFontSize) {
        const ctx = this._editor.ctx;
        ctx.save();
        ctx.font = `${initialFontSize} Arial`;
        const textWidth = ctx.measureText(text).width ?? 0.1;
        const scalingFactor = maxWidth / textWidth ?? 0;
        ctx.restore();
        return initialFontSize * scalingFactor;
    }

    static calculatorFontWidthHeight(text, fontSize, fontFamily) {
        const ctx = this._editor.ctx;
        ctx.save();
        ctx.fontSize = `${fontSize} Arial`;
        ctx.restore();

        const span = document.createElement('span');
        span.style.visibility = 'hidden';
        span.style.whiteSpace = 'pre';
        span.style.fontSize = fontSize + 'px';
        // span.style.fontFamily = fontFamily;
        span.textContent = text;

        document.body.appendChild(span);
        const width = span.offsetWidth;
        const height = span.offsetHeight;
        document.body.removeChild(span);

        return {width: width, height: height};
    }

    static getWhiteSpace() {
        return this._editor.page.coordinate.dpr * 16;
    }
}