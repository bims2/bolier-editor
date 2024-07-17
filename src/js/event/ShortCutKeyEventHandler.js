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
        if (e.originEvent.metaKey && key === 's') {
            e.originEvent.preventDefault();
            tools.capture();
            return;
        }

        switch (key) {
            case '1':
                e.editor.page.coordinate.wayPoint.x = 0;
                e.editor.page.coordinate.wayPoint.y = 0;
                e.editor.render();
                break;
            case '2':
                e.editor.page.coordinate.orgPoint.x = 0;
                e.editor.page.coordinate.orgPoint.y = 0;
                e.editor.render();
                break;
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
            default:
                console.log(e.originEvent.key);
                break;
        }
    }

    onKeyUp(e) {
    }
}