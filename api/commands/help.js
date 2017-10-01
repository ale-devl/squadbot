/**
 * Created by aletuna on 11/08/17.
 */

const cmd_dispatcher = require("./command_dispatcher.js");
const cfg = require("../../config.js");
const pkg = require("../../package.json");

/**
 * EXPORTS
 */

exports.execute = function (args) {
    if (args.arguments.length === 0) {
        postGuide(args.msg.channel);
        return;
    }
    console.log(args);
    let desc = cmd_dispatcher.getDescription(args.arguments[0]);
    if (!desc) {
        args.msg.channel.send("No help available for: " + args.arguments[0]);
        return;
    }
    // Command list
    let sText = "Displaying help for      __**" + desc.name + "**__\n" +
        "```" +
        "Description:                  " + desc.desc + "\n" +
        "```";

    if (desc.args.length > 0) {
        sText += "\nArguments: \n";
        sText += "```";
        for (let i = 0; i < desc.args.length; ++i) {
            sText += "            Argument " + (i + 1) + ":\n";
            sText += "Name                       " + desc.args[i].name + "\n" +
                "Description                " + desc.args[i].desc + "\n" +
                "Type                       " + desc.args[i].type + "\n" +
                "Required                   " + desc.args[i].required;
        }
        sText += "```\n\n";
    }
    sText += "Example usage: \n";
    sText += "```";
    sText += desc.example;
    sText += "```";

    args.msg.channel.send(sText);
};

exports.isUsingArguments = function () {
    return false;
};

exports.getDescription = function () {
    return {
        name: "help",
        desc: "Displays help for a command if an argument is passed or this guide if not.",
        args: [{
            name: 'None. Just pass after command name',
            desc: 'Command to get help for.',
            type: 'string',
            required: false
        }],
        example: "-sb help foo"
    };
};



/**
 * GUIDE
 */

function postGuide(channel) {
    let aCommands = cmd_dispatcher.getCommands();
    let sGuide = pkg.name + " " + pkg.version + "\n";
    sGuide += pkg.description + "\n\n";
    sGuide += "Usage: " + cfg.prefix + " (command)\n\n";
    sGuide += "Here's a list of commands:\n\n";
    sGuide += "```";
    for (let i = 0; i < aCommands.length; ++i) {
        let textToAdd = aCommands[i].name;
        textToAdd = textToAdd.padEnd(27);
        textToAdd += aCommands[i].desc;
        textToAdd += "\n";
        sGuide += textToAdd;
    }
    sGuide += "```";


    channel.send(sGuide);
}