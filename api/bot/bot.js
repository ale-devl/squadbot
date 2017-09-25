const fs         = require("fs");
const cfg        = require("../../config.js");
const pkg        = require("../../package.json");
const discord    = require("discord.js");
const parser     = require("../util/command_parser.js");
const dispatcher = require("../commands/command_dispatcher.js");
const bot        = new discord.Client();

exports.init = function ()
{

};

exports.getBot = function ()
{
    return bot;
};

bot.on("message", msg => parser.parse_and_dispatch(msg));

bot.login(cfg.token).then(
    () =>
    {
        console.log("Running!");
        console.log(bot.user);
        setupGuide();
    }
);

function setupGuide()
{
    let aCommands = dispatcher.getCommands();
    let sGuide    = pkg.name + " " + pkg.version + "\n";
    sGuide += pkg.description + "\n\n";
    sGuide += "Usage: " + cfg.prefix + " (command)\n\n";
    sGuide += "Here's a list of commands:\n\n";
    sGuide += "```";
    for (let i = 0; i < aCommands.length; ++i)
    {
        let textToAdd = aCommands[i].name;
        textToAdd     = textToAdd.padEnd(27);
        textToAdd += aCommands[i].desc;
        textToAdd += "\n";
        sGuide += textToAdd;
    }
    sGuide += "```";


    let channel = bot.guilds.find("id", "167715635646824448").channels.find("id", "312672827285176350");

    channel.fetchMessage("313942220933693441")
           .then(message => message.edit(sGuide));
}