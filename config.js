module.exports = {

    // Your bot name. Typically, this is your bot's username without the discriminator.
    // i.e: if your bot's username is MemeBot#0420, then this option would be MemeBot.
    name: "SweetieBot",

    // The bot's command prefix. The bot will recognize as command any message that begins with it.
    // i.e: "-sb foo" will trigger the command "foo",
    //      whereas "SweetieBot foo" will do nothing at all.
    prefix: "!sb",

    // Your bot's user token. If you don't know what that is, go here:
    // https://discordapp.com/developers/applications/me
    // Then create a new application and grab your token.
    token: "MjkwMTE2Njc4NzU3NTE1MjY0.C6WR7g.wZZeFVwSlCnPh5QZ9QLbar8Wi5A",

    // If this option is enabled, the bot will delete the message that triggered it, and its own
    // response, after the specified amount of time has passed.
    // Enable this if you don't want your channel to be flooded with bot messages.
    // ATTENTION! In order for this to work, you need to give your bot the following permission:
    // MANAGE_MESSAGES - 	0x00002000
    // More info: https://discordapp.com/developers/docs/topics/permissions
    deleteAfterReply: {
        enabled: true,
        time: 15000 // In milliseconds
    }
};
