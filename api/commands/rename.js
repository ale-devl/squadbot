const authChecker = require("../util/auth_checker");
const userstorage = require("../util/userstorage");
const fixname = require("./fixName");

exports.execute = function (args) {
    args.mentionString = args.arguments[0];
    let regex = new RegExp("> rename " + args.mentionString + " ", "ig");
    args.newNick = args.msg.content.replace(regex, "");
    handleRename(args);
};

exports.getDescription = function () {
    return {
        name: "rename",
        desc: "Renames a Member. Permissions required!",
        args: [{
            name: 'name',
            desc: 'Name of the Member that should be renamed. This needs to be a mention.',
            type: 'string',
            required: true
        }],
        example: "> rename @flufflz no more flufflz"
    };
};

exports.isUsingArguments = function () {
    return false;
};

function handleRename(args) {
    let callerId = args.msg.member.id;
    let targetId = args.mentionString.replace(/<|!|@|>/g, "");
    let channel = args.msg.channel;
    let guild = args.msg.guild;

    authChecker.checkAuthorization(callerId)
        .then(() => guild.members.find("id", targetId))
        .then(member => {
            member.setNickname(args.newNick)
                .then(() => {
                    fixname.fixUser(member.nickname, member.guild);
                });
        });
}