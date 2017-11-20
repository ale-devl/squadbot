const mysql = require("mysql");
const mysqlSettings = {
    host: process.env.mysqlUrl,
    user: process.env.mysqlUser,
    password: process.env.mysqlPassword,
    database: "squadbot",
    multipleStatements: false
};
const nodeSql = require("nodesql");

let db = null;
let connection = null;

exports.getConnection = function () {
    return new Promise((resolve, reject) => {
        if (db) {
            resolve(db);
        } else {
            createConnection().then(() => {
                resolve(db);
            })
            .catch((error) => {
                // Something went wrong. Let's try one more time before panicking
                createConnection().then(() => {
                    resolve(db);
                })
                .catch((error) => {
                    reject(error);
                })
            });
        }
    });
};

function createConnection() {
    return new Promise((resolve, reject) => {
        if (connection)
            connection.destroy();

        connection = mysql.createConnection(mysqlSettings);
        connection.on("error", function (err) {
            switch(err.code) {
                case "PROTOCOL_CONNECTION_LOST":
                case "PROTOCOL_PACKETS_OUT_OF_ORDER":
                    createConnection();
                    break;
                default:
                    reject(err);
            }
        });

        db = nodeSql.createMySqlStrategy(connection);

        if (!db) {
            // Can't connect to database.
            reject({ error: "Error connecting to database." });
        }
        resolve();
    });
}
