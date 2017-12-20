const bot = require("../bot/bot");
const mysqlHandler = require("../util/mysql_handler");
const cfg = require("../bot/config");
const rolestorage = require("../util/rolestorage");

exports.registerHealthChecks = function (interval) {
    console.log("Registered Healthchecks with interval: " + interval / 1000 + " seconds.");
    setTimeout(performHealthCheck, interval, interval);
};

exports.singleHealthCheck = function () {
    return new Promise((resolve, reject) => {
        console.log("Performing single healthcheck..");
        checkDatabaseConnection()
            .then(checkPermissions)
            .then(checkEnvVariables)
            .then(() => {
                console.log("End of Healthcheck.");
                resolve();
            })
            .catch(err => {
                console.log("Healthcheck finished with errors. Err: " + err);
                bot.reportToOwner("Healthcheck finished with errors!");
                reject(err);
            });
    });
};

function performHealthCheck (interval) {
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
            bot.lockBot(null, err);
        });
};

function checkDatabaseConnection () {
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

function checkPermissions () {
    return new Promise((resolve, reject) => {
        console.log("Healthcheck: Checking permissions...");
        let oGuild = bot.getBot().guilds.find("id", cfg.settings.guildId);
        let aMissingPermissions = false;
        let aOccuredErrors = [];

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
                if (oGuild.roles.find("id", role.id).position > oGuild.me.highestRole.position) {
                    let sErrorMessage = "Not high enough in Hierarchy!";
                    console.log("Healthcheck: " + sErrorMessage);
                    bot.reportToOwner("Healthcheck: " + sErrorMessage);
                    aOccuredErrors.push(sErrorMessage);
                    aMissingPermissions = true;
                }

                if (aMissingPermissions) {
                    console.log("Healthcheck PermissionCheck finished with errors.");
                    reject(aOccuredErrors);
                } else {
                    console.log("Healthcheck: PermissionCheck finished successfully");
                    resolve();
                }
            });
    });
}

function checkEnvVariables () {
    return new Promise((resolve, reject) => {
        let aMissingVariables = [];

        switch (undefined) {
            case cfg.mysql.url:
                aMissingVariables.push("url");
                break;
            case cfg.mysql.user:
                aMissingVariables.push("user");
                break;
            case cfg.mysql.password:
                aMissingVariables.push("password");
                break;
            case cfg.mysql.database:
                aMissingVariables.push("database");
                break;
        }

        if (aMissingVariables.length > 0) {
            let sErrorMessage = "Missing the following Environment Variables: " + aMissingVariables;
            bot.reportToOwner("Healthcheck: " + sErrorMessage);
            reject();
        } else {
            console.log("Healthcheck: Environment Variables are fine!")
            resolve();
        }
    });
}