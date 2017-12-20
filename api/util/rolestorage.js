const mysqlHandler = require("../util/mysql_handler");

// Local cache
let roles = {};
exports.getRoleNames = function () {
    return new Promise((resolve, reject) => {
        let roles = [];
        mysqlHandler.getConnection().then(connection => {
            connection.query("SELECT name FROM roles;", (err, rows) => {
                if (err)
                    reject(err);

                rows.forEach(row => {
                    roles.push(row.name);
                });
                resolve(roles);
            });
        });
    })
};

exports.getRoleByName = function (name) {
    name = name.toUpperCase();
    return new Promise((resolve, reject) => {
        if (roles[name]) {
            resolve(roles[name]);
        } else {
            mysqlHandler.getConnection().then(connection => {
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
            })
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
        mysqlHandler.getConnection().then(connection => {
            connection.one("SELECT * FROM roles WHERE id = ?", id, (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!row) {
                    // Nothing returned when nothing is found. Makes sense, huh?
                    resolve();
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
        mysqlHandler.getConnection().then(connection => {
            connection.one("SELECT * FROM roles WHERE rank = ?", rank, (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!row) {
                    resolve();
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

exports.getRoleByLowestRank = function () {
    // Check the cache
    return new Promise((resolve, reject) => {

        // If we arrive at this point we didn't find the requested role in our local Cache. Let's look in the database instead.
        mysqlHandler.getConnection().then(connection => {
            connection.one("SELECT * FROM roles WHERE rank = (SELECT MAX(rank) FROM roles)", (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!row) {
                    reject({ error: "Couldn't get lowest rankrole" });
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

exports.getRoleByHighestRank = function () {
    // Check the cache
    return new Promise((resolve, reject) => {
        // If we arrive at this point we didn't find the requested role in our local Cache. Let's look in the database instead.
        mysqlHandler.getConnection().then(connection => {
            connection.one("SELECT * FROM roles WHERE rank = (SELECT MIN(rank) FROM roles)", (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!row) {
                    reject({ error: "Couldn't get highest rankrole" });
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

exports.checkAuthorizationForRoleIds = function (ids) {
    return new Promise((resolve, reject) => {
        if (ids.length === 0) {
            resolve(false);
        }

        mysqlHandler.getConnection().then(connection => {
            connection.one("SELECT * FROM adminRoles WHERE id = ?", ids, (err, row) => {
                if (err) {
                    reject(err);
                }
                resolve(row ? true : false);
            });
        });
    });
};