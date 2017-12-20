const sinon = require("sinon");

let oSpies = {};

const fnLoadConfig = function() {
    this.settings.adminRoles = ["Mockrole"];
    this.settings.requiredPermissions = ["Mockpermission"];
    this.settings.guildId = "MockGuildId";
    this.settings.botCmdId = "MockChannelId";
};

oSpies.loadConfig = sinon.spy(fnLoadConfig);

let fullMock = {
    name: "Mockname",
    prefix: ">",
    token: "Mocktoken",

    settings: {
        adminRoles: [],
        requiredPermissions: [],
        guildId: "",
        botCmdId: ""
    },

    mysql: {
        url: "Mockurl",
        user: "Mockuser",
        password: "Mockpassword",
        database: "Mockdatabase"
    },

    loadConfig: oSpies.loadConfig,
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