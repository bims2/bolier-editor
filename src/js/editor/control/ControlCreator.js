import {Control, ControlType} from "./Control.js";
import {Line} from "./Line.js";
import {Rect} from "./Rect.js";
import {Triangle} from "./Triangle.js";
import {Circle} from "./Circle.js";
import {Label} from "./Label.js";
import {ImageRect} from "./ImageRect.js";

export class ControlCreator {
    constructor() {
    }

    static Create(type) {
        switch (type) {
            case ControlType.LINE:
                return new Line();
            case ControlType.RECT:
                return new Rect();
            case ControlType.TRIANGLE:
                return new Triangle();
            case ControlType.CIRCLE:
                return new Circle();
            case ControlType.IMAGE:
                return new ImageRect();
            case ControlType.LABEL:
                return new Label();
            default:
                return new Control();
        }
    }
}