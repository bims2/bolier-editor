import {EventHandler} from "./EventHandler.js";

export class ShortCutKeyEventHandler extends EventHandler {
    constructor() {
        super();
    }

    onKeyDown(e) {
        if (!e.editor._enabledShortcut) {
            return;
        }

        const tools = e.editor.tools;
        const key = e.originEvent.key;
        if (!this.#metaKeyShortcut(e)) {
            return;
        }

        switch (key) {
            case 'q':
                tools.createLine(e.point);
                break;
            case 'w':
                tools.createRect(e.point);
                break;
            case 'e':
                tools.createTriangle(e.point);
                break;
            case 'r':
                tools.createCircle(e.point);
                break;
            case 't':
                tools.createImage();
                break;
            case 'a':
                tools.createLabel(e.point);
                break;
            case 'Escape':
                tools.clear();
                break;
            case 'z':
                tools.undo();
                break;
            case 'y':
                tools.redo();
                break;
            case 'Backspace':
                tools.removeControl();
                break;
            case '[':
                tools.frontControl();
                break;
            case ']':
                tools.backControl();
                break;
            default:
                console.log(e.originEvent.key);
                break;
        }
    }

    #metaKeyShortcut(e) {
        const tools = e.editor.tools;
        if (!(e.originEvent.metaKey || e.originEvent.ctrlKey)) {
            return true;
        }

        const key = e.originEvent.key;
        switch (key) {
            case 'c':
                tools.copyControl();
                break;
            case 'v':
                tools.pasteControl();
                break;
            case 's':
                e.originEvent.preventDefault();
                tools.capture();
                break;
            case '[':
                tools.veryFrontControl();
                break;
            case ']':
                tools.veryBackControl();
                break;
            case '5':
                e.editor.page.viewControlOrder = !e.editor.page.viewControlOrder;
                e.editor.render();
                break;
            default:
                return true;
        }

        return false;
    }

    onKeyUp(e) {
    }
}