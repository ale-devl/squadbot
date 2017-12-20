const mocks = require("../../mock/mock");

describe("bot.js", () => {
    describe("init", () => {
        let discordSpies = mocks.getSpiesFor("discord.js");
        let configSpies = mocks.getSpiesFor("config");
        let healthCheckSpies = mocks.getSpiesFor("health_checker");

        afterEach(() => {
            mocks.resetSpies();
        });

        it("should initialise without errors and call all functions", done => {
            let bot = proxyquire('../api/bot/bot', mocks.full);

            bot.init()
                .then(() => {
                    discordSpies.client.should.have.been.calledOnce;
                    discordSpies.botLogin.should.have.been.calledOnce;
                    discordSpies.botOn.should.have.been.calledOnce;

                    configSpies.loadConfig.should.have.been.calledOnce;

                    healthCheckSpies.singleHealthCheck.should.have.been.calledOnce;
                    healthCheckSpies.registerHealthChecks.should.have.been.calledOnce;

                    done();
                })
                .catch(error => {
                    console.log(error);
                });
        });
    });
});