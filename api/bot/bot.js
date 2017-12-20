const mysqlHandler = require("../util/mysql_handler");
const fs = require("fs");
const cfg = require("../../config");
const pkg = require("../../package.json");
const discord = require("discord.js");
const bot = new discord.Client();
const healthChecker = require("../util/health_checker");

let missingPermissions;
let userstorage;
let rolestorage;
let parser;
let dispatcher;

process.on('uncaughtException', err => {
    console.log("Uncaught Exception: " + err);
    console.log('Logging out of Discord and then quitting process...');

    bot.fetchUser("166154532714184704").then(owner => {
        console.log("err: " + err);
        owner.send("Uncaught Exception: " + err).then(() => {
            bot.destroy()
                .then(() => {
                    process.exit(1);
                });
        });
    })
        .catch(error => {
            console.log(error);
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

exports.lockBot = function (channel) {
    missingPermissions = true;
    channel.send("There were missing permissions. Bot is on **lockdown** until the problems are solved. Use '> checkpermission' to trigger a recheck.");
};

exports.reportToOwner = function (message) {
    bot.fetchUser("166154532714184704").then(owner => {
        owner.send(message);
    });
};

bot.on("message", msg => {
    if (msg.author.id === bot.user.id)
        return;

    if (missingPermissions) {
        if (msg.content === "> checkpermission") {
            checkPermissions(msg.channel, true);
        }
        else if (msg.content[0] === cfg.prefix) {
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

        healthChecker.registerHealthChecks(30 /*minutes*/ * 60 * 1000);

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
    mysqlHandler.getConnection().then(connection => {
        connection.query("SELECT * FROM adminRoles", (err, rows) => {
            if (rows) {
                for (let i = 0; i < rows.length; ++i) {
                    cfg.settings.adminRoles.push(rows[i].id);
                }
            }
        });
        connection.query("SELECT * FROM permissions", (err, rows) => {
            if (rows) {
                for (let i = 0; i < rows.length; ++i) {
                    cfg.settings.requiredPermissions.push(rows[i].name);
                }
            }
        });
        connection.one("SELECT * FROM settings", (err, row) => {
            if (row) {
                Object.keys(row).forEach(key => {
                    cfg.settings[key] = row[key];
                });
            }
        });
    });
}

// TODO: Remove this. We have a health check now that needs to do exactly the same as this function. Adapt it, then remove this please!
function checkPermissions(channel, isRecheck = false, silentMode = false) {
    console.log("Checking permission..");
    let guild = bot.guilds.find("id", cfg.settings.guildId);
    channel = channel || guild.channels.find("id", cfg.settings.botCmdId);
    missingPermissions = false;

    cfg.settings.requiredPermissions.forEach(permission => {
        if (!guild.me.hasPermission(permission)) {
            channel.send("Permission check: Missing permission '" + permission + "'!");
            missingPermissions = true;
        }
    });

    rolestorage.getRoleByHighestRank()
        .then(role => {
            if (guild.roles.find("id", role.id).position > guild.me.highestRole.position) {
                if (!silentMode)
                    channel.send("Permission check: Not high enough in the hierarchy!");
                missingPermissions = true;
            }

            if (isRecheck) {
                if (!missingPermissions)
                    if (!silentMode)
                        channel.send("All required permissions present. Bot unlocked!");
                    else
                        if (!silentMode)
                            channel.send("Still got missing permissions. Check previous messages! Bot remains locked.");
            } else {
                if (missingPermissions)
                    if (!silentMode)
                        channel.send("There were missing permissions. Bot is on **lockdown** until the problems are solved. Use '> checkpermission' to trigger a recheck.");
            }

            console.log("Checking permissions done.");
        });
}