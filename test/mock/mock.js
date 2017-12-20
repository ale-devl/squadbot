const mocks = {
    "discord.js": require("./modules/discord"),
    "../bot/config": require("./util/config"),
    "./config": require("./util/config"),
    "../util/health_checker": require("./util/health_checker"),
    "../util/mysql_handler": require("./util/mysql_handler"),
    "../util/command_parser": require("./util/command_parser")
};

exports.getMockFor = function(name) {
    name = convertName(name);
    if(mocks[name] != null) {
        return mocks[name];
    } else {
        throw({error: "No mock available for: " + name})
    }
};

exports.getSpiesFor = function(name) {
    name = convertName(name);
    if(mocks[name] != null) {
        return mocks[name].getSpies();
    } else {
        throw({error: "No mock available for: " + name})
    }
};

exports.full = function() {
    let fullMock = {};
    Object.keys(mocks).forEach(key => {
        fullMock[key] = mocks[key].full();
    });
    return fullMock;
}();

exports.resetSpies = function() {
    Object.keys(mocks).forEach(key => {
        mocks[key].resetSpies();
    });
};

function convertName(name) {
    switch(name) {
        case "config":
            return "../bot/config";
        case "health_checker":
        case "mysql_handler":
        case "command_parser":
            return "../util/" + name;
        default:
            return name;
    }
};