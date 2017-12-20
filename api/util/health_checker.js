const bot = require("../bot/bot.js");
const mysqlHandler = require("../util/mysql_handler");
const cfg = require("../../config");
const rolestorage = require("../util/rolestorage");

exports.registerHealthChecks = function (interval) {
    console.log("Registered Healthchecks with interval: " + interval / 1000 + " seconds.");
    setTimeout(performHealthCheck, interval, interval);
};

function performHealthCheck(interval) {
    console.log("Start of Healthcheck");
    checkDatabaseConnection()
        .then(checkPermissions)
        .then(checkEnvVariables)
        .then(() => {
            console.log("End of Healthcheck. Next one in " + interval / 1000 + " seconds.");
            setTimeout(performHealthCheck, interval, interval);
        })
        .catch(err => {
            console.log("Healthcheck finished with errors. Err: " + err);
            bot.reportToOwner("Healthcheck finished with errors!");
        });
};

function checkDatabaseConnection() {
    return new Promise((resolve, reject) => {
        mysqlHandler.testDatabase()
            .then(() => {
                console.log("Healthcheck: Database is fine!")
                resolve();
            })
            .catch(err => {
                bot.reportToOwner("Healthcheck: Got a Database error: " + err);
                reject(err);
            });
    });
}

function checkPermissions() {
    return new Promise((resolve, reject) => {
        console.log("Healthcheck: Checking permissions...");
        let guild = bot.getBot().guilds.find("id", cfg.settings.guildId);
        let missingPermissions = false;

        cfg.settings.requiredPermissions.forEach(permission => {
            if (!guild.me.hasPermission(permission)) {
                let errorMessage = "Healthcheck: Missing permission '" + permission + "'!";
                console.log(errorMessage);
                bot.reportToOwner(errorMessage);
                missingPermissions = true;
            }
        });

        rolestorage.getRoleByHighestRank()
            .then(role => {
                if (guild.roles.find("id", role.id).position > guild.me.highestRole.position) {
                    let errorMessage = "Healthcheck: Not high enough in Hierarchy!";
                    console.log(errorMessage);
                    bot.reportToOwner(errorMessage);
                    missingPermissions = true;
                }

                if (missingPermissions) {
                    console.log("Healthcheck PermissionCheck finished with errors.");
                    reject();
                } else {
                    console.log("Healthcheck: PermissionCheck finished successfully");
                    resolve();
                }
            });
    });
}

function checkEnvVariables() {
    return new Promise((resolve, reject) => {
        let missingVariables = [];

        switch (undefined) {
            case cfg.mysql.url:
                missingVariables.push("url");
                break;
            case cfg.mysql.user:
                missingVariables.push("user");
                break;
            case cfg.mysql.password:
                missingVariables.push("password");
                break;
            case cfg.mysql.database:
                missingVariables.push("database");
                break;
        }

        if (missingVariables.length > 0) {
            bot.reportToOwner("Healthcheck: Missing the following Variables: " + missingVariables);
            reject();
        } else {
            console.log("Healthcheck: Environment Variables are fine!")
            resolve();
        }
    });
}