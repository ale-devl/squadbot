module.exports = {

    // Your bot name. Typically, this is your bot's username without the discriminator.
    // i.e: if your bot's username is MemeBot#0420, then this option would be MemeBot.
    name: "Commander",

    // The bot's command prefix. The bot will recognize as command any message that begins with it.
    // i.e: "> foo" will trigger the command "foo",
    //      whereas "Commander foo" will do nothing at all.
    prefix: ">",

    // Your bot's user token. If you don't know what that is, go here:
    // https://discordapp.com/developers/applications/me
    // Then create a new application and grab your token.
    token: process.env.squadbotToken,

    // This will be done dynamically. Just a infodump
    ranks: {
        "marshal": 1,
        "general": 2,
        "colonel": 3,
        "major": 4,
        "captain": 5,
        "lieutenant": 6,
        "sergent": 7,
        "scout": 8,
        "squadmember": 9
    },

    // NYI
    mysql: {
        url: process.env.mysqlUrl,
        user: process.env.mysqlUser,
        password: process.env.mysqlPassword
    }
};
