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

            ToolbarUtil.getInstance().clear();
            historyManager.startUndo(new Action(`undo remove ${control.type} control`,
                ()=> editor.page.addControl(control)));
            editor.page.removeControl(control);
            historyManager.endUndo(new Action(`redo remove ${control.type} control`,
                ()=> editor.page.removeControl(control)));
        }

        this.copyControl = ()=> {
            const page = editor.page;
            page.copyControl = editor.page?.selectRender?.control;
            console.log('copy Control');
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

        this.capture = ()=> {
            this.editor.capture();
        }

        this.undo = () => {
            historyManager.undo();
        }

        this.redo = () => {
            historyManager.redo();
        }

        this.clear = () => {
            editor.removeForegroundRender();
            this.commandManager.execute(new DefaultCommand(editor));
            editor.render();
        };

        this.commandManager.execute(new DefaultCommand(editor));
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
