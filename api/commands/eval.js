const bot = require("../bot/bot");

exports.execute = function (args) {

    let bot = getBot();
    let memberId = args.msg.member.id;
    let coding = args.msg.content.replace("> eval ", "");
    if (memberId !== "166154532714184704") {
        args.msg.channel.send("No permission.");
        return;
    }

    try {
        eval(coding);
    } catch (e) {
        console.log(e);
    }
};

exports.getDescription = function () {
    return {
        name: "eval",
        desc: "Nothing to see here. No really, nothing at all!",
        args: [],
        example: "No example given because there REALLY is nothing to see here!",
        adminCommand: true
    };
};

exports.isUsingArguments = function () {
    return false;
};

function getBot() {
    return bot.getBot();
}