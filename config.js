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

    // Required permissions
    permissions: [
        "MANAGE_NICKNAMES",
        "SEND_MESSAGES",
        "MANAGE_ROLES"
    ],

    // This will be done dynamically. Just a infodump -> Is this comment outdated?
    settings: {
        adminRoles: [],
        guildId: "361929815483482112", // Local: 361929815483482112
        botCmdId: "361929815483482114" // Local: 361929815483482114
    },

    // NYI
    mysql: {
        url: process.env.mysqlUrl,
        user: process.env.mysqlUser,
        password: process.env.mysqlPassword,
        database: process.env.mysqlDB
    }
};
