const cfg = require("./config");
// const pkg = require("../../package.json"); // Needed for Guide which is not used atm
const discord = require("discord.js");
const bot = new discord.Client();
const healthChecker = require("../util/health_checker");
const parser = require("../util/command_parser");

let oLockdown = {}; // active: boolean, reason: array of strings

exports.init = function () {
    return new Promise((resolve, reject) => {
        cfg.loadConfig();
        loginBot()
            .then(attachMessageHandler)
            .then(checkHealthAndRegisterRegularCheck)
            .then(resolve)
            .catch(err => {
                throw err;
            });
    });
};

exports.getBot = function () {
    return bot;
};

exports.lockBot = function (channel, reason) {
    let oGuild = bot.guilds.find("id", cfg.settings.guildId);
    if (!channel || !channel.send) {
        channel = oGuild.channels.find("id", cfg.settings.botCmdId);
    }
    oLockdown.active = true;
    if (Array.isArray(reason)) {
        oLockdown.reason = reason;
    }
    else {
        oLockdown.reason = [reason];
    }
    channel.send("Bot is on **lockdown** for the following reasons: " + reason + ". Use '> unlock' to trigger a check and unlock the bot if possible.");
};

exports.unlockBot = function () {
    if (oLockdown.active) {
        oLockdown.active = false;
        oLockdown.reason = [];
        healthChecker.registerHealthChecks(30 /*minutes*/ * 60 * 1000);
    }
};

exports.getLockStatus = function () {
    return oLockdown;
};

exports.reportToOwner = function (message) {
    bot.fetchUser("166154532714184704").then(owner => {
        owner.send(message);
    });
};

function loginBot() {
    return new Promise((resolve, reject) => {
        bot.login(cfg.token)
            .then(() => {
                resolve();
            })
            .catch(err => {
                reject(err)
            });
    });
}

function attachMessageHandler() {
    return new Promise((resolve, reject) => {
        bot.on("message", msg => {
            if (msg.author.id === bot.user.id)
                return;

            if (oLockdown.active) {
                if (msg.content === "> unlock") {
                    healthChecker.singleHealthCheck()
                        .then(() => {
                            msg.channel.send("All fine! Bot unlocked.");
                            this.unlockBot();
                        })
                        .catch(err => {
                            msg.channel.send("Error: " + err + ". Bot remains locked");
                        });
                }
                else if (msg.content[0] === cfg.prefix) {
                    msg.channel.send("Bot locked. Use '> unlock' to retrigger the check and unlock the bot if possible!");
                }
            }
            else
                parser.parse_and_dispatch(msg);
        });

        resolve();
    });
}

function checkHealthAndRegisterRegularCheck() {
    return new Promise((resolve, reject) => {
        {
            healthChecker.singleHealthCheck()
                .then(() => {
                    healthChecker.registerHealthChecks(30 /* minutes */ * 60 * 1000);
                    resolve();
                })
                .catch(err => {
                    this.lockBot(null, err);
                    reject(err);
                });
        }
    });
}