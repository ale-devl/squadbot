let bot = require("./api/bot/bot.js");
bot.init();

process.on('uncaughtException', err => {
    console.log("Uncaught Exception: " + err);
    console.log('Logging out of Discord and then quitting process...');

    bot.getBot().fetchUser("166154532714184704")
        .then(owner => {
            console.log("err: " + err);
            owner.send("Uncaught Exception: " + err).then(() => {
                bot.destroy()
                    .then(() => {
                        process.exit(1);
                    });
            });
        })
        .catch(error => {
            console.log(error);
        });
});
