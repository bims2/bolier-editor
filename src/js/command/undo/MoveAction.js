import {Action} from "./Action.js";

export class MoveAction extends Action {
    constructor(name, control) {
        const points = [];
        control.points.forEach((p_, idx)=> {
            points[idx] = p_.copy();
        });

        super(name, () => {
            for (let i = 0; i < control.points.length; ++i) {
                control.points[i].x = points[i].x;
                control.points[i].y = points[i].y;
            }
            control.updatePosition();
        });
    }
}