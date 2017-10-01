/**
 * Created by aletuna on 08/08/17.
 */
exports.execute = function(args) {
    args.msg.channel.send("ph");
};

exports.getDescription = function ()
{
    return {
        name: "degrade",
        desc: "Degrades someone.",
        args: [{
                name: 'name',
                desc: 'Name of the guy that disappointed you. Note: For now the name has to be -exact-. I will simplify that later.',
                type: 'string',
                required: true
            }],
        example: "> degrade Flufflz"
    };
};


exports.isUsingArguments = function() {
    return false;
};