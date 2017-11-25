const userstorage = require("../util/userstorage");
const rolestorage = require("../util/rolestorage");
const authChecker = require("../util/auth_checker");

exports.execute = function (args) {
    let callerId = args.msg.member.id;
    let username = args.msg.content.replace(/> fixName /ig, "");
    authChecker.checkAuthorization(callerId)
        .then(handleFixname(username, args.msg.guild));
};

exports.getDescription = function () {
    return {
        name: "fixname",
        desc: "Attempts to fix a users Nickname. (Wrong rank in nick)",
        args: [{
            name: 'name',
            desc: 'Name of the Member that needs fixing. Partial Name is possible but must be unique.',
            type: 'string',
            required: true
        }],
        example: "> fixName flufflz"
    };
};

exports.fixUser = function (user, guild) {
    handleFixname(user, guild);
};

exports.isUsingArguments = function () {
    return false;
};

function handleFixname(username, guild) {
    if (!username || !guild)
        return;
        
    userstorage.getUserByName(username)
        .then(user => findRelevantRole(user))
        .then(user => {
            if (!user.rankrole)
                return;

            rolestorage.getRoleNames()
                .then(roles => {
                    let member = guild.members.find("id", user.id);
                    let currentNick = member.nickname ? member.nickname : member.user.username;
                    let roleFound = false;

                    roles.forEach(role => {
                        if (currentNick.indexOf(role) !== -1) {
                            member.setNickname(currentNick.replace(role, user.rankrole.name));
                            roleFound = true;
                        }
                    });

                    if (!roleFound)
                        member.setNickname(user.rankrole.name + " " + currentNick);
                })
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