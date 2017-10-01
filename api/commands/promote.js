/**
 * Created by aletuna on 08/08/17.
 */
const bot = require("../bot/bot.js").getBot();

exports.execute = function (args) {
    handlePromotion(args.arguments[0]);
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

function handlePromotion(name) {
    console.log(bot);
}

exports.isUsingArguments = function () {
    return true;
};