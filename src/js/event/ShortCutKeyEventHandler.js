import {EventHandler} from "./EventHandler.js";
import {Line} from "../editor/control/Line.js";
import {Rect} from "../editor/control/Rect.js";
import {Triangle} from "../editor/control/Triangle.js";
import {Circle} from "../editor/control/Circle.js";

export class ShortCutKeyEventHandler extends EventHandler {
    constructor() {
        super();
    }

    onKeyDown(e) {
        const tools = e.editor.tools;
        switch (e.originEvent.key) {
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