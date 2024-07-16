import {ToolbarPosition, ToolbarUtil} from "./ToolbarUtil.js";
import {LineColorAction} from "../command/undo/LineColorAction.js";
import {FillColorAction} from "../command/undo/FillColorAction.js";
import {LineStyle} from "./control/LineStyle.js";
import {LineStyleAction} from "../command/undo/LineStyleAction.js";
import {LineWidthAction} from "../command/undo/LineWidthAction.js";
import {FontColorAction} from "../command/undo/FontColorAction.js";
import {TextUtil} from "./text/TextUtil.js";
import {SvgIcon} from "../../icon/SvgIcon.js";

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

    createToolbar(root) {
        const toolbar = document.createElement('div');
        toolbar.id = 'toolbar';
        toolbar.className =
            'pointer-events-auto flex items-center rounded-md border border-slate-200 ' +
            'shadow-sm bg-background text-foreground relative gap-0.5 p-0.5 p-1 pl-3 pr-1';
        const lineBtn = this.#createSvgButton(SvgIcon.makeLineIconConfig(), 'Q', () => {
            this._tools.createLine();
        });
        const rectBtn = this.#createSvgButton(SvgIcon.makeRectIconConfig(), 'W', () => {
            this._tools.createRect();
        });
        const triangleBtn = this.#createSvgButton(SvgIcon.makeTriangleIconConfig(), 'E', () => {
            this._tools.createTriangle();
        });
        const circleBtn = this.#createSvgButton(SvgIcon.makeCircleIconConfig(), 'R', () => {
            this._tools.createCircle();
        });
        const imageBtn = this.#createSvgButton(SvgIcon.makeImageIconConfig(), 'T', () => {
            this._tools.createImage();
        });
        const labelBtn = this.#createSvgButton(SvgIcon.makeLabelIconConfig(), 'A', ()=> {
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

        const undoBtn = this.#createSvgButton(SvgIcon.makeUndoIconConfig(), 'Z', ()=> {
            this._tools.undo();
        });
        const redoBtn = this.#createSvgButton(SvgIcon.makeRedoIconConfig(), 'Y', ()=> {
            this._tools.redo();
        });
        toolbar.appendChild(undoBtn);
        toolbar.appendChild(redoBtn);

        this._toolbarWrap.appendChild(toolbar);

        root.appendChild(this.#createControlOptionToolbar());
        root.appendChild(this.#createFontOptionToolbar());
        root.appendChild(this._toolbarWrap);
    }

    #createFontOptionToolbar() {
        const fontToolbar = document.createElement('div');
        fontToolbar.id = 'font-option';
        fontToolbar.className = COMMON_TOOLBAR_STYLE;
        fontToolbar.classList.add('pl-2');

        const fontSizeWrap = document.createElement('p');
        fontSizeWrap.className = 'w-20 h-8 inline-flex items-center justify-center rounded hover:bg-slate-200';

        const fontSizeImg = document.createElement('img');
        fontSizeImg.src = './src/icon/font_size.png';
        fontSizeImg.className = 'w-4 h-4 mr-2';

        const fontSizeIcon = this.#createSvgIcon(SvgIcon.makeFontSizeIconConfig());
        fontSizeIcon.classList.add('mr-2');

        const fontSize = document.createElement('input');
        fontSize.id = 'font-size';
        fontSize.type = 'number';
        fontSize.className = 'w-10 h-5 text-right';
        fontSize.addEventListener('input', (e)=> {
            let curVal = e.target.value ? parseInt(e.target.value, 10) : 1;

            if (curVal <= 0) {
                curVal = 1;
                fontSize.value = 1;
            }
            const control = this._editor.page.selectControl.control;
            control.fontSize = curVal;
            const size = TextUtil.calculatorFontWidthHeight(control.text, control.fontSize);
            const p1 = control.lt;
            const p2 = control.rb;

            p2.x = p1.x + size.width;
            p2.y = p1.y + size.height;
            control.lb.y = p1.y + size.height;
            control.rt.x = p1.x + size.width;
            control.updatePosition();
            this._editor.render();
        });

        fontSizeWrap.appendChild(fontSizeIcon);
        fontSizeWrap.appendChild(fontSize);

        const fontColorToolbar = this.#createColorToolbar('font-color',
            {x: ToolbarPosition.FONT_COLOR_LEFT, y: ToolbarPosition.TOOLBAR_TOP},
            color => {
                const control = this._editor.page.selectControl.control;
                this._editor.historyManager.startUndo(new FontColorAction('undo font color', control));
                control.fontColor = color;
                this._editor.historyManager.endUndo(new FontColorAction('redo font color', control));
            }
        );

        const fontColorBtn = this.#createSvgButton(SvgIcon.makeFontColorIconConfig(), '', ()=> {
            ToolbarUtil.getInstance().showFontColorToolbar();
        });

        fontToolbar.appendChild(fontSizeWrap);
        fontToolbar.appendChild(fontColorBtn);
        fontToolbar.appendChild(fontColorToolbar);

        return fontToolbar;
    }

    #createControlOptionToolbar() {
        const lineToolbar = document.createElement('div');
        lineToolbar.id = 'line-option';
        lineToolbar.className = COMMON_TOOLBAR_STYLE;

        const lineWidthToolbar = this.#createLineWidthToolbar();
        const lineWidthBtn = this.#createSvgButton(SvgIcon.makeLineWidthIconConfig(), '', () => {
            ToolbarUtil.getInstance().showLineWidthToolbar();
        });

        const lineStyleToolbar = this.#createLineStyleToolbar();
        const lineStyleBtn = this.#createSvgButton(SvgIcon.makeLineStyleIconConfig(), '', () => {
            ToolbarUtil.getInstance().showLineStyleToolbar();
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
        const lineColorBtn = this.#createSvgButton(SvgIcon.makeLineColorIconConfig(), '', () => {
            ToolbarUtil.getInstance().showLineColorToolbar();
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
        const fillColorBtn = this.#createSvgButton(SvgIcon.makeFillColorIconConfig(), '', () => {
            ToolbarUtil.getInstance().showFillColorToolbar();
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
        const colorToolbar = document.createElement('div');
        colorToolbar.id = id;
        colorToolbar.style.left = p.x + 'px';
        colorToolbar.style.top = p.y + 'px';
        colorToolbar.className = COMMON_TOOLBAR_STYLE;

        const colorSet = ['rgb(255,255,255)', 'rgb(0,0,0)','rgb(113,113,113)',
            'rgb(216,61,27)', 'rgb(236,145,38)', 'rgb(233,186,31)',
            'rgb(28,138,79)', 'rgb(14,136,224)', 'rgb(134,57,235)'];
        colorSet.forEach(color => {
            const colorBtn = this.#createCircleButton(color, ()=> {
                setColor(color);
                this._editor.render();
            });
            colorToolbar.appendChild(colorBtn);
        });

        return colorToolbar;
    }

    #createLineStyleToolbar() {
        const lineStyleToolbar = document.createElement('div');
        lineStyleToolbar.id = 'line-style';
        lineStyleToolbar.style.left = ToolbarPosition.LINE_STYLE_LEFT + 'px';
        lineStyleToolbar.style.top = ToolbarPosition.TOOLBAR_TOP + 'px';
        lineStyleToolbar.className = COMMON_TOOLBAR_STYLE;

        const lineSolid = this.#createSvgButton(SvgIcon.makeLineSolidIconConfig(), '', () => {
            const control = this._editor.page.selectControl.control;
            this.#changeLineStyle(control, LineStyle.SOLID);
            this._editor.render();
        });
        lineStyleToolbar.appendChild(lineSolid);

        const lineDash = this.#createSvgButton(SvgIcon.makeLineDashIconConfig(), '', () => {
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

    #createSvgButton(svgConfig, shortCutKey, clickEvent) {
        const btnWrap = document.createElement('div');
        btnWrap.className = 'relative flex item-center justify-center mr-1';

        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = this.#createSvgIcon(svgConfig);

        const btn = document.createElement('button');
        btn.className = 'w-8 h-8 inline-flex items-center justify-center rounded hover:bg-slate-200';
        btn.addEventListener('click', clickEvent);

        btn.appendChild(svg);
        btnWrap.appendChild(btn);

        if (shortCutKey !== '') {
            svg.classList.add('mr-2');

            const shortcutTxt = document.createElement('div');
            shortcutTxt.className = 'w-2 h-3 items-center justify-center absolute right-0 bottom-0 text-[8px] opacity-40';
            shortcutTxt.textContent = shortCutKey;
            btnWrap.appendChild(shortcutTxt);
        }

        return btnWrap;
    }

    #createSvgIcon(svgConfig) {
        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNS, 'svg');
        svg.style = svgConfig.style ?? '';
        svg.setAttribute('xmlns', svgNS);
        svg.setAttribute('width', svgConfig?.width ?? '20');
        svg.setAttribute('height', svgConfig?.height ?? '20');
        svg.setAttribute('viewBox', svgConfig.viewBox);

        const g = document.createElementNS(svgNS, 'g');
        g.setAttribute('transform', svgConfig.transform ?? '');

        svgConfig.paths.forEach(path=> {
            const pathTag = document.createElementNS(svgNS, 'path');
            pathTag.setAttribute('d', path.d);
            pathTag.style = path.style ?? '';
            g.appendChild(pathTag);
        });

        svg.appendChild(g);
        return svg;
    }
}