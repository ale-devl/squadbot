const sinon = require("sinon");

let oSpies = {};

const fnRegisterHealthChecks = function() {};

oSpies.registerHealthChecks = sinon.spy(fnRegisterHealthChecks);

const fnSingleHealthCheck = function() {
    return new Promise((resolve, reject) => {
        resolve();
    });
};

oSpies.singleHealthCheck = sinon.spy(fnSingleHealthCheck);

let fullMock = {
    registerHealthChecks: oSpies.registerHealthChecks,
    singleHealthCheck: oSpies.singleHealthCheck,
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