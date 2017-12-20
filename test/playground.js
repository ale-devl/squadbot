const mocks = require("./mock/mock");

describe("playground one", () => {
    describe("one", () => it("should execute properly", done => {
        let discordMock = mocks.getMockFor("discord.js");
        let discordSpies = discordMock.getSpies();
        let bot = proxyquire('../api/bot/bot', mocks.full);

        discordSpies.client.should.have.been.calledOnce;
        discordMock.resetSpies();
        discordSpies.client.should.not.have.been.calledOnce;
        done();
    }));
});