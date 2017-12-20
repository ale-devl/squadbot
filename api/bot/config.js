const mysqlHandler = require("../util/mysql_handler");
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

    settings: {
        adminRoles: [],
        requiredPermissions: [],
        guildId: "",
        botCmdId: ""
    },

    mysql: {
        url: process.env.mysqlUrl,
        user: process.env.mysqlUser,
        password: process.env.mysqlPassword,
        database: process.env.mysqlDB
    },

    loadConfig: function() {
        mysqlHandler.getConnection().then(connection => {
            connection.query("SELECT * FROM adminRoles", (err, rows) => {
                if (rows) {
                    for (let i = 0; i < rows.length; ++i) {
                        this.settings.adminRoles.push(rows[i].id);
                    }
                }
            });
            connection.query("SELECT * FROM permissions", (err, rows) => {
                if (rows) {
                    for (let i = 0; i < rows.length; ++i) {
                        this.settings.requiredPermissions.push(rows[i].name);
                    }
                }
            });
            connection.one("SELECT * FROM settings", (err, row) => {
                if (row) {
                    Object.keys(row).forEach(key => {
                        this.settings[key] = row[key];
                    });
                }
            });
        });
    }
};
