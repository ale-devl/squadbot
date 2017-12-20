const sinon = require("sinon");

const oSpies = {};

let fnSend = function () {
    return new Promise((resolve, reject) => {
        resolve();
    })
};

oSpies.channelSend = sinon.spy(fnSend);

const oChannel = {
    send: oSpies.channelSend
};

const fnChannelFind = function () {
    return oChannel;
};

oSpies.channelFind = sinon.spy(fnChannelFind);

const oChannels = {
    find: oSpies.channelFind
};

const oGuild = {
    channels: oChannels
};

const fnGuildFind = function () {
    return oGuild;
};

oSpies.guildFind = sinon.spy(fnGuildFind);

const oGuilds = {
    find: oSpies.guildFind
};

const fnLogin = function () {
    return new Promise((resolve, reject) => {
        resolve();
    });
};

oSpies.botLogin = sinon.spy(fnLogin);

const fnOn = function(condition, callback) {};

oSpies.botOn = sinon.spy(fnOn);

const oBot = {
    guilds: oGuilds,
    login: oSpies.botLogin,
    on: oSpies.botOn
};

const fnClient = function () {
    return oBot;
};

oSpies.client = sinon.spy(fnClient);

let fullMock = {
    Client: oSpies.client,
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
