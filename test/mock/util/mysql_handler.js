const sinon = require("sinon");

let oSpies = {};

const adminRole = { id: "mockRoleId" };
const adminRoleRows = [adminRole];

const permission = { name: "mockPermission" };
const permissionRows = [permission];

const role = {
    id: "mockRoleId",
    name: "mockRoleName",
    exact_name: "exactMockRoleName",
    rank: 1337
};
const roleRows = [role];

const fnQuery = function (query, callback) {
    if (query.indexOf("adminRoles") !== -1) {
        callback(null, adminRoleRows);
        return;
    }
    if (query.indexOf("roles") !== -1) {
        callback(null, roleRows);
        return;
    }
    if (query.indexOf("permissions") !== -1) {
        callback(null, permissionRows);
        return;
    }
    callback({error: "MockError"});
};

oSpies.dbQuery = sinon.spy(fnQuery);

const user = {
    id: "mockUserId",
    name: "mockUserName",
    isAdmin: 1
};
const settings = {
    guildId: "mockGuildId",
    botCmdId: "mockBotChannelId"
};

const fnOne = function(query, callback) {
    if (query.indexOf("adminRoles") !== -1) {
        callback(null, adminRole);
        return;
    }
    if (query.indexOf("roles") !== -1) {
        callback(null, role);
        return;
    }
    if (query.indexOf("users") !== -1) {
        callback(null, user);
        return;
    }
    if (query.indexOf("settings") !== -1) {
        callback(null, settings);
        return;
    }
    callback({error: "MockError"});
};

oSpies.dbOne = sinon.spy(fnOne);

const fnPing = function(callback) {
    callback();
};

oSpies.dbPing = sinon.spy(fnPing);

const fnDestroy = function() {};

oSpies.dbDestroy = sinon.spy(fnDestroy);

const fnOn = function(condition, callback) {};

oSpies.dbOn = sinon.spy(fnOn);

const database = {
    query: oSpies.dbQuery,
    one: oSpies.dbOne,
    ping: oSpies.dbPing,
    destroy: oSpies.dbDestroy,
    on: oSpies.dbOn
};

const fnGetConnection = function () { resolve(database); };

oSpies.getConnection = sinon.spy(fnGetConnection);

const fnTestDatabase = function () {
    return new Promise((resolve, reject) => {
        resolve();
    });
};

oSpies.testDatabase = sinon.spy(fnTestDatabase);

let fullMock = {
    getConnection: oSpies.getConnection,
    testDatabase: oSpies.testDatabase,
    "@noCallThru": true /* If this is true it surpresses the call through to the module. In this case non-mocked functions/properties won't be present
                           If set to false it will overwrite everything that we mock and keep the rest as "live data" */
};

exports.full = function () {
    return fullMock;
};

exports.getSpies = function (name) {
    if (oSpies[name]) {
        return oSpies[name];
    }
    else {
        return oSpies;
    }
};

exports.resetSpies = function (name) {
    if (oSpies[name]) {
        return oSpies[name];
    } else {
        Object.keys(oSpies).forEach(key => {
            oSpies[key].reset();
        });
    }
};