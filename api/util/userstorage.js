/**
 *  TODOS: 
 *  Add database "cache"
 */

const bot = require("../bot/bot.js").getBot();

let userStorage = {};

/*
    User structure:
    id
    name (in upper)
    roles
*/

exports.getUserByName = function (name) {
    let uppername = name.toUpperCase();
    return new Promise((resolve, reject) => {
        if (userStorage[uppername]) {
            resolve(userStorage[uppername]);
        }
        else {
            getNewUser(uppername)
                .then((user) => {
                    resolve(user);
                })
                .catch(error => {
                    reject(error);
                });
        }
    });
}

function getNewUser(name) {
    return new Promise((resolve, reject) => {
        let guild = bot.guilds.find("id", "361929815483482112");
        let user = {};
        let member = guild.members.filter(member => {
            if (member.user.username.toUpperCase() === name) {
                return true;
            }
            return false;
        }).first();

        if (!member) {
            reject({ error: "No user found for name: " + name });
            return;
        }

        user.id = member.user.id;
        user.name = member.user.username.toUpperCase();
        user.roles = member._roles;
        userStorage[name] = user;
        resolve(user);
    })
};