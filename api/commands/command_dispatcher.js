/**
 * Created by aletuna on 08/08/17.
 */
// This files purpose is to require all commands so we don't have to create a huge list in other files
const oCommands = {
    help:           require("./help.js"),
    foo:            require("./foo.js"),
    deleteLast:     require("./deleteLastXMessages.js"),
    getLunchMenu:   require("./getLunchMenu.js")
};

exports.execute = function (cmd)
{
    if (oCommands[cmd.name])
    {
        oCommands[cmd.name].execute(cmd);
    } else
    {
        throw {
            name:    "unkCmd",
            message: "Unknown command used",
            extra:   "In method: dispatcher.execute",
            code:    "0002"
        };
    }
};

exports.checkCmd = function (sCmd)
{
    if (!oCommands[sCmd])
    {
        throw {
            name:    "unkCmd",
            message: "Unknown command used",
            extra:   "In method: checkCmd",
            code:    "0001"
        };
    }

    return oCommands[sCmd].isUsingArguments();
};

exports.handleUnknownCommand = function ()
{
    let unkCmd = require("./unknown_command.js");
    unkCmd.execute();
};

exports.getDescription = function (cmd)
{
    try
    {
        return oCommands[cmd].getDescription();
    }
    catch (e)
    {
        if (e.code === "0002")
        {
            return false;
        }
    }
};

exports.getCommands = function ()
{
    let aCommandsWithDesc = [];

    for (let sKey in oCommands)
    {
        aCommandsWithDesc.push({name: sKey, desc: this.getDescription(sKey).desc});
    }

    return aCommandsWithDesc;
};