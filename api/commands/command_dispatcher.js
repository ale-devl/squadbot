const oCommands = {
    help: require("./help"),
    ping: require("./ping"),
    promote: require("./promote"),
    degrade: require("./degrade"),
    eval: require("./eval"),
    rename: require("./rename"),
    fixname: require("./fixName")
};

exports.execute = function (cmd) {
    if (oCommands[cmd.name.toLowerCase()]) {
        oCommands[cmd.name.toLowerCase()].execute(cmd);
    } else {
        throw {
            name: "unkCmd",
            message: "Unknown command used",
            extra: "In method: dispatcher.execute",
            code: "0002"
        };
    }
};

exports.checkCmd = function (sCmd) {
    if (!oCommands[sCmd.toLowerCase()]) {
        throw {
            name: "unkCmd",
            message: "Unknown command used",
            extra: "In method: checkCmd",
            code: "0001"
        };
    }

    return oCommands[sCmd].isUsingArguments();
};

exports.handleUnknownCommand = function () {
    let unkCmd = require("./unknown_command.js");
    unkCmd.execute();
};

exports.getDescription = function (cmd) {
    try {
        return oCommands[cmd].getDescription();
    }
    catch (e) {
        if (e.code === "0002") {
            return false;
        }
    }
};

exports.getCommands = function () {
    let aCommandsWithDesc = [];

    for (let sKey in oCommands) {
        aCommandsWithDesc.push({ name: sKey, desc: this.getDescription(sKey).desc });
    }

    return aCommandsWithDesc;
};