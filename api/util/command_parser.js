/**
 * Created by aletuna on 08/08/17.
 */
const cfg = require("../../config.js");
const cmd_dispatcher = require("../commands/command_dispatcher");

exports.parse_and_dispatch = function (msg) {
    let aContent = msg.content.split(" "),
        sCommand,
        aArguments = [],
        bUsesArguments,
        oCmdWithArgs = {};

    if (aContent[0] !== cfg.prefix) {
        // No prefix. Nothing to do here.
    } else {
        sCommand = aContent[1];
        // Remove the command from the array
        aContent.splice(0, 2);
        // Check if we're dealing with a valid command and whether it uses arguments or not
        // The rest should just be arguments. We need to assign values if needed though
        try {
            bUsesArguments = cmd_dispatcher.checkCmd(sCommand);
        }
        catch (e) {
            if (e.name === "unkCmd") {
                cmd_dispatcher.handleUnknownCommand();
                return;
            }
        }

        if (bUsesArguments) {
            for (let i = 0, length = aContent.length; i < length; ++i) {

                if (aContent[i].indexOf("--") === 0) {
                    // New argument detected.
                    let oArgument = { name: "", values: [] };
                    oArgument.name = aContent[i];
                    while (aContent[i + 1] && aContent[i + 1].charAt(0) !== "--") {
                        oArgument.values.push(aContent[i + 1]);
                        ++i;
                    }
                    aArguments.push(oArgument);
                }
            }
        } else {
            aArguments = aContent;
        }

        oCmdWithArgs = { name: sCommand, arguments: aArguments, msg: msg };

        cmd_dispatcher.execute(oCmdWithArgs);
    }
};