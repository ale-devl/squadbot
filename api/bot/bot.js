const mysqlHandler = require("../util/mysql_handler");
const db = mysqlHandler.getConnection();
const fs = require("fs");
const cfg = require("../../config");
const pkg = require("../../package.json");
const discord = require("discord.js");
const bot = new discord.Client();
let userstorage;
let rolestorage;
let parser;
let dispatcher;

exports.init = function () {
    loadConfig();
    parser = require("../util/command_parser");
    dispatcher = require("../commands/command_dispatcher");
    userstorage = require("../util/userstorage");
    rolestorage = require("../util/rolestorage");
};

exports.getBot = function () {
    return bot;
};

exports.getGuildId = function () {
    return cfg.settings.guildId;
}

bot.on("message", msg => parser.parse_and_dispatch(msg));

bot.login(cfg.token)
    .then(() => {
        console.log("Running!");
        console.log(bot.user);

        //setupGuide(); TODO: Implement again
    })
    .catch(error => {
    });

function setupGuide() {
    let aCommands = dispatcher.getCommands();
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


    let channel = bot.guilds.find("id", "167715635646824448").channels.find("id", "312672827285176350");

    channel.fetchMessage("313942220933693441")
        .then(message => message.edit(sGuide));
}

function loadConfig() {
    db.then(connection => {
        connection.query("SELECT * FROM adminRoles", (err, rows) => {
            for (let i = 0; i < rows.length; ++i) {
                cfg.settings.adminRoles.push(rows[i].id);
            }
        });
    });
}
