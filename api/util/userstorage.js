const bot = require("../bot/bot");
const mysqlHandler = require("../util/mysql_handler");
const cfg = require("../bot/config");
let userStorage = {};

/*
    TODO: Check if up to date
    User structure:
    {string} id
    {string} name (in upper)
    {array} roles 
    (rankRole)
*/

exports.getUserByName = function (name) {
    let uppername = name.toUpperCase();
    return new Promise((resolve, reject) => {
        if (userStorage[uppername] && !userStorage[uppername].needsUpdate) {
            resolve(userStorage[uppername]);
        }
        else {
            getNewUser(uppername)
                .then((user) => {
                    user.needsUpdate = true;
                    resolve(user);
                })
                .catch((error) => {
                    reject(error);
                });
        }
    });
}

exports.checkAuthorizationForId = function (id) {
    return new Promise((resolve, reject) => {
        mysqlHandler.getConnection().then(connection => {
            connection.one("SELECT * FROM users WHERE id = ? AND isAdmin = 1", id, (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(row ? true : false);
            });
        });
    });
}

function getNewUser(name) {
    return new Promise((resolve, reject) => {
        let guild = bot.getBot().guilds.find("id", cfg.settings.guildId);
        let user = {};
        let member = guild.members.filter(member => {
            if (member.nickname) {
                return member.nickname.toUpperCase().indexOf(name.toUpperCase()) !== -1 ? true : false;
            } else {
                return member.user.username.toUpperCase().indexOf(name.toUpperCase()) !== -1 ? true : false;
            }
        });

        if (member.size > 1) {
            let members = [];
            member.forEach(item => {
                members.push(item.nickname ? item.nickname : item.user.username);
            });
            reject({ action: 0, error: "More than one user found.", members: members });
        }

        else member = member.first();

        if (member) {
            user.id = member.user.id;
            user.name = member.nickname ? member.nickname.toUpperCase() : member.user.username.toUpperCase();
            user.roles = member._roles;
            userStorage[name] = user;
            resolve(user);
        }

        reject({ action: 1, error: "No user found" });
    });
};