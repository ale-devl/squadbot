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
            if (err.code === "PROTOCOL_CONNECTION_LOST") { // Connection to the MySQL server is usually
                createConnection();                       // lost due to either server restart, or a
            } else {
                console.log(err.code);                    // connection idle timeout (the wait_timeout
                throw err;                                // server variable configures this)
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
