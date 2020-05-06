class Command {
    constructor(receiver) {
        this.receiver = receiver;
    }
}
class RefreshMenuBarCommand extends Command {
    execute() {
        this.receiver.refresh();
    }
}

class AddSubMenuCommand extends Command {
    execute() {
        this.receiver.add();
    }
}

class DelSubMenuCommand extends Command {
    execute() {
        this.receiver.del();
    }
}
