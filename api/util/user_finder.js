/**
 * Created by aletuna on 08/08/17.
 */
const bot = require("../bot/bot.js").getBot();

let userStorage = {};

/*
    User structure:
    id
    name
    roles
*/

exports.find_user_by_name = function (name)
{
    if(!userStorage[name])
        return find_new_user(name);
    else
        return userStorage[name];
}

find_new_user = function(name)
{
    return new Promise((resolve, reject) => {
        let guild = bot.guilds.find("id", "361929815483482112");
        let user = {};
        let member = guild.members.filter(member => {
            if(member.user.username === name)
            {
                return true;
            }
            return false;
        }).first();

        if(!member)
            reject();

        user.id = member.user.id;
        user.name = member.user.username;
        user.roles = member._roles;
        userStorage[name] = user;
        resolve(user);
    })
};