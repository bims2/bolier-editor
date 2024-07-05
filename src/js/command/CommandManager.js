export class CommandManager {
    constructor() {
        this.command = null;
    }
    execute(command) {
        this.command?.deActive();
        command.active();
        this.command = command;
    }
}