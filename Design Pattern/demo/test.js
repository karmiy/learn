
const RefreshMenuBarCommand = function(receiver) {
    return {
        execute() {
            receiver.refresh();
        }
    }
}

const AddSubMenuCommand = function(receiver) {
    return {
        execute() {
            receiver.add();
        }
    }
}

const DelSubMenuCommand = function(receiver) {
    return {
        execute() {
            receiver.del();
        }
    }
}
