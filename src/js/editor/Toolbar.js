import {ToolbarPosition, ToolbarUtil} from "./ToolbarUtil.js";
import {LineColorAction} from "../command/undo/LineColorAction.js";
import {FillColorAction} from "../command/undo/FillColorAction.js";
import {LineStyle} from "./control/LineStyle.js";
import {LineStyleAction} from "../command/undo/LineStyleAction.js";
import {LineWidthAction} from "../command/undo/LineWidthAction.js";

const COMMON_TOOLBAR_STYLE =
    'hidden pointer-events-auto flex items-center rounded-md border border-slate-300 ' +
    'shadow-sm bg-background bg-slate-100 text-foreground absolute gap-0.5 p-1'
export class Toolbar {
    constructor(editor) {
        this._editor = editor;
        this._tools = editor.tools;
        this._toolbarWrap = document.createElement('div');
        this._toolbarWrap.className = 'flex w-52 m-2';
    }

    get toolbarWrap() {
        return this._toolbarWrap;
    }

    createToolbar(root) {
        const toolbar = document.createElement('div');
        toolbar.id = 'toolbar';
        toolbar.className =
            'pointer-events-auto flex items-center rounded-md border border-slate-200 ' +
            'shadow-sm bg-background text-foreground relative gap-0.5 p-0.5 p-1 pl-3 pr-1';
        const lineBtn = this.#createButton('./src/icon/line.png', 'Q', () => {
            this._tools.createLine();
        });
        const rectBtn = this.#createButton('./src/icon/rect.png', 'W', () => {
            this._tools.createRect();
        });
        const triangleBtn = this.#createButton('./src/icon/triangle.png', 'E', () => {
            this._tools.createTriangle();
        });
        const circleBtn = this.#createButton('./src/icon/circle.png', 'R', () => {
            this._tools.createCircle();
        });
        const imageBtn = this.#createButton('./src/icon/image.png', 'T', () => {
            this._tools.createImage();
        });
        const labelBtn = this.#createButton('./src/icon/label.png', 'A', ()=> {
           this._tools.createLabel();
        });
        toolbar.appendChild(lineBtn);
        toolbar.appendChild(rectBtn);
        toolbar.appendChild(triangleBtn);
        toolbar.appendChild(circleBtn);
        toolbar.appendChild(imageBtn);
        toolbar.appendChild(labelBtn);

        const separator = document.createElement('div');
        separator.className = 'shrink-0 bg-border h-full w-[1px] mr-2 dark:bg-gray-300';
        separator.role = 'none';
        toolbar.appendChild(separator);

        const undoBtn = this.#createButton('./src/icon/undo.png', 'Z', ()=> {
            this._tools.undo();
        });
        const redoBtn = this.#createButton('./src/icon/redo.png', 'Y', ()=> {
            this._tools.redo();
        });
        toolbar.appendChild(undoBtn);
        toolbar.appendChild(redoBtn);

        this._toolbarWrap.appendChild(toolbar);

        root.appendChild(this.#createControlOptionToolbar());
        root.appendChild(this._toolbarWrap);
    }

    #createControlOptionToolbar() {
        const lineToolbar = document.createElement('div');
        lineToolbar.id = 'line-option';
        lineToolbar.className = COMMON_TOOLBAR_STYLE;

        const lineWidthToolbar = this.#createLineWidthToolbar();
        const lineWidthBtn = this.#createButton('./src/icon/line_width.png', '', () => {
            ToolbarUtil.showLineWidthToolbar();
        });

        const lineStyleToolbar = this.#createLineStyleToolbar();
        const lineStyleBtn = this.#createButton('./src/icon/line_style.png', '', () => {
            ToolbarUtil.showLineStyleToolbar();
        });

        const lineColorToolbar = this.#createColorToolbar('line-color',
            {x: ToolbarPosition.LINE_COLOR_LEFT, y: ToolbarPosition.TOOLBAR_TOP},
            color => {
                const control = this._editor.page.selectControl.control;
                this._editor.historyManager.startUndo(new LineColorAction('undo line color', control));
                control.lineColor = color;
                this._editor.historyManager.endUndo(new LineColorAction('redo line color', control));
            }
        );
        lineColorToolbar.classList.add('bg-slate-200');
        const lineColorBtn = this.#createButton('./src/icon/line_color.png', '', () => {
            ToolbarUtil.showLineColorToolbar();
        });

        const fillColorToolbar = this.#createColorToolbar('fill-color',
            {x: ToolbarPosition.LINE_COLOR_LEFT, y: ToolbarPosition.TOOLBAR_TOP},
            color => {
                const control = this._editor.page.selectControl.control;
                this._editor.historyManager.startUndo(new FillColorAction('undo fill color', control));
                this._editor.page.selectControl.control.fillColor = color;
                this._editor.historyManager.endUndo(new FillColorAction('redo fill color', control));
            }
        );
        fillColorToolbar.classList.add('bg-slate-300');
        const fillColorBtn = this.#createButton('./src/icon/fill_color.png', '', () => {
            ToolbarUtil.showFillColorToolbar();
        });
        fillColorBtn.id = 'fill-color-btn';

        lineToolbar.appendChild(lineWidthBtn);
        lineToolbar.appendChild(lineStyleBtn);
        lineToolbar.appendChild(lineColorBtn);
        lineToolbar.appendChild(fillColorBtn);

        lineToolbar.appendChild(lineWidthToolbar);
        lineToolbar.appendChild(lineStyleToolbar);
        lineToolbar.appendChild(lineColorToolbar);
        lineToolbar.appendChild(fillColorToolbar);
        return lineToolbar;
    }

    #createColorToolbar(id, p, setColor) {
        const lineColorToolbar = document.createElement('div');
        lineColorToolbar.id = id;
        lineColorToolbar.style.left = p.x + 'px';
        lineColorToolbar.style.top = p.y + 'px';
        lineColorToolbar.className = COMMON_TOOLBAR_STYLE;

        const colorSet = ['rgb(255,255,255)', 'rgb(0,0,0)','rgb(113,113,113)',
            'rgb(216,61,27)', 'rgb(236,145,38)', 'rgb(233,186,31)',
            'rgb(28,138,79)', 'rgb(14,136,224)', 'rgb(134,57,235)'];
        colorSet.forEach(color => {
            const colorBtn = this.#createCircleButton(color, ()=> {
                setColor(color);
                this._editor.render();
            });
            lineColorToolbar.appendChild(colorBtn);
        });

        return lineColorToolbar;
    }

    #createLineStyleToolbar() {
        const lineStyleToolbar = document.createElement('div');
        lineStyleToolbar.id = 'line-style';
        lineStyleToolbar.style.left = ToolbarPosition.LINE_STYLE_LEFT + 'px';
        lineStyleToolbar.style.top = ToolbarPosition.TOOLBAR_TOP + 'px';
        lineStyleToolbar.className = COMMON_TOOLBAR_STYLE;

        const lineSolid = this.#createButton('./src/icon/line_width_1.png', '', () => {
            const control = this._editor.page.selectControl.control;
            this.#changeLineStyle(control, LineStyle.SOLID);
            this._editor.render();
        });
        lineStyleToolbar.appendChild(lineSolid);

        const lineDash = this.#createButton('./src/icon/line_dash.png', '', () => {
            const control = this._editor.page.selectControl.control;
            this.#changeLineStyle(control, LineStyle.DASH);
            this._editor.render();
        });
        lineStyleToolbar.appendChild(lineDash);

        return lineStyleToolbar;
    }

    #changeLineStyle(control, lineStyle) {
        this._editor.historyManager.startUndo(new LineStyleAction('undo line Style', control));
        control.lineStyle = lineStyle;
        this._editor.historyManager.endUndo(new LineStyleAction('redo line Style', control));
    }

    #createLineWidthToolbar() {
        const lineWidthToolbar = document.createElement('div');
        lineWidthToolbar.id = 'line-width';
        lineWidthToolbar.style.left = ToolbarPosition.LINE_WIDTH_LEFT + 'px';
        lineWidthToolbar.style.top = ToolbarPosition.TOOLBAR_TOP + 'px';
        lineWidthToolbar.className = COMMON_TOOLBAR_STYLE;

        for (let i = 1; i <= 5; ++i) {
            const lineWidthBtn = document.createElement('button');
            lineWidthBtn.className = 'w-8 h-8 ml-1 mr-1 pl-1 pr-1 inline-flex items-center justify-center rounded hover:bg-slate-200';
            lineWidthBtn.addEventListener('click', () => {
                const control = this._editor.page.selectControl.control;
                this._editor.historyManager.startUndo(new LineWidthAction('undo line width', control));
                control.lineWidth = i;
                this._editor.historyManager.endUndo(new LineWidthAction('redo line width', control));
                this._editor.render();
            });
            const lineTag = document.createElement('span');
            lineTag.style.height = '0px';
            lineTag.style.width = '30px';
            lineTag.style.borderWidth = i + 'px';
            lineTag.className = 'border-black';
            lineWidthBtn.appendChild(lineTag);
            lineWidthToolbar.appendChild(lineWidthBtn);
        }

        return lineWidthToolbar;
    }

    #createCircleButton(color, clickEvent) {
        const btnWrap = document.createElement('div');
        btnWrap.className = 'relative flex item-center justify-center mr-1 pt-0.5 pb-0.5 rounded-full hover:bg-slate-300';

        const btn = document.createElement('button');
        btn.className = 'w-6 h-6 mt-1 mb-1 ml-2 mr-2 inline-flex items-center justify-center rounded-full';
        btn.style.backgroundColor = color;
        btn.addEventListener('click', clickEvent);
        btnWrap.appendChild(btn);

        return btnWrap;
    }

    #createButton(imgSrc, shortCutKey, clickEvent) {
        const btnWrap = document.createElement('div');
        btnWrap.className = 'relative flex item-center justify-center mr-1';

        const img = document.createElement('img');
        img.src = imgSrc;
        img.className = 'w-5 h-5';

        const btn = document.createElement('button');
        btn.className = 'w-8 h-8 inline-flex items-center justify-center rounded hover:bg-slate-200';
        btn.addEventListener('click', clickEvent);

        btn.appendChild(img);
        btnWrap.appendChild(btn);

        if (shortCutKey !== '') {
            img.classList.add('mr-2');

            const shortcutTxt = document.createElement('div');
            shortcutTxt.className = 'w-2 h-3 items-center justify-center absolute right-0 bottom-0 text-[8px] opacity-40';
            shortcutTxt.textContent = shortCutKey;
            btnWrap.appendChild(shortcutTxt);
        }

        return btnWrap;
    }
}