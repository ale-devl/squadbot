const sinon = require("sinon");

let oSpies = {};

const fnParseAndDispatch = function() {};

oSpies.parse_and_dispatch = sinon.spy(fnParseAndDispatch);

let fullMock = {
    parse_and_dispatch: oSpies.parse_and_dispatch,
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