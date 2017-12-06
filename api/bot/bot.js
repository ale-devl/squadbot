const mysqlHandler = require("../util/mysql_handler");
const db = mysqlHandler.getConnection();
const fs = require("fs");
const cfg = require("../../config");
const pkg = require("../../package.json");
const discord = require("discord.js");
const bot = new discord.Client();

let missingPermissions;
let userstorage;
let rolestorage;
let parser;
let dispatcher;

process.on('uncaughtException', err => {
    console.log("Uncaught Exception: " + err);
    console.log('Logging out of Discord and then quitting process...');
    bot.destroy()
        .then(() => {
            process.exit(1);
        });
});

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

exports.lockBot = function (channel) {
    missingPermissions = true;
    channel.send("There were missing permissions. Bot is on **lockdown** until the problems are solved. Use '> checkpermission' to trigger a recheck.");
}

bot.on("message", msg => {
    if (msg.author.id === bot.user.id)
        return;

    if (missingPermissions) {
        if (msg.content === "> checkpermission") {
            checkPermissions(msg.channel, true);
        }
        else if(msg.content[0] === cfg.prefix) {
            msg.channel.send("Bot locked due to missing permissions. Use '> checkpermission' to retrigger the check and unlock the bot if permissions are fixed");
        }
    }
    else
        parser.parse_and_dispatch(msg);
});

bot.login(cfg.token)
    .then(() => {
        checkPermissions();
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
            if (rows) {
                for (let i = 0; i < rows.length; ++i) {
                    cfg.settings.adminRoles.push(rows[i].id);
                }
            }
        });
    });
}

function checkPermissions(channel, informAboutOutcome = false) {
    console.log("Checking permission..");
    let guild = bot.guilds.find("id", cfg.settings.guildId);
    channel = channel || guild.channels.find("id", cfg.settings.botCmdId);
    missingPermissions = false;

    cfg.permissions.forEach(permission => {
        if (!guild.me.hasPermission(permission)) {
            channel.send("Permission check: Missing permission '" + permission + "'!");
            missingPermissions = true;
        }
    });

    rolestorage.getRoleByHighestRank()
        .then(role => {
            if (guild.roles.find("id", role.id).position > guild.me.highestRole.position) {
                channel.send("Permission check: Not high enough in the hierarchy!");
                missingPermissions = true;
            }

            if (informAboutOutcome) {
                if (!missingPermissions)
                    channel.send("All required permissions present. Bot unlocked!");
                else
                    channel.send("Still got missing permissions. Check previous messages! Bot remains locked.");
            } else {
                if (missingPermissions)
                    channel.send("There were missing permissions. Bot is on **lockdown** until the problems are solved. Use '> checkpermission' to trigger a recheck.");
            }

            console.log("Checking permissions done.");
        });
}