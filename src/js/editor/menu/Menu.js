import {ShortCurKeyType} from "../ShortCutKeyManager.js";

export class Menu {
    constructor(editor) {
        this._editor = editor;
        this.#init();
    }

    #init() {
        const root = document.getElementById('menu-root');
        if (root) {
            this._root = root;
            return;
        }

        this._root = document.createElement('div');
        this._root.id = 'menu-root';
        this._root.className = 'hidden opacity-0 absolute';
        const menu = document.createElement('div');
        menu.id = 'menu';
        menu.className = 'overflow-hidden rounded-xl border p-1.5 bg-slate-50 w-40 drop-shadow-md';

        const editor = this._editor;
        const shortCutKeyManager = editor.shortCutKeyManager;
        menu.appendChild(this.#createMenuItem('실행취소',
            shortCutKeyManager.getKeyString(ShortCurKeyType.UNDO),
            (e)=> {
                editor.tools.undo();
            }));
        menu.appendChild(this.#createMenuItem('되돌리기',
            shortCutKeyManager.getKeyString(ShortCurKeyType.REDO),
            (e)=> {
                editor.tools.redo();
            }));
        menu.appendChild(this.#createSeparate());
        menu.appendChild(this.#createMenuItem('복사',
            shortCutKeyManager.getKeyString(ShortCurKeyType.COPY),
            (e)=> {
                editor.tools.copyControl();
            }));
        menu.appendChild(this.#createMenuItem('붙여넣기',
            shortCutKeyManager.getKeyString(ShortCurKeyType.PASTE),
            (e)=> {
                editor.tools.pasteControl();
            }));
        menu.appendChild(this.#createSeparate());
        menu.appendChild(this.#createMenuItem('맨 앞으로',
            shortCutKeyManager.getKeyString(ShortCurKeyType.VERY_FRONT_CONTROL),
            (e)=> {
                editor.tools.veryFrontControl();
            }));
        menu.appendChild(this.#createMenuItem('앞으로',
            shortCutKeyManager.getKeyString(ShortCurKeyType.FRONT_CONTROL),
            (e)=> {
                editor.tools.frontControl();
            }));
        menu.appendChild(this.#createMenuItem('뒤로',
            shortCutKeyManager.getKeyString(ShortCurKeyType.BACK_CONTROL),
            (e)=> {
                editor.tools.backControl();
            }));
        menu.appendChild(this.#createMenuItem('맨 뒤로',
            shortCutKeyManager.getKeyString(ShortCurKeyType.VERY_BACK_CONTROL),
            (e)=> {
                editor.tools.veryBackControl();
            }));
        this._root.appendChild(menu);
        document.body.appendChild(this._root);

        this._root.addEventListener('contextmenu', (e)=> {
            e.preventDefault();
        });
    }

    #createMenuItem(name, shortCutKey, onClick) {
        const item = document.createElement('div');
        item.id = 'undo_item';
        item.className = 'relative flex cursor-default select-none items-center rounded-md px-2 py-1.5 text-xs ' +
            'outline-none hover:bg-slate-200';

        const itemName = document.createElement('span');
        itemName.textContent = name;
        itemName.className = 'text-slate-700 subpixel-antialiased items-center';

        const shortCut = document.createElement('span');
        shortCut.className = 'ml-auto text-xs tracking-wide opacity-50 text-slate-700 subpixel-antialiased';
        shortCut.textContent = shortCutKey;

        item.appendChild(itemName);
        item.appendChild(shortCut);
        item.addEventListener('mouseup', (e)=> {
            console.log('mouseup');
            onClick(e);
            this.hide();
        });
        return item;
    }

    #createSeparate() {
        const separate = document.createElement('div');
        separate.className = '-mx-1.5 my-1.5 h-px bg-slate-200';
        return separate;
    }

    show(p) {
        // this._root.classList.remove('duration-300');

        const editor = this._editor;
        const minPosition = editor.minPosition;
        const minX = Math.max(minPosition.x, p.x);
        const minY = Math.max(minPosition.y, p.y);

        const root = this._root;
        root.style.top = (minY + window.scrollY) + 'px';
        root.style.left = (minX + window.scrollX) + 'px';

        this._root.classList.remove('hidden');
        // this._root.classList.add('duration-300');
        this._root.classList.add('opacity-100');
        this._root.classList.remove('opacity-0');
    }

    hide() {
        // this._root.classList.add('duration-300');
        this._root.classList.remove('opacity-100');
        this._root.classList.add('opacity-0');
        this._root.classList.add('hidden');
    }
}