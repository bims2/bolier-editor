export const ShortCurKeyType = {
    CREATE_LINE: 'create_line',
    CREATE_RECT: 'create_rect',
    CREATE_TRIANGLE: 'create_triangle',
    CREATE_CIRCLE: 'create_circle',
    CREATE_IMAGE: 'create_image',
    CREATE_LABEL: 'create_label',
    UNDO: 'undo',
    REDO: 'redo',
    COPY: 'copy',
    PASTE: 'paste',
    VERY_FRONT_CONTROL: 'very_front_control',
    FRONT_CONTROL: 'front_control',
    BACK_CONTROL: 'back_control',
    VERY_BACK_CONTROL: 'very_back_control'
}
export class ShortCutKeyManager {
    constructor() {
        this._keyMap = new Map();
        this.#init();
    }

    getKeyString(shortCutKeyType) {
        return this._keyMap.get(shortCutKeyType);
    }

    #init() {
        this.#initCommonKeyMap(this._keyMap);
        const isMac = navigator.userAgentData.platform.startsWith('macOS');
        if (isMac) {
            this.#initMacKeyMap(this._keyMap);
        } else {
            this.#initOtherKeyMap(this._keyMap);
        }
    }

    #initCommonKeyMap(keyMap) {
        keyMap.set(ShortCurKeyType.CREATE_LINE, 'Q');
        keyMap.set(ShortCurKeyType.CREATE_RECT, 'W');
        keyMap.set(ShortCurKeyType.CREATE_TRIANGLE, 'E');
        keyMap.set(ShortCurKeyType.CREATE_CIRCLE, 'R');
        keyMap.set(ShortCurKeyType.CREATE_IMAGE, 'T');
        keyMap.set(ShortCurKeyType.CREATE_LABEL, 'A');
        keyMap.set(ShortCurKeyType.FRONT_CONTROL, '[');
        keyMap.set(ShortCurKeyType.BACK_CONTROL, ']');
    }

    #initMacKeyMap(keyMap) {
        keyMap.set(ShortCurKeyType.UNDO, '⌘+Z');
        keyMap.set(ShortCurKeyType.REDO, '⌘+Y');
        keyMap.set(ShortCurKeyType.COPY, '⌘+C');
        keyMap.set(ShortCurKeyType.PASTE, '⌘+V');
        keyMap.set(ShortCurKeyType.VERY_FRONT_CONTROL, '⌘+[');
        keyMap.set(ShortCurKeyType.VERY_BACK_CONTROL, '⌘+]');
    }

    #initOtherKeyMap(keyMap) {
        keyMap.set(ShortCurKeyType.UNDO, 'Alt+Z');
        keyMap.set(ShortCurKeyType.REDO, 'Alt+Y');
        keyMap.set(ShortCurKeyType.COPY, 'Alt+C');
        keyMap.set(ShortCurKeyType.PASTE, 'Alt+V');
        keyMap.set(ShortCurKeyType.VERY_FRONT_CONTROL, 'Alt+[');
        keyMap.set(ShortCurKeyType.VERY_BACK_CONTROL, 'Alt+]');
    }
}