const closeDoorCommand = {
    execute() {
        console.log('关门');
    }
};
const openPcCommand = {
    execute() {
        console.log('开电脑');
    }
};
const openQQCommand = {
    execute() {
        console.log('登录 QQ');
    }
};

const MacroCommand = function () {
    return {
        commandsList: [],
        add: function (command) {
            this.commandsList.push(command);
        },
        execute: function () {
            this.commandsList.forEach(command => command.execute());
        }
    }
};
const macroCommand = MacroCommand();
macroCommand.add(closeDoorCommand);
macroCommand.add(openPcCommand);
macroCommand.add(openQQCommand);

macroCommand.execute();