import {EventHandler} from "./EventHandler.js";
import {EventType} from "./EventType.js";

export class PageZoomEventHandler extends EventHandler {

    get type() {
        return EventType.PAGE_ZOOM;
    }

    onMouseWheel(e) {
        const page = e.editor.page;
        e.originEvent.deltaY < 0 ? page.scaleIn() : page.scaleOut();
        page.render();
    }
}