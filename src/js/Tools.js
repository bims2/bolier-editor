import {CreateLine} from "./command/CreateLine.js";
import {CreateRect} from "./command/CreateRect.js";
import {CommandManager} from "./command/CommandManager.js";
import {DefaultCommand} from "./command/DefaultCommand.js";
import {CreateTriangle} from "./command/CreateTriangle.js";
import {CreateCircle} from "./command/CreateCircle.js";
import {CreateImage} from "./command/CreateImage.js";
import {Line} from "./editor/control/Line.js";
import {Rect} from "./editor/control/Rect.js";
import {Triangle} from "./editor/control/Triangle.js";
import {Circle} from "./editor/control/Circle.js";
import {Label} from "./editor/control/Label.js";
import {CreateLabel} from "./command/CreateLabel.js";
import {EditLabel} from "./command/EditLabel.js";
import {Action} from "./command/undo/Action.js";
import {ToolbarUtil} from "./editor/ToolbarUtil.js";
import {ControlCreator} from "./editor/control/ControlCreator.js";

export class Tools {
    constructor(editor) {
        this.editor = editor;
        this.commandManager = new CommandManager();
        const historyManager = editor.historyManager;
        this.createLine = (p) => {
            editor.page.newControl = this.#initControl(p, new Line());
            this.commandManager.execute(new CreateLine(editor));
            editor.render();
        };

        this.createRect = (p) => {
            editor.page.newControl = this.#initControl(p, new Rect());
            this.commandManager.execute(new CreateRect(editor));
            editor.render();
        };

        this.createTriangle = (p) => {
            editor.page.newControl = this.#initControl(p, new Triangle());
            this.commandManager.execute(new CreateTriangle(editor));
            editor.render();
        };

        this.createCircle = (p) => {
            editor.page.newControl = this.#initControl(p, new Circle());
            this.commandManager.execute(new CreateCircle(editor));
            editor.render();
        };

        this.createImage = () => {
            this.#imageOpen((img)=> {
                this.commandManager.execute(new CreateImage(this.editor, img));
            });
        }

        this.createLabel = (p)=> {
            editor.page.newControl = this.#initControl(p, new Label());
            this.commandManager.execute(new CreateLabel(this.editor));
            editor.render();
        }

        this.editeLabel = ()=> {
            this.commandManager.execute(new EditLabel(this.editor));
            this.editor.page.selectRender = null;
            this.editor.page.hoverRender = null;
            editor.render();
        }

        this.removeControl = ()=> {
            const control = editor.page?.selectRender?.control;
            if (!control) {
                return;
            }

            const idx = editor.page.controls.indexOf(control);

            ToolbarUtil.getInstance().clear();
            historyManager.startUndo(new Action(`undo remove ${control.type} control`,
                ()=> editor.page.addControl(control, idx)));
            editor.page.removeControl(control);
            historyManager.endUndo(new Action(`redo remove ${control.type} control`,
                ()=> editor.page.removeControl(control)));
        }

        this.copyControl = ()=> {
            const page = editor.page;
            page.copyControl = editor.page?.selectRender?.control;
        }

        this.pasteControl = ()=> {
            const control = editor.page?.copyControl;
            if (!control) {
                return;
            }

            const copyControl = ControlCreator.Create(control.type);
            copyControl.clone(control);
            copyControl.move({x:30, y:20});
            copyControl.updateSelectPosition();
            historyManager.startUndo(new Action(`undo paste ${control.type} control`,
                ()=> editor.page.removeControl(copyControl)));
            editor.page.addControl(copyControl);
            historyManager.endUndo(new Action(`redo paste ${control.type} control`,
                ()=> editor.page.addControl(copyControl)));
            editor.page.copyControl = copyControl;
        }

        this.frontControl = ()=> {
            const control = editor.page?.selectRender?.control;
            if (!control) {
                return;
            }

            const controls = editor.page.controls;
            let idx = this.#findIndex(control);
            if (idx === -1 || idx === controls.length-1) {
                return;
            }

            const change = ()=> {
                this.#changeControlIdx(idx, idx+1);
                editor.render();
            }

            historyManager.startUndo(new Action(`undo front ${control.type} control`,
                ()=> change()));
            change();
            historyManager.endUndo(new Action(`redo front ${control.type} control`,
                ()=> change()));
        }

        this.veryFrontControl = ()=> {
            const control = editor.page?.selectRender?.control;
            if (!control) {
                return;
            }

            const controls = editor.page.controls;
            let idx = this.#findIndex(control);
            if (idx === -1 || idx === controls.length-1) {
                return;
            }

            const undo = ()=> {
                const [control] = controls.splice(controls.length-1, 1);
                controls.splice(idx, 0, control);
            }

            const redo = ()=> {
                const [control] = controls.splice(idx, 1);
                editor.page.addControl(control);
                editor.render();
            }

            historyManager.startUndo(new Action(`undo very front ${control.type} control`,
                ()=> undo()));
            redo();
            historyManager.endUndo(new Action(`redo very front ${control.type} control`,
                ()=> redo()));
        }

        this.backControl = ()=> {
            const control = editor.page?.selectRender?.control;
            if (!control) {
                return;
            }

            let idx = this.#findIndex(control);
            if (idx <= 0) {
                return;
            }

            const change = ()=> {
                this.#changeControlIdx(idx-1, idx);
                editor.render();
            }

            historyManager.startUndo(new Action(`undo back ${control.type} control`,
                ()=> change()));
            change();
            historyManager.endUndo(new Action(`redo back ${control.type} control`,
                ()=> change()));
        }

        this.veryBackControl = ()=> {
            const control = editor.page?.selectRender?.control;
            if (!control) {
                return;
            }

            let idx = this.#findIndex(control);
            if (idx <= 0) {
                return;
            }

            const controls = editor.page.controls;
            const undo = ()=> {
                const [control] = controls.splice(0, 1);
                controls.splice(idx, 0, control);
                editor.render();
            }

            const redo = ()=> {
                const [control] = controls.splice(idx, 1);
                controls.splice(0, 0, control);
                editor.render();
            }

            historyManager.startUndo(new Action(`undo very back ${control.type} control`,
                ()=> undo()));
            redo();
            historyManager.endUndo(new Action(`redo very back ${control.type} control`,
                ()=> redo()));
        }

        this.capture = ()=> {
            this.editor.capture();
        }

        this.undo = () => {
            historyManager.undo();
        }

        this.redo = () => {
            historyManager.redo();
        }

        this.toggleViewControlOrder = ()=> {
            editor.page.viewControlOrder = !editor.page.viewControlOrder;
            editor.render();
        }

        this.toggleViewOutLine = ()=> {
            editor.page.viewOutLine = !editor.page.viewOutLine;
            editor.render();
        }

        this.clear = () => {
            editor.removeForegroundRender();
            this.commandManager.execute(new DefaultCommand(editor));
            editor.render();
        };

        this.commandManager.execute(new DefaultCommand(editor));
    }

    #changeControlIdx(i, j) {
        const controls = this.editor.page.controls;
        [controls[i], controls[j]] = [controls[j], controls[i]];
    }

    #findIndex(control) {
        const controls = this.editor.page.controls;
        let idx = -1;
        controls.some((control_, idx_) => {
            if (control_ === control) {
                idx = idx_;
                return true;
            }
        });
        return idx;
    }

    #initControl(p, control) {
        if (p !== undefined) {
            control.setPosition(p);
        }
        return control;
    }

    #imageOpen(execute) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.style.display = 'none';

        input.addEventListener('change', (e) => {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = new Image;
                img.onload = function() {
                    execute(img);
                }
                img.src = e.target.result;
            }
            reader.readAsDataURL(e.target.files[0]);
        });

        input.click();
    }
}
