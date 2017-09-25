/**
 * Created by aletuna on 08/08/17.
 */
exports.execute = function(args) {
    args.msg.channel.send("WHO YA CALLIN A FOO, FOO?");
};

exports.getDescription = function ()
{
    return {
        name: "foo",
        desc: "You know what it does....",
        args: [],
        example: "-sb foo"
    };
};


exports.isUsingArguments = function() {
    return false;
};