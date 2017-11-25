const bot = require("../bot/bot.js");
const userstorage = require("../util/userstorage");
const rolestorage = require("../util/rolestorage");
const authChecker = require("../util/auth_checker");

exports.execute = function (args) {
    args.username = args.msg.content.replace(/> degrade /ig, "");
    handleDegrade(args);
};

exports.getDescription = function () {
    return {
        name: "degrade",
        desc: "Degrades someone.",
        args: [{
            name: 'name',
            desc: 'Name of the Member that disappointed you. Partial Name is possible but must be unique.',
            type: 'string',
            required: true
        }],
        example: "> degrade Flufflz"
    };
};

exports.isUsingArguments = function () {
    return false;
};

function handleDegrade(args) {
    let name = args.username;
    let channel = args.msg.channel;
    let callerId = args.msg.member.id;
    let guild = args.msg.guild;

    authChecker.checkAuthorization(callerId)
        .then(() => userstorage.getUserByName(name))
        .then(user => findRelevantRole(user))
        .then(user => modifyUserRole(guildbot, channel, user))
        .catch(error => {
            switch (error.action) {
                case 0:
                    channel.send("More than one Users found for name: " + name + ". Please be more specific! Found members: " + error.members);
                    break;
                case 1:
                    channel.send("No recruit named \"" + name + "\" found.");
                    break;
                case 2:
                    channel.send("User " + name + " has more than one rank role. Please make sure he only has one before promoting him!");
                    break;
                default:
                    console.log(error);
                    break;
            };
        });
}

function modifyUserRole(guild, channel, user) {
    return new Promise((resolve, reject) => {
        let guildMember = guild.members.find(val => val.id === user.id);

        if (!user.rankrole) {
            channel.send("I can't degrade <@" + guildMember.id + "> because he doesn't have any role yet.");
            return { error: "No role assigned yet" };
        } else {
            rolestorage.getRoleByRank(user.rankrole.rank + 1)
                .then(role => {
                    let oldRole = guild.roles.find(val => val.id === user.rankrole.id);
                    let newRank = "";
                    let newNick = "";
                    let oldNick = guildMember.nickname ? guildMember.nickname : guildMember.user.username;

                    if (role) {
                        newRank = role.name;

                        if (oldNick.indexOf(user.rankrole.name) !== -1) {
                            newNick = oldNick.replace(user.rankrole.name, role.name);
                        } else {
                            newNick = role.name + " " + oldNick;
                        }
                    } else {
                        newRank = "nothing";

                        if (oldNick.indexOf(user.rankrole.name) !== -1) {
                            newNick = oldNick.replace(user.rankrole.name + " ", "");
                        } else {
                            newNick = oldNick;
                        }
                    }

                    guildMember.removeRole(oldRole)
                        .then(() => {
                            channel.send("Degraded <@" + guildMember.id + "> to " + newRank.toUpperCase() + "! Son, I am disappoint.")
                                .then(() => {
                                    guildMember.setNickname(newNick).catch(error => sendPrivError(error, channel, "set Nickname"));
                                });

                            if (role) {
                                let newRole = guild.roles.find(val => val.id === role.id);
                                guildMember.addRole(newRole)
                                    .then(() => {
                                        resolve();
                                    })
                                    .catch(error => {
                                        sendPrivError(error, channel, "add Role");
                                        reject();
                                    });
                            } else {
                                resolve();
                            }
                        })
                        .catch(error => {
                            sendPrivError(error, channel, "remove Role");
                            reject(error);
                        });

                })
                .catch(error => {
                    console.log(error);
                });
        }
    });
}

function findRelevantRole(user) {
    return new Promise((resolve, reject) => {
        let userroles = user.roles;
        let aRoles = [];
        let counter = 0;
        if (userroles.length !== 0) {
            userroles.forEach(item => {
                rolestorage.getRoleById(item)
                    .then(role => {
                        counter++;
                        if (role) {
                            aRoles.push(role);
                        }
                        if (counter === userroles.length) {
                            if (aRoles.length > 1) {
                                // We have more than one role. This smells like a corrupted user that needs manual fixing.
                                reject({ action: 2, error: "More than one rank-role found. Manual fixing needed!" });
                            } else if (aRoles.length === 1) {
                                user.rankrole = aRoles[0];
                                resolve(user);
                            } else {
                                resolve(user);
                            }
                        }
                    })
                    .catch(error => {
                        // No role found. Nothing to do here.
                        reject(error);
                    });
            });
        } else {
            resolve(user);
        }
    });
}

function sendPrivError(error, channel, action) {
    console.error("CRITICAL ERROR: Missing Permissions for action. Action: " + action);
    console.error(error);
    channel.send("Missing priviledges to '" + action + "'. Please check bot role and/or hierarchy!");
    bot.lockBot(channel);
}