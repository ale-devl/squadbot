/**
 *  TODO: Make this dynamic because static things are bad news
 */

const mysqlHandler = require("../util/mysql_handler");
const db = mysqlHandler.getConnection();

// Local cache
let roles = {};

exports.getRoleByName = function (name) {
    name = name.toUpperCase();
    return new Promise((resolve, reject) => {
        if (roles[name]) {
            resolve(roles[name]);
        } else {
            db.then(connection => {
                connection.one("SELECT * FROM roles WHERE name = ?", name, (err, row) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (!row) {
                        reject({ error: "No role found for name: " + name });
                        return;
                    }
                    let role = {
                        id: row.id,
                        name: row.name,
                        exactname: row.exact_name,
                        rank: row.rank
                    };
                    roles[row.name] = role;
                    resolve(role);
                });
            });
        }
    });
};

exports.getRoleById = function (id) {
    return new Promise((resolve, reject) => {
        // Check the cache. Todo: Write a general function for this stuff
        Object.keys(roles).forEach(key => {
            if (roles[key].id === id) {
                resolve(roles[key]);
                return;
            }
        });

        // If we arrive at this point we didn't find the requested role in our local Cache. Let's look in the database instead.
        db.then(connection => {
            connection.one("SELECT * FROM roles WHERE id = ?", id, (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!row) {
                    reject({ error: "No role found for id: " + id });
                    return;
                }
                let role = {
                    id: row.id,
                    name: row.name,
                    exactname: row.exact_name,
                    rank: row.rank
                };
                roles[row.name] = role;
                resolve(role);
            });
        });
    });
};

exports.getRoleByRank = function (rank) {
    // Check the cache
    return new Promise((resolve, reject) => {
        Object.keys(roles).forEach(key => {
            if (roles[key].rank === rank) {
                resolve(roles[key]);
                return;
            }
        });

        // If we arrive at this point we didn't find the requested role in our local Cache. Let's look in the database instead.
        db.then(connection => {
            connection.one("SELECT * FROM roles WHERE rank = ?", rank, (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!row) {
                    reject({ error: "No role found for rank: " + rank });
                    return;
                }
                let role = {
                    id: row.id,
                    name: row.name,
                    exactname: row.exact_name,
                    rank: row.rank
                };
                roles[row.name] = role;
                resolve(role);
            });
        });
    });
};