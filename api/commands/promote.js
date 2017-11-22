const bot = require("../bot/bot.js");
const userstorage = require("../util/userstorage");
const rolestorage = require("../util/rolestorage");
const cfg = require("../../config");

exports.execute = function (args) {
    // Workaround. Parser needs proper fixing
    args.arguments = args.msg.content.replace(/> promote /ig, "");
    handlePromotion(args);
};

exports.getDescription = function () {
    return {
        name: "promote",
        desc: "Promotes someone.",
        args: [{
            name: 'name',
            desc: 'Name of the guy that gets a promotion. Note: For now the name has to be -exact-. I will simplify that later.',
            type: 'string',
            required: true
        }],
        example: "> promote flufflz"
    };
};

// members[i]._roles[i] = String(id)
// members[i].user.username = String(name)
// members[i].user.id = String(id)

function handlePromotion(args) {
    let callerId = args.msg.member.id;
    let name = args.arguments;
    let channel = args.msg.channel;

    userstorage.getUserByName(name)
        .then(user => findRelevantRole(user))
        .then(user => checkAuthorization(user, callerId))
        .then(user => modifyUserRole(bot, channel, user))
        .catch(error => {
            switch (error.action) {
                case 0:
                    channel.send("More than one Users found for name: " + name + ". Please be more specific! Found members: " + error.members);
                    break;
                case 1:
                    channel.send("No recruit named \"" + name + "\" found.");
                    break;
                case 2:
                    channel.send("<@" + callerId + "> You have no authorization.");
                    break;
                case 3:
                    channel.send("User " + name + " has more than one rank role. Please make sure he or she only has one before promoting him or her!");
                    break;
                default:
                    console.log(error);
                    break;
            };
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
                                reject({ action: 3, error: "More than one rank-role found. Manual fixing needed!" });
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

function checkAuthorization(user, callerId) {
    return new Promise((resolve, reject) => {
        userstorage.checkAuthorizationForId(callerId)
            .then(found => {
                if (found) {
                    resolve(user);
                }
                else
                    resolve(false);
            })
            .then(found => {
                if (found) {
                    resolve(user);
                } else {
                    reject({ action: 2, error: "No authorization" });
                }
            });
    })
}

function modifyUserRole(bot, channel, user) {
    return new Promise((resolve, reject) => {
        let guild = bot.getBot().guilds.find(val => val.id === bot.getGuildId());
        let guildMember = guild.members.find(val => val.id === user.id);

        if (!user.rankrole) {
            rolestorage.getRoleByLowestRank()
                .then(role => {
                    let newRole = guild.roles.find(val => val.id === role.id);
                    let newNick = "";
                    let oldNick = guildMember.nickname ? guildMember.nickname : guildMember.user.username;

                    if (oldNick.indexOf(role.name) !== -1) {
                        newNick = role.name + " " + oldNick;
                    } else {
                        newNick = role.name + " " + oldNick;
                    }

                    if (!newRole) {
                        reject({ error: "New role couldn't be found!" });
                    }

                    guildMember.addRole(newRole).catch(error => sendPrivError(error, channel, "add Role"));
                    channel.send("Welcome to the squad <@" + guildMember.id + ">! You new rank is:  " + role.name.toUpperCase() + "! Now get out there and make me proud!")
                        .then(() => {
                            guildMember.setNickname(newNick).catch(error => sendPrivError(error, channel, "set Nickname"));
                            resolve();
                        });
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            if (user.rankrole.rank - 1 === 0) {
                channel.send("<@" + guildMember.id + "> already has the highest rank possible. Do you want this one takes over the world or something?!");
            }
            rolestorage.getRoleByRank(user.rankrole.rank - 1)
                .then(role => {
                    if (role) {
                        let oldRole = guild.roles.find(val => val.id === user.rankrole.id);
                        let newRole = guild.roles.find(val => val.id === role.id);
                        let newNick = "";

                        if (!oldRole || !newRole) {
                            reject({ error: "Either old or new role couldn't be found!" });
                        }

                        if (guildMember.nickname && guildMember.nickname.indexOf(user.rankrole.name) !== -1) {
                            newNick = guildMember.nickname.replace(user.rankrole.name, role.name);
                        } else {
                            newNick = role.name + " " + guildMember.user.username;
                        }

                        guildMember.removeRole(oldRole)
                            .then(guildMember.addRole(newRole).catch(error => sendPrivError(error, channel, "add Role")))
                            .then(() => {
                                channel.send("Promoted <@" + guildMember.id + "> to " + role.name + "! Keep up the good work recruit!")
                                    .then(() => {
                                        guildMember.setNickname(newNick).catch(error => sendPrivError(error, channel, "set Nickname"));
                                        resolve();
                                    });
                            })
                            .catch(error => {
                                sendPrivError(error, cahnnel, "remove Role");
                                reject(error);
                            });
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    });
}

function sendPrivError(error, channel, action) {
    console.error("CRITICAL ERROR: Missing Permissions for action. Action: " + action);
    console.error(error);
    channel.send("Missing priviledges to '" + action + "'. Please check bot role and/or hierarchy!");
}

exports.isUsingArguments = function () {
    return false;
};