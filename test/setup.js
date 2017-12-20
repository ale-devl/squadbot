"use strict";

prepareChai()
    .then(setupSinon)
    .then(setupRest)
    .then(beginTestExecutions)
    .catch(error => {
        console.error(error);
        process.exit(0);
    });

function prepareChai() {
    return new Promise((resolve, reject) => {
        const chai = require("chai");
        const sinonChai = require("sinon-chai");

        chai.should();
        chai.use(sinonChai);

        Object.defineProperties(global, {
            assert: { value: chai.assert },
            expect: { value: chai.expect }
        });

        resolve();
    })
}

function setupSinon() {
    const sinon = require("sinon");
    const chai = require("chai");
    const sinonStubPromise = require("sinon-stub-promise");

    sinonStubPromise(sinon);
    sinon.assert.expose(chai.assert, { prefix: "" });

    Object.defineProperty(global, "sinon", { value: sinon });
}

function setupRest() {
    const proxyquire = require("proxyquire");
    require("rewire-global").enable();

    Object.defineProperty(global, "proxyquire", { value: proxyquire });
}

function beginTestExecutions() {
    // Because this is executed by a promise's `then` call, it is conveniently
    // executed in the next tick, which happens after all the tests have been
    // queued and after `run` has been added to the `global` object.
   global.run();
}
