export class Action {
    constructor(name, runner) {
        this.name = name;
        this.runner = runner;
    }

    run() {
        console.log(this.name);
        this.runner();
    }
}